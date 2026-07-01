import fs from "node:fs";
import path from "node:path";
import { searchWikimediaRaw } from "../lib/animals/wikimedia-client";

type Suspect = {
  animal: string;
  file: string;
  imageType: string;
  originalTitle: string;
  sourceUrl: string;
};

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function searchWithRetry(query: string, attempt = 1): Promise<any[]> {
  try {
    const results = await searchWikimediaRaw(query, 10);
    return results;
  } catch (err: any) {
    if (err.message?.includes("429") && attempt <= 5) {
      const wait = attempt * 5000;
      console.warn(`Wikimedia search rate limited for query "${query}". Waiting ${wait/1000}s...`);
      await sleep(wait);
      return searchWithRetry(query, attempt + 1);
    }
    console.error(`Error searching for query "${query}":`, err.message);
    return [];
  }
}

async function main() {
  const scratchDir = "/Users/annguyen19/.gemini/antigravity/brain/b74091bc-ff32-4525-86f6-d5a992b3a077/scratch";
  const suspectsPath = path.join(scratchDir, "suspects.json");
  const outputPath = path.join(scratchDir, "candidate_baby_images.json");

  if (!fs.existsSync(suspectsPath)) {
    console.error("❌ suspects.json not found");
    process.exit(1);
  }

  const suspects: Suspect[] = JSON.parse(fs.readFileSync(suspectsPath, "utf8"));
  // Unique animals
  const uniqueAnimals = [...new Set(suspects.map(s => s.animal))];
  console.log(`Searching baby candidates for ${uniqueAnimals.length} unique animals...`);

  const results: Record<string, any> = {};

  for (let i = 0; i < uniqueAnimals.length; i++) {
    const animal = uniqueAnimals[i];
    console.log(`[${i + 1}/${uniqueAnimals.length}] Searching for ${animal}...`);

    const animalJsonPath = path.join(process.cwd(), "content", "animals", animal, "animal.json");
    if (!fs.existsSync(animalJsonPath)) {
      console.warn(`  ⚠️ animal.json not found for ${animal}`);
      continue;
    }

    const animalData = JSON.parse(fs.readFileSync(animalJsonPath, "utf-8"));
    const commonName = animalData.name;
    const scientificName = animalData.scientificName;
    const offspringName = animalData.reproduction?.offspringName || "baby";

    // Formulate queries
    const queries = [
      `${scientificName} ${offspringName}`,
      `${commonName} ${offspringName}`,
      `${scientificName} baby`,
      `${commonName} baby`,
      `${scientificName} young`,
      `${commonName} young`
    ];

    const candidates: any[] = [];
    const seenUrls = new Set<string>();

    for (const query of queries) {
      // Small sleep to be polite to Wikimedia
      await sleep(300);
      const searchRes = await searchWithRetry(query);
      
      for (const candidate of searchRes) {
        if (!seenUrls.has(candidate.imageUrl)) {
          seenUrls.add(candidate.imageUrl);
          candidates.push({
            queryUsed: query,
            title: candidate.title,
            imageUrl: candidate.imageUrl,
            pageUrl: candidate.pageUrl,
            width: candidate.width,
            height: candidate.height,
            description: candidate.description,
            artist: candidate.artist,
            licenseName: candidate.licenseName,
            licenseUrl: candidate.licenseUrl
          });
        }
      }
    }

    results[animal] = {
      commonName,
      scientificName,
      offspringName,
      candidates: candidates.slice(0, 15) // Keep top 15 unique candidates
    };

    console.log(`  Found ${candidates.length} candidate images.`);
    
    // Write progress periodically
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
    await sleep(500);
  }

  console.log(`\nFinished! Baby candidates written to ${outputPath}`);
}

main().catch(console.error);
