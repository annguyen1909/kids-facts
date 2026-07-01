#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  buildSyncedImageRecord,
  fetchCommonsFiles,
} from "./wikimedia-image.mjs";

const timestamp = new Date().toISOString();

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCommonsFileUrl(title) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

export async function applyWikimediaUpdates({ animalSlug, updates }) {
  const dir = path.join(process.cwd(), "content", "animals", animalSlug, "images");
  const commonsFiles = await fetchCommonsFiles(updates.map((update) => update.title));

  for (const update of updates) {
    const filePath = path.join(dir, `${update.slug}.json`);
    let existing = { id: update.slug, animalSlug, slug: update.slug };
    try {
      if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
    } catch (err) {
      console.warn(`Could not parse existing file ${filePath}, creating new record.`);
    }
    const commons = commonsFiles.get(update.title);

    if (!commons) {
      throw new Error(`Could not resolve Wikimedia file: ${update.title}`);
    }

    const next = buildSyncedImageRecord(
      {
        ...existing,
        alt: update.alt,
        caption: update.caption,
        imageType: update.imageType,
        galleryTopics: update.galleryTopics,
        featuredOnPages: update.featuredOnPages,
        location: update.location,
      },
      commons,
      timestamp,
      update.acquisitionNotes,
    );

    fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    console.log(`Updated ${animalSlug}/${update.slug}`);
  }
}

// Keep stripHtml/buildCommonsFileUrl exported for any legacy imports.
export { stripHtml, buildCommonsFileUrl };
