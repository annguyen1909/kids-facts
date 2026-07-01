#!/usr/bin/env node
/**
 * Fix core/gallery duplicate image src values across recently added animals.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyWikimediaUpdates } from "./lib/update-wikimedia-animal-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const timestamp = new Date().toISOString();

const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";

async function fetchMetadata(fileTitle, attempt = 1) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
    titles: fileTitle.startsWith("File:") ? fileTitle : `File:${fileTitle}`,
  });

  const res = await fetch(`${WIKIMEDIA_API}?${params}`, {
    headers: { "User-Agent": "KidsFactsBot/1.0 (fix-duplicate-core-images)" },
  });

  if (res.status === 429 && attempt < 5) {
    await new Promise((r) => setTimeout(r, attempt * 2000));
    return fetchMetadata(fileTitle, attempt + 1);
  }

  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`No image info for ${fileTitle}`);

  const metadata = info.extmetadata ?? {};
  const artist = (metadata.Artist?.value ?? metadata.Credit?.value ?? "Unknown")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const licenseName = (metadata.LicenseShortName?.value ?? "See source")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    src: info.url,
    width: info.width,
    height: info.height,
    artist,
    licenseName,
    licenseUrl: metadata.LicenseUrl?.value || info.descriptionurl || "",
    sourceUrl: info.descriptionurl,
  };
}

function applyJsonPatch(animalSlug, slug, patch) {
  const filePath = path.join(root, "content/animals", animalSlug, "images", `${slug}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const next = {
    ...existing,
    ...patch,
    source: patch.source ?? {
      ...existing.source,
      sourceUrl: patch.sourceUrl ?? existing.source?.sourceUrl,
      creatorName: patch.creatorName ?? existing.source?.creatorName,
      licenseName: patch.licenseName ?? existing.source?.licenseName,
      licenseUrl: patch.licenseUrl ?? existing.source?.licenseUrl,
      downloadedAt: timestamp,
      reviewedBy: "editor@wildlifedb.local",
    },
    acquisitionNotes:
      patch.acquisitionNotes ?? "Core article image — unique src, separate from gallery set.",
    updatedAt: timestamp,
  };

  if (patch.src) {
    next.attributionText = `Photo by ${next.source.creatorName} via Wikimedia Commons, ${next.source.licenseName}`;
    next.attributionHtml = `Photo by <a href="${next.source.sourceUrl}">${next.source.creatorName}</a> via <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, <a href="${next.source.licenseUrl}">${next.source.licenseName}</a>`;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Patched ${animalSlug}/${slug}`);
}

async function fixCoreFromConfig(animalSlug) {
  const configPath = path.join(root, "scripts", `${animalSlug}-images.json`);
  if (!fs.existsSync(configPath)) {
    console.warn(`No config for ${animalSlug}, skipping config-based fix`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  for (const [key, entry] of Object.entries(config)) {
    if (!key.startsWith("core-")) continue;

    const slug = `${animalSlug}-${key}`;
    try {
      const meta = await fetchMetadata(entry.fileTitle);
      applyJsonPatch(animalSlug, slug, {
      src: meta.src,
      width: meta.width,
      height: meta.height,
      alt: entry.alt,
      caption: entry.caption,
      imageType: entry.imageType,
      galleryTopics: [entry.imageType],
      featuredOnPages: entry.featuredOnPages,
      location: entry.location ?? "Unknown",
      sourceUrl: meta.sourceUrl,
      creatorName: meta.artist,
      licenseName: meta.licenseName,
      licenseUrl: meta.licenseUrl,
      });
      await new Promise((r) => setTimeout(r, 800));
    } catch (error) {
      console.error(`Failed ${slug}:`, error instanceof Error ? error.message : error);
    }
  }
}

async function main() {
  const configAnimals = [
    "dragonfly",
    "gila-monster",
    "hercules-beetle",
    "iguana",
    "leafcutter-ant",
    "lionfish",
    "manta-ray",
    "peacock",
  ];

  for (const slug of configAnimals) {
    console.log(`\n=== Fixing core images from config: ${slug} ===`);
    await fixCoreFromConfig(slug);
  }

  // Hercules beetle hero must be gallery-only (not core)
  applyJsonPatch("hercules-beetle", "hercules-beetle-hero", {
    featuredOnPages: ["gallery"],
    acquisitionNotes: "Hero image for gallery only; core article uses dedicated section images.",
  });

  // Tokay gecko: restore unique gallery/core split
  console.log("\n=== Fixing tokay-gecko ===");
  await applyWikimediaUpdates({
    animalSlug: "tokay-gecko",
    updates: [
      {
        slug: "tokay-gecko-diet",
        title: "Tokay gecko baby.jpg",
        alt: "Tokay gecko eating insects inside its enclosure",
        caption: "Geckos are carnivores that hunt insects, spiders, and even small rodents.",
        imageType: "diet",
        galleryTopics: ["diet"],
        featuredOnPages: ["gallery"],
        location: "United States",
        acquisitionNotes: "Gallery diet image — unique from core diet image.",
      },
      {
        slug: "tokay-gecko-core-baby",
        title: "Baby Tokay gecko.jpg",
        alt: "A tiny baby Tokay gecko resting on a person's hand",
        caption: "Young Tokay geckos hatch from hard-shelled eggs and are independent from birth.",
        imageType: "baby",
        galleryTopics: ["baby"],
        featuredOnPages: ["core"],
        location: "United States",
        acquisitionNotes: "Core article baby image — unique from gallery baby image.",
      },
      {
        slug: "tokay-gecko-core-diet",
        title: "Gekko gecko 192129898.jpg",
        alt: "Tokay gecko hunting at night on a building wall",
        caption: "As nocturnal hunters, Tokay geckos use the cover of darkness to ambush their prey.",
        imageType: "diet",
        galleryTopics: ["diet"],
        featuredOnPages: ["core"],
        location: "Taiwan",
        acquisitionNotes: "Core article diet image — unique from gallery diet image.",
      },
    ],
  });

  // Lion: unique eating and mane images (not in main gallery set)
  console.log("\n=== Fixing lion ===");
  await applyWikimediaUpdates({
    animalSlug: "lion",
    updates: [
      {
        slug: "lion-eating",
        title: "Lion (Panthera leo) feeding on hippo carcass.jpg",
        alt: "African lions feeding together on a large prey carcass",
        caption: "After a hunt, pride members gather to feed on the kill.",
        imageType: "diet",
        galleryTopics: ["diet"],
        featuredOnPages: ["gallery"],
        location: "African savanna",
        acquisitionNotes: "Gallery diet image — unique from core diet image.",
      },
      {
        slug: "lion-mane",
        title: "Adult Asiatic Lion.jpg",
        alt: "Adult male Asiatic lion showing a full dark mane",
        caption: "A male lion's mane grows darker and fuller with age and good health.",
        imageType: "closeup",
        galleryTopics: ["closeup"],
        featuredOnPages: ["gallery"],
        location: "Gir Forest, India",
        acquisitionNotes: "Dedicated mane close-up — unique from hero image.",
      },
    ],
  });

  // Parrot core habitat
  console.log("\n=== Fixing parrot ===");
  await applyWikimediaUpdates({
    animalSlug: "parrot",
    updates: [
      {
        slug: "parrot-core-habitat",
        title: "Ara macao at Barro Colorados.jpg",
        alt: "Scarlet macaw perched in tropical rainforest canopy",
        caption: "Old trees with hollow trunks are essential for macaw nesting.",
        imageType: "habitat",
        galleryTopics: ["habitat"],
        featuredOnPages: ["core"],
        location: "Panama",
        acquisitionNotes: "Core article habitat image — unique from gallery habitat image.",
      },
    ],
  });

  // Gallery duplicate fixes
  console.log("\n=== Fixing gallery duplicates ===");
  await applyWikimediaUpdates({
    animalSlug: "great-white-shark",
    updates: [
      {
        slug: "great-white-shark-range",
        title: "Carcharodon carcharias distribution map.png",
        alt: "Great white shark geographic range map",
        caption: "Great white sharks roam temperate and subtropical oceans worldwide.",
        imageType: "range",
        galleryTopics: ["range"],
        featuredOnPages: ["gallery"],
        location: "Global oceans",
        acquisitionNotes: "Gallery range image — unique from baby image.",
      },
    ],
  });

  await applyWikimediaUpdates({
    animalSlug: "orangutan",
    updates: [
      {
        slug: "orangutan-range",
        title: "Bornean Orangutan in nest.jpg",
        alt: "Bornean orangutan resting in a tree nest in rainforest habitat",
        caption: "Orangutans live only on the islands of Borneo and Sumatra in Southeast Asia.",
        imageType: "range",
        galleryTopics: ["range"],
        featuredOnPages: ["gallery"],
        location: "Borneo",
        acquisitionNotes: "Gallery range image — unique from hero image.",
      },
    ],
  });

  await applyWikimediaUpdates({
    animalSlug: "rhinoceros",
    updates: [
      {
        slug: "rhinoceros-habitat",
        title: "Ceratotherium simum simum (Rhinocéros blanc du Sud) - 385.jpg",
        alt: "White rhinoceros standing in open savanna grassland habitat",
        caption: "White rhinos graze on open grasslands and savannas in southern Africa.",
        imageType: "habitat",
        galleryTopics: ["habitat"],
        featuredOnPages: ["gallery"],
        location: "Southern Africa",
        acquisitionNotes: "Gallery habitat image — unique from hero image.",
      },
    ],
  });

  console.log("\nDone fixing duplicate images.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
