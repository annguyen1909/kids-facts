#!/usr/bin/env node
import { importAnimal } from "@/lib/animals/importer";

function printUsage() {
  console.log("Usage: npm run import-animal -- <scientific-or-common-name> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --slug <slug>     Override generated slug");
  console.log("  --force           Overwrite existing scaffold files");
  console.log("  --skip-images     Import taxonomy only");
  console.log("");
  console.log("Examples:");
  console.log('  npm run import-animal -- "Panthera leo" --slug tiger');
  console.log('  npm run import-animal -- "Tursiops truncatus"');
}

function parseArgs(argv: string[]) {
  const options: {
    query?: string;
    slug?: string;
    force?: boolean;
    skipImages?: boolean;
  } = {};

  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--slug") {
      options.slug = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--skip-images") {
      options.skipImages = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    positional.push(arg);
  }

  options.query = positional.join(" ").trim();
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.query) {
    printUsage();
    process.exit(1);
  }

  try {
    const result = await importAnimal({
      query: options.query,
      slug: options.slug,
      force: options.force,
      skipImages: options.skipImages,
    });

    console.log(`Imported ${result.name} (${result.scientificName})`);
    console.log(`Slug: ${result.slug}`);
    console.log(`GBIF key: ${result.gbifKey}`);
    console.log(`Mode: ${result.created ? "created" : "updated"}`);
    console.log(`Content: ${result.contentDirectory}`);

    if (result.imageSources.length > 0) {
      console.log(`Image sources: ${result.imageSources.join(", ")}`);
    }

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const warning of result.warnings) {
        console.log(`  - ${warning}`);
      }
    }

    console.log("\nNext steps:");
    console.log("  1. Review animal.json taxonomy and reference summary");
    console.log("  2. Replace TBD editorial content in core.mdx and supporting pages");
    console.log("  3. Verify image attribution and replace weak images if needed");
    console.log("  4. Run npm run content:validate");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
