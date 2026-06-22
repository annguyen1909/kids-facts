#!/usr/bin/env node
import { updateAnimal } from "@/lib/animals/importer";

function printUsage() {
  console.log("Usage: npm run refresh-animal -- <slug> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --skip-images       Refresh taxonomy only");
  console.log("  --skip-taxonomy     Refresh images only");
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((arg) => !arg.startsWith("--"));

  if (!slug || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(slug ? 0 : 1);
  }

  try {
    const result = await updateAnimal({
      slug,
      refreshImages: !args.includes("--skip-images"),
      refreshTaxonomy: !args.includes("--skip-taxonomy"),
    });

    console.log(`Refreshed ${result.name} (${result.scientificName})`);
    console.log(`Updated files:`);
    for (const file of result.createdFiles) {
      console.log(`  - ${file}`);
    }

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const warning of result.warnings) {
        console.log(`  - ${warning}`);
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
