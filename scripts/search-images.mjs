import { searchWikimediaRaw } from "../lib/animals/wikimedia-client";

async function main() {
  const query = process.argv[2];
  if (!query) {
    console.log("Usage: node scripts/search-images.mjs <query>");
    process.exit(1);
  }

  console.log(`Searching for "${query}"...`);
  try {
    const results = await searchWikimediaRaw(query, 25);
    console.log(`Found ${results.length} results:`);
    for (const r of results) {
      console.log(`----------------------------------------`);
      console.log(`Title:       ${r.title}`);
      console.log(`Artist:      ${r.artist}`);
      console.log(`License:     ${r.licenseName}`);
      console.log(`Dimensions:  ${r.width} x ${r.height}`);
      console.log(`Image URL:   ${r.imageUrl}`);
      console.log(`Page URL:    ${r.pageUrl}`);
    }
  } catch (e) {
    console.error("Search failed:", e);
  }
}

main();
