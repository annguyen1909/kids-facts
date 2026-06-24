#!/usr/bin/env node
import { validateContent } from "@/lib/content-validation";
import {
  collectAnimalImageRefs,
  validateImageSrcUrls,
} from "@/lib/validate-image-urls";

function printIssues(
  label: string,
  issues: Array<{ severity: string; scope: string; message: string }>,
) {
  if (issues.length === 0) return;

  console.log(`\n${label}`);
  for (const issue of issues) {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
    console.log(`  [${prefix}] ${issue.scope}: ${issue.message}`);
  }
}

async function main() {
  const { animals } = validateContent();
  const refs = collectAnimalImageRefs(animals);
  const uniqueSrcs = new Set(refs.map((ref) => ref.src)).size;

  console.log("Image URL validation");
  console.log(`Animals: ${animals.length}`);
  console.log(`Image manifests: ${refs.length}`);
  console.log(`Unique src values: ${uniqueSrcs}`);
  console.log("Checking remote URLs (this may take a minute)...");

  const issues = await validateImageSrcUrls(refs);
  printIssues("Broken image URLs:", issues);

  if (issues.length === 0) {
    console.log("\nAll image URLs responded successfully.");
    process.exit(0);
  }

  console.log(`\nImage URL validation failed with ${issues.length} error(s).`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
