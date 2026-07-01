#!/usr/bin/env node
/**
 * Re-sync every Wikimedia image manifest from its Commons sourceUrl (or src title).
 * Fixes stale upload URLs that no longer match the referenced Commons file.
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildSyncedImageRecord,
  fetchCommonsFiles,
  normalizeLicenseUrl,
  resolveCommonsFileTitle,
} from "./lib/wikimedia-image.mjs";

const timestamp = new Date().toISOString();
const animalsDir = path.join(process.cwd(), "content", "animals");

function listImageManifests() {
  const manifests = [];

  for (const animalSlug of fs.readdirSync(animalsDir)) {
    const imagesDir = path.join(animalsDir, animalSlug, "images");
    if (!fs.statSync(path.join(animalsDir, animalSlug)).isDirectory()) continue;
    if (!fs.existsSync(imagesDir)) continue;

    for (const fileName of fs.readdirSync(imagesDir)) {
      if (!fileName.endsWith(".json")) continue;
      manifests.push({
        animalSlug,
        filePath: path.join(imagesDir, fileName),
        slug: fileName.replace(/\.json$/, ""),
      });
    }
  }

  return manifests;
}

async function main() {
  const manifests = listImageManifests();
  const entries = manifests.map((manifest) => {
    const data = JSON.parse(fs.readFileSync(manifest.filePath, "utf8"));
    const title = resolveCommonsFileTitle({
      sourceUrl: data.source?.sourceUrl,
      src: data.src,
    });
    return { ...manifest, data, title };
  });

  const titles = [...new Set(entries.map((entry) => entry.title).filter(Boolean))];
  console.log(`Repairing ${entries.length} manifests across ${titles.length} Commons files...`);

  const commonsFiles = await fetchCommonsFiles(titles);

  let repaired = 0;
  let skipped = 0;
  const unresolved = [];

  for (const entry of entries) {
    if (!entry.title) {
      skipped += 1;
      continue;
    }

    const commons = commonsFiles.get(entry.title);
    if (!commons) {
      unresolved.push(`${entry.animalSlug}/${entry.slug} (File:${entry.title})`);
      continue;
    }

    const canonicalLicenseUrl = normalizeLicenseUrl(commons.licenseUrl, commons.licenseName);
    const needsRepair =
      entry.data.src !== commons.src ||
      entry.data.source?.sourceUrl !== commons.sourceUrl ||
      entry.data.source?.licenseUrl !== canonicalLicenseUrl ||
      entry.data.width !== commons.width ||
      entry.data.height !== commons.height;

    if (!needsRepair) {
      skipped += 1;
      continue;
    }

    const next = buildSyncedImageRecord(
      entry.data,
      commons,
      timestamp,
      entry.data.acquisitionNotes?.includes("synced from Commons")
        ? entry.data.acquisitionNotes
        : `${entry.data.acquisitionNotes ?? ""} Re-synced canonical Commons URL.`.trim(),
    );

    fs.writeFileSync(entry.filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    console.log(`Repaired ${entry.animalSlug}/${entry.slug}`);
    repaired += 1;
  }

  console.log(`\nRepaired: ${repaired}`);
  console.log(`Skipped (already canonical): ${skipped}`);

  if (unresolved.length > 0) {
    console.log(`\nUnresolved (${unresolved.length}):`);
    for (const item of unresolved) console.log(`  - ${item}`);
    process.exit(1);
  }

  console.log("\nAll Wikimedia manifests are synced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
