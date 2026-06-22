#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { importAnimal } from "@/lib/animals/importer";

function printUsage() {
  console.log("Usage: npm run import-bulk -- <species-list.txt> [options]");
  console.log("");
  console.log("File format: one species per line. Lines starting with # are ignored.");
  console.log("Optional slug override: Panthera leo | lion");
  console.log("");
  console.log("Options:");
  console.log("  --force           Overwrite existing scaffold files");
  console.log("  --skip-images     Import taxonomy only");
}

function parseLine(line: string): { query: string; slug?: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  if (trimmed.includes("|")) {
    const [query, slug] = trimmed.split("|").map((part) => part.trim());
    return { query, slug: slug || undefined };
  }

  return { query: trimmed };
}

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find((arg) => !arg.startsWith("--"));
  const force = args.includes("--force");
  const skipImages = args.includes("--skip-images");

  if (!fileArg || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(fileArg ? 0 : 1);
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const entries = lines.map(parseLine).filter((entry): entry is { query: string; slug?: string } =>
    Boolean(entry),
  );

  if (entries.length === 0) {
    console.error("No species found in input file");
    process.exit(1);
  }

  let successCount = 0;
  const failures: Array<{ query: string; error: string }> = [];

  for (const entry of entries) {
    try {
      const result = await importAnimal({
        query: entry.query,
        slug: entry.slug,
        force,
        skipImages,
      });
      successCount += 1;
      console.log(`✓ ${entry.query} → ${result.slug}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ query: entry.query, error: message });
      console.error(`✗ ${entry.query}: ${message}`);
    }
  }

  console.log("");
  console.log(`Bulk import finished: ${successCount}/${entries.length} succeeded`);

  if (failures.length > 0) {
    process.exit(1);
  }
}

main();
