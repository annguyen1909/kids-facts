#!/usr/bin/env node
import { scaffoldAnimal } from "@/lib/scaffold-animal";

function printUsage() {
  console.log("Usage: npm run new-animal -- <animal-slug>");
  console.log("");
  console.log("Example:");
  console.log("  npm run new-animal -- tiger");
  console.log("  npm run new-animal -- african-elephant");
}

function main() {
  const slug = process.argv[2];

  if (!slug || slug === "--help" || slug === "-h") {
    printUsage();
    process.exit(slug ? 0 : 1);
  }

  try {
    const result = scaffoldAnimal(slug);

    console.log(`Created animal scaffold for "${result.name}" (${result.slug})`);
    console.log("");
    console.log(`Content: ${result.contentDirectory}`);
    console.log(`Assets:  ${result.assetsDirectory}`);
    console.log("");
    console.log("Files created:");
    for (const file of result.createdFiles) {
      console.log(`  - ${file}`);
    }
    console.log("");
    console.log("Next steps:");
    console.log("  1. Replace TBD fields in animal.json");
    console.log("  2. Write core.mdx with 6–8 sections");
    console.log("  3. Add real images under assets/images/animals/" + result.slug);
    console.log("  4. Update image JSON files and remove placeholder URLs");
    console.log("  5. Run npm run content:validate");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
