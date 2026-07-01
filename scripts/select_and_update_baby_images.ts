import fs from "node:fs";
import path from "node:path";

type Candidate = {
  queryUsed: string;
  title: string;
  imageUrl: string;
  pageUrl: string;
  width: number;
  height: number;
  description: string;
  artist: string;
  licenseName: string;
  licenseUrl: string;
};

type Suspect = {
  animal: string;
  file: string;
  imageType: string;
  originalTitle: string;
  sourceUrl: string;
};

const blockedTerms = [
  "map", "range", "skull", "skeleton", "diagram", "icon", "logo", "stamp", "chart",
  "illustration", "drawing", "clipart", "dead", "mount", "stuffed", "museum", "taxidermy"
];

const generalBabyKeywords = [
  "baby", "cub", "pup", "kitten", "hatchling", "chick", "calf", "foal", "juvenile", "young",
  "larva", "caterpillar", "tadpole", "lamb", "kid", "infant", "nymph", "exuvia", "instar",
  "spawn", "nestling", "fledgling", "joey", "suckling", "newborn", "fry", "fingerling", "smolt",
  "cubs", "pups", "chicks", "calves", "hatchlings", "tadpoles", "larvae", "nymphs"
];

function rankAndFilterCandidates(animal: string, scientificName: string, offspringName: string, candidates: Candidate[]): Candidate[] {
  // Filter out invalid/blocked candidates
  const filtered = candidates.filter(c => {
    const titleLower = c.title.toLowerCase();
    const descLower = (c.description || "").toLowerCase();

    // Must be image format
    if (titleLower.endsWith(".pdf")) return false;
    if (!/\.(jpe?g|png|webp)$/i.test(titleLower)) return false;

    // Must not contain blocked terms
    if (blockedTerms.some(term => titleLower.includes(term) || descLower.includes(term))) {
      return false;
    }

    return true;
  });

  // Rank candidates
  const ranked = filtered.map(c => {
    const titleLower = c.title.toLowerCase();
    const descLower = (c.description || "").toLowerCase();
    
    let score = 0;
    
    // Priority 1: Match specific offspring name
    if (offspringName && offspringName !== "baby" && offspringName !== "young") {
      const regex = new RegExp(`\\b${offspringName}\\w*\\b`, "i");
      if (regex.test(titleLower) || regex.test(descLower)) {
        score += 100;
      }
    }

    // Priority 2: Match general baby keywords
    const hasGeneralKeyword = generalBabyKeywords.some(kw => {
      const regex = new RegExp(`\\b${kw}\\w*\\b`, "i");
      return regex.test(titleLower) || regex.test(descLower);
    });
    if (hasGeneralKeyword) {
      score += 10;
    }

    // Genus match boost (+50)
    const genus = scientificName.split(" ")[0];
    if (genus) {
      const genusRegex = new RegExp(`\\b${genus}\\w*\\b`, "i");
      if (genusRegex.test(titleLower) || genusRegex.test(descLower)) {
        score += 50;
      }
    }
    
    return { candidate: c, score };
  });

  // Sort by score desc, preserving original order as tie-breaker
  ranked.sort((a, b) => b.score - a.score);

  return ranked.map(r => r.candidate);
}

function createUpdateConfig(commonName: string, offspringName: string, key: string, candidate: Candidate) {
  return {
    fileTitle: candidate.title,
    imageType: "baby",
    featuredOnPages: key === "core-baby" ? ["core"] : ["gallery"],
    alt: `A young or baby ${commonName} (${offspringName}) showing early development`,
    caption: `Baby ${commonName}s must learn to survive and adapt from a young age.`,
    location: "Unknown",
    licensing: {
      licenseName: candidate.licenseName,
      licenseUrl: candidate.licenseUrl,
      artist: candidate.artist,
      pageUrl: candidate.pageUrl,
      imageUrl: candidate.imageUrl,
      width: candidate.width,
      height: candidate.height
    }
  };
}

async function main() {
  const scratchDir = "/Users/annguyen19/.gemini/antigravity/brain/b74091bc-ff32-4525-86f6-d5a992b3a077/scratch";
  const suspectsPath = path.join(scratchDir, "suspects.json");
  const candidatesPath = path.join(scratchDir, "candidate_baby_images.json");
  const outputPath = path.join(scratchDir, "proposed_baby_replacements.json");

  if (!fs.existsSync(suspectsPath) || !fs.existsSync(candidatesPath)) {
    console.error("❌ suspects.json or candidate_baby_images.json not found");
    process.exit(1);
  }

  const suspects: Suspect[] = JSON.parse(fs.readFileSync(suspectsPath, "utf8"));
  const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));

  const proposedUpdates: Record<string, any> = {};

  const uniqueSuspectAnimals = [...new Set(suspects.map(s => s.animal))];

  for (const animal of uniqueSuspectAnimals) {
    if (!candidatesData[animal]) {
      continue;
    }

    const { offspringName, commonName, scientificName, candidates } = candidatesData[animal];
    const ranked = rankAndFilterCandidates(animal, scientificName, offspringName, candidates);

    if (ranked.length > 0) {
      if (!proposedUpdates[animal]) {
        proposedUpdates[animal] = {
          commonName,
          scientificName,
          offspringName,
          updates: {}
        };
      }

      const best = ranked[0];
      const secondBest = ranked.length > 1 ? ranked[1] : best;

      const hasBabySuspect = suspects.some(s => s.animal === animal && s.file === `${animal}-baby.json`);
      const hasCoreBabySuspect = suspects.some(s => s.animal === animal && s.file === `${animal}-core-baby.json`);

      if (hasBabySuspect) {
        proposedUpdates[animal].updates["baby"] = createUpdateConfig(commonName, offspringName, "baby", best);
      }
      if (hasCoreBabySuspect) {
        proposedUpdates[animal].updates["core-baby"] = createUpdateConfig(commonName, offspringName, "core-baby", secondBest);
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(proposedUpdates, null, 2), "utf8");
  console.log(`Successfully wrote proposed replacements to ${outputPath}`);
}

main().catch(console.error);
