import { searchWikimediaImages } from "@/lib/animals/wikimedia-client";
import { scoreImageCandidate } from "@/lib/animals/image-selector";

async function main() {
  const scientificName = "Carassius auratus";
  const commonName = "Goldfish";

  console.log("Fetching candidates...");
  const candidates = await searchWikimediaImages({ scientificName, commonName });
  console.log(`Found ${candidates.length} candidates.`);

  for (const c of candidates) {
    const score = scoreImageCandidate(c, { scientificName, commonName });
    console.log(`- Title: ${c.title}`);
    console.log(`  Score: ${score}`);
    console.log(`  Width: ${c.width}, Height: ${c.height}`);
    console.log(`  Description: ${c.description || ""}`);
  }
}

main().catch(console.error);
