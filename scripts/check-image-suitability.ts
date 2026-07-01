#!/usr/bin/env tsx
import { validateContent } from "@/lib/content-validation";

// All animals in the project
const targetSlugs = [
  // Batch 1 - original animals
  "african-elephant",
  "angelfish",
  "blue-whale",
  "bottlenose-dolphin",
  "chameleon",
  "cheetah",
  "chimpanzee",
  "clownfish",
  "crocodile",
  "eagle",
  "electric-eel",
  "flamingo",
  "fox",
  "gazelle",
  "giant-panda",
  "giraffe",
  "gorilla",
  "great-white-shark",
  "grizzly-bear",
  "hippopotamus",
  "kangaroo",
  "kingfisher",
  "koala",
  "komodo-dragon",
  "leopard",
  "lion",
  "meerkat",
  "moose",
  "octopus",
  "orangutan",
  "orca",
  "ostrich",
  "otter",
  "owl",
  "parrot",
  "peacock",
  "penguin",
  "peregrine-falcon",
  "platypus",
  "polar-bear",
  "pufferfish",
  "puffin",
  "raccoon",
  "red-panda",
  "rhinoceros",
  "ruby-throated-hummingbird",
  "salmon",
  "sea-turtle",
  "seahorse",
  "sloth",
  "snake",
  "swan",
  "tiger",
  "toucan",
  "tuna",
  "wildebeest",
  "wolf",
  "zebra",
  // Batch 2 - new animals
  "ladybug",
  "honeybee",
  "monarch-butterfly",
  "praying-mantis",
  "luna-moth",
  "dragonfly",
  "firefly",
  "cicada",
  "leafcutter-ant",
  "hercules-beetle",
  "galapagos-tortoise",
  "iguana",
  "frilled-lizard",
  "gila-monster",
  "tokay-gecko",
  "manta-ray",
  "whale-shark",
  "hammerhead-shark",
  "lionfish"
];

// Helper to extract file name from Wikimedia URL
function getFileNameFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const commonsIndex = parts.indexOf("commons");
    if (commonsIndex === -1 || parts.length < commonsIndex + 2) return null;
    
    if (parts[commonsIndex + 1] === "thumb") {
      return decodeURIComponent(parts[commonsIndex + 4]);
    }
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return null;
  }
}

// Fetch categories from Wikimedia Commons API
async function fetchCommonsCategories(fileName: string): Promise<string[]> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "categories");
  url.searchParams.set("titles", `File:${fileName}`);
  url.searchParams.set("cllimit", "500");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  url.searchParams.set("origin", "*");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "wildlifedb-suitability-checker/1.0" }
    });
    if (!res.ok) return [];
    const json: any = await res.json();
    const pages = json.query?.pages || [];
    if (pages.length === 0 || pages[0].missing) return [];
    
    return (pages[0].categories || []).map((cat: any) => cat.title.replace(/^Category:/, ""));
  } catch {
    return [];
  }
}

async function main() {
  const { animals } = validateContent();
  console.log("=========================================");
  console.log("   Captivity, Domestic Context & Quality Auditor");
  console.log(`   Auditing ${targetSlugs.length} animals for image suitability...`);
  console.log("=========================================\n");

  const unsuitableKeywords = [
    "aquarium", "aquaria", "fish tank", "fishtank", "aquarium fish",
    "zoo", "captivity", "captive", "cage", "pet shop", "petshop", "fishbowl", "bowl",
    "stuffed", "taxidermy", "replica", "model", "museum", "drawing", "illustration",
    "artwork", "glass reflection", "acrylic", "aquaculture", "cultivation",
    "fountain", "pond", "pool", "garden", "artificial", "domestic", "pet", "tank"
  ];

  for (const slug of targetSlugs) {
    const animal = animals.find(a => a.core.slug === slug);
    if (!animal) continue;

    const animalIssues: string[] = [];

    for (const image of animal.images) {
      const fileName = getFileNameFromUrl(image.src);
      if (!fileName) continue;

      const categories = await fetchCommonsCategories(fileName);
      const catText = categories.join(" | ").toLowerCase();
      
      const fileLower = fileName.toLowerCase();
      const altLower = (image.alt || "").toLowerCase();
      const captionLower = (image.caption || "").toLowerCase();

      const matchedFlags: string[] = [];

      // Check for captivity or suitability flags
      unsuitableKeywords.forEach(kw => {
        // For insects/bugs, allow "garden", "pet" (often false matches for larval terms etc)
        const isInsect = ["ladybug", "honeybee", "monarch-butterfly", "praying-mantis", "luna-moth", "dragonfly", "firefly", "cicada", "leafcutter-ant", "hercules-beetle"].includes(slug);
        if (isInsect && (kw === "garden" || kw === "pet" || kw === "pond" || kw === "pool")) {
          return;
        }

        const cleanFile = fileLower.replace(/_/g, " ");
        const cleanCat = catText.replace(/_/g, " ");
        const cleanAlt = altLower.replace(/_/g, " ");
        const cleanCaption = captionLower.replace(/_/g, " ");

        // For Galápagos Tortoise, allow 'pool' (they wallow in muddy pools in the wild)
        if (slug === "galapagos-tortoise" && kw === "pool") {
          return;
        }

        // Ignore 'museum' for Manta Ray unless the categories or context show it's actually in a museum display.
        // The file title File:Mobula birostris - Australian Museum 2022.jpg is a real photo licensed by the Australian Museum of a wild sighting, not a taxidermy specimen in a museum case.
        // Let's filter out 'museum' keyword from filename checking if it has a license/real photo context.
        if (kw === "museum" && cleanFile.includes("australian museum") && !cleanCat.includes("museum specimen") && !cleanCat.includes("taxidermy")) {
          return;
        }

        // Penguin: "Petermann Island" is a real island in Antarctica - "pet" in "Petermann" is a false positive
        if (slug === "penguin" && kw === "pet") {
          return;
        }

        // Koala: "Petrie Koala Corridor" is a real wildlife corridor - "pet" in "Petrie" is a false positive
        if (slug === "koala" && kw === "pet") {
          return;
        }

        // Ruby-throated hummingbird: Garden feeders and artificial feeders are their normal wild foraging behavior
        if (slug === "ruby-throated-hummingbird" && (kw === "garden" || kw === "artificial")) {
          return;
        }
        
        // Use word-boundary matching to avoid false positives like:
        // "pet" in "competition", "compete", "Petermann", "Petrie", "photographer"
        // "zoo" in "zoological" but not in "plankton zooplankton" etc.
        const kwPattern = new RegExp(`\\b${kw}\\b`, "i");
        if (kwPattern.test(cleanFile) || kwPattern.test(cleanCat) || kwPattern.test(cleanAlt) || kwPattern.test(cleanCaption)) {
          matchedFlags.push(kw);
        }
      });

      if (matchedFlags.length > 0) {
        animalIssues.push(
          `  - Image "${image.slug}" (${image.imageType})\n` +
          `    URL: ${image.src}\n` +
          `    ⚠️ Flagged terms found: [${matchedFlags.join(", ")}]\n` +
          `    Categories: [${categories.slice(0, 5).join(", ")}]`
        );
      }
    }

    if (animalIssues.length > 0) {
      console.log(`🐾 Animal: ${animal.core.name} (${animal.core.slug})`);
      console.log(animalIssues.join("\n"));
      console.log("-----------------------------------------");
    }
    
    // Tiny delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

main().catch(console.error);
