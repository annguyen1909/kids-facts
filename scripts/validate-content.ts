#!/usr/bin/env node
import {
  isValidationPassing,
  validateContent,
  type ValidationIssue,
} from "@/lib/content-validation";

function printIssues(label: string, issues: ValidationIssue[]) {
  if (issues.length === 0) return;

  console.log(`\n${label}`);
  for (const issue of issues) {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
    console.log(`  [${prefix}] ${issue.scope}: ${issue.message}`);
  }
}

function main() {
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
    const pageStatus = `${entry.supportingPages.present}/${entry.supportingPages.expected} default pages`;
    const flags = [
      entry.hasCoreBody ? "core body" : "missing core body",
      entry.hasHeroImage ? "hero image" : "missing hero image",
    ].join(", ");

    console.log(`  ${entry.slug.padEnd(22)} ${imageStatus}, ${pageStatus}, ${flags}`);

    if (entry.images.missing.length > 0) {
      console.log(`    missing images: ${entry.images.missing.join(", ")}`);
    }

    if (entry.supportingPages.missing.length > 0) {
      console.log(`    missing pages: ${entry.supportingPages.missing.join(", ")}`);
    }
  }

  if (isValidationPassing(result)) {
    if (warnings.length > 0) {
      console.log(`\nValidation passed with ${warnings.length} warning(s).`);
      process.exit(0);
    }

    console.log("\nValidation passed.");
    process.exit(0);
  }

  console.log(`\nValidation failed with ${errors.length} error(s).`);
  process.exit(1);
}

main();
