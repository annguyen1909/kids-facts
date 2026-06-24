#!/usr/bin/env node
import {
  isValidationPassing,
  validateContent,
  type ValidationIssue,
} from "@/lib/content-validation";
import { validateAnimalImageUrls } from "@/lib/validate-image-urls";

function printIssues(label: string, issues: ValidationIssue[]) {
  if (issues.length === 0) return;

  console.log(`\n${label}`);
  for (const issue of issues) {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
    console.log(`  [${prefix}] ${issue.scope}: ${issue.message}`);
  }
}

async function main() {
  const result = validateContent();
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  console.log("Content validation report");
  console.log(`Animals: ${result.animals.length}`);
  console.log(`Comparisons: ${result.comparisons.length}`);
  console.log(`Hubs: ${result.hubs.length}`);

  printIssues("Schema and reference errors:", errors);
  printIssues("Warnings:", warnings);

  console.log("\nCompleteness");
  for (const entry of result.completeness) {
    const imageStatus = `${entry.images.present}/${entry.images.required} required images`;
    const sectionStatus = `${entry.coreSections} core sections`;
    const flags = [
      entry.hasCoreBody ? "core body" : "missing core body",
      entry.hasHeroImage ? "hero image" : "missing hero image",
    ].join(", ");

    console.log(`  ${entry.slug.padEnd(22)} ${imageStatus}, ${sectionStatus}, ${flags}`);

    if (entry.images.missing.length > 0) {
      console.log(`    missing images: ${entry.images.missing.join(", ")}`);
    }
  }

  if (result.animals.length > 0) {
    console.log("\nChecking remote image URLs (this may take a minute)...");
    const urlIssues = await validateAnimalImageUrls(result.animals);
    printIssues("Broken image URLs:", urlIssues);
    result.issues.push(...urlIssues);
  }

  const allErrors = result.issues.filter((issue) => issue.severity === "error");
  const allWarnings = result.issues.filter((issue) => issue.severity === "warning");

  if (isValidationPassing(result)) {
    if (allWarnings.length > 0) {
      console.log(`\nValidation passed with ${allWarnings.length} warning(s).`);
      process.exit(0);
    }

    console.log("\nValidation passed.");
    process.exit(0);
  }

  console.log(`\nValidation failed with ${allErrors.length} error(s).`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
