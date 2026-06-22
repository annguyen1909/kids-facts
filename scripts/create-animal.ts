#!/usr/bin/env node
import { importAnimal } from "@/lib/animals/importer";

function printUsage() {
  console.log("Usage: npm run create-animal -- <animal> [--force]");
  console.log("");
  console.log("Examples:");
  console.log("  npm run create-animal -- gazelle");
  console.log("  npm run create-animal -- tiger --force");
  console.log('  npm run create-animal -- "african elephant"');
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const animal = args.find((arg) => !arg.startsWith("--"));

  if (!animal || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(animal ? 0 : 1);
  }

  try {
    const result = await importAnimal({ query: animal, force });

    console.log(`\n✓ Imported ${result.name} (${result.scientificName})`);
    console.log(`  Slug:    ${result.slug}`);
    console.log(`  GBIF:    ${result.gbifKey}`);
    console.log(`  Folder:  ${result.contentDirectory}`);

    if (result.imageSources.length > 0) {
      console.log(`  Images:  ${result.imageSources.join(", ")} (auto-selected — review required)`);
    }

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const warning of result.warnings) {
        console.log(`  - ${warning}`);
      }
    }

    console.log("\nNext — run in Cursor with docs/create-animal-page-prompt.md:");
    console.log(`  Animal: ${animal}`);
    console.log("\nOr continue manually:");
    console.log(`  1. node scripts/update-${result.slug}-images.mjs  (create from update-tiger-images.mjs)`);
    console.log(`  2. Edit content/animals/${result.slug}/animal.json + MDX`);
    console.log("  3. npm run content:validate");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
