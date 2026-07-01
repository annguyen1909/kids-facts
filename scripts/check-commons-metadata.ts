#!/usr/bin/env tsx
import { validateContent } from "@/lib/content-validation";

// List of target animals to check
const targetSlugs = [
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
    
    // If it's a thumb URL, the filename is the segment before the width
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
      headers: { "User-Agent": "wildlifedb-biometadata-checker/1.0" }
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
  console.log("   Wikimedia API Species & Context Auditor");
  console.log(`   Auditing ${targetSlugs.length} new animals...`);
  console.log("=========================================\n");

  for (const slug of targetSlugs) {
    const animal = animals.find(a => a.core.slug === slug);
    if (!animal) continue;

    console.log(`🐾 Animal: ${animal.core.name} (${animal.core.scientificName})`);
    
    const scientificNameLower = animal.core.scientificName.toLowerCase();
    const nameLower = animal.core.name.toLowerCase();
    
    // Taxonomy keywords
    const taxKeywords = [
      ...scientificNameLower.split(/\s+/),
      ...nameLower.split(/\s+/)
    ].filter(w => w.length > 2);

    for (const image of animal.images) {
      if (!image.src.includes("upload.wikimedia.org")) continue;
      
      const fileName = getFileNameFromUrl(image.src);
      if (!fileName) continue;

      const categories = await fetchCommonsCategories(fileName);
      const catText = categories.join(" | ").toLowerCase();
      
      const issues: string[] = [];

      // 1. Species check: verify if the scientific name or common name keywords exist in the categories
      const hasSpeciesMatch = taxKeywords.some(keyword => catText.includes(keyword));
      
      // If no taxonomy matches, check if it's completely mismatching
      if (!hasSpeciesMatch && categories.length > 0) {
        // Let's print the categories to let user see
        issues.push(`⚠️ Possible Mismatch: File categories [${categories.slice(0, 5).join(", ")}] do not contain keywords: ${taxKeywords.join(", ")}`);
      }

      // 2. Category Context check
      if (image.imageType === "baby") {
        const babyKeywords = ["larva", "caterpillar", "nymph", "egg", "spawn", "pupa", "young", "baby", "juvenile", "nest", "cub", "chick"];
        const hasBabyCat = babyKeywords.some(w => catText.includes(w) || image.alt.toLowerCase().includes(w) || image.caption.toLowerCase().includes(w));
        if (!hasBabyCat) {
          issues.push(`⚠️ Mismatch context 'baby': Image categories/meta do not mention larval, juvenile, or egg terms.`);
        }
      }

      if (image.imageType === "diet") {
        const dietKeywords = ["eating", "feeding", "prey", "predat", "hunt", "flower", "nectar", "leaf", "plant", "food", "herbivor", "carnivor"];
        const hasDietCat = dietKeywords.some(w => catText.includes(w) || image.alt.toLowerCase().includes(w) || image.caption.toLowerCase().includes(w));
        if (!hasDietCat) {
          issues.push(`⚠️ Mismatch context 'diet': Image categories/meta do not mention feeding, food, flowers, or predation.`);
        }
      }

      if (issues.length > 0) {
        console.log(`  - Image: "${image.slug}" (${image.imageType})`);
        console.log(`    URL: ${image.src}`);
        issues.forEach(iss => console.log(`    ${iss}`));
      }
    }
    console.log("-----------------------------------------");
    // Friendly delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

main().catch(console.error);
