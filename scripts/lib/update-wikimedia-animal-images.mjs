#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const timestamp = new Date().toISOString();

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCommonsFileUrl(title) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

async function fetchCommonsFiles(titles) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  url.searchParams.set("origin", "*");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|extmetadata");
  url.searchParams.set(
    "titles",
    titles.map((title) => `File:${title}`).join("|"),
  );

  let payload;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "user-agent": "kids-facts-image-updater/1.0",
      },
    });

    if (response.ok) {
      payload = await response.json();
      break;
    }

    if (response.status !== 429 || attempt === 4) {
      throw new Error(`Wikimedia request failed: ${response.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }

  const files = new Map();

  for (const page of payload.query?.pages ?? []) {
    const image = page?.imageinfo?.[0];
    if (!page?.title || page.missing || !image?.url) continue;

    const normalizedTitle = page.title.replace(/^File:/, "");
    const meta = image.extmetadata ?? {};
    const creatorName = stripHtml(meta.Artist?.value || "Unknown creator");
    const licenseName = stripHtml(meta.LicenseShortName?.value || "License not listed");
    const sourceUrl = buildCommonsFileUrl(normalizedTitle);
    const licenseUrl = meta.LicenseUrl?.value || sourceUrl;

    files.set(normalizedTitle, {
      fileName: normalizedTitle,
      src: image.url,
      width: image.width,
      height: image.height,
      creatorName,
      licenseName,
      licenseUrl,
      sourceUrl,
    });
  }

  return files;
}

export async function applyWikimediaUpdates({ animalSlug, updates }) {
  const dir = path.join(process.cwd(), "content", "animals", animalSlug, "images");
  const commonsFiles = await fetchCommonsFiles(updates.map((update) => update.title));

  for (const update of updates) {
    const filePath = path.join(dir, `${update.slug}.json`);
    const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const commons = commonsFiles.get(update.title);

    if (!commons) {
      throw new Error(`Could not resolve Wikimedia file: ${update.title}`);
    }

    const requiresAttribution = !["CC0", "Public domain"].includes(commons.licenseName);

    const next = {
      ...existing,
      fileName: commons.fileName,
      src: commons.src,
      width: commons.width,
      height: commons.height,
      alt: update.alt,
      caption: update.caption,
      imageType: update.imageType,
      galleryTopics: update.galleryTopics,
      featuredOnPages: update.featuredOnPages,
      location: update.location,
      attributionText: `Photo by ${commons.creatorName} via Wikimedia Commons, ${commons.licenseName}`,
      attributionHtml: `Photo by <a href="${commons.sourceUrl}">${commons.creatorName}</a> via <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, <a href="${commons.licenseUrl}">${commons.licenseName}</a>`,
      source: {
        sourceName: "Wikimedia Commons",
        sourceUrl: commons.sourceUrl,
        creatorName: commons.creatorName,
        licenseName: commons.licenseName,
        licenseUrl: commons.licenseUrl,
        requiresAttribution,
        downloadedAt: timestamp,
        reviewedBy: "editor@kidsfacts.local",
      },
      acquisitionNotes: update.acquisitionNotes,
      updatedAt: timestamp,
    };

    fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    console.log(`Updated ${animalSlug}/${update.slug}`);
  }
}
