#!/usr/bin/env node
/**
 * Fix inaccurate core article images — verified species, unique src vs main gallery.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const timestamp = new Date().toISOString();

/** @type {Record<string, Record<string, object>>} */
const patches = {
  lion: {
    "lion-core-diet": {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Lioness_at_kill.jpg",
      width: 1920,
      height: 1280,
      alt: "African lioness feeding at a prey carcass on the savanna",
      caption: "Lions are carnivores and often feed together after a cooperative hunt.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lioness_at_kill.jpg",
      creatorName: "Clément Bardot",
      licenseName: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      location: "African savanna",
    },
  },
  "bottlenose-dolphin": {
    "dolphin-core-range": {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Bottlenose_Dolphin.JPG",
      width: 2048,
      height: 1536,
      alt: "Bottlenose dolphin swimming in open coastal waters",
      caption: "Bottlenose dolphins live in warm coastal waters and open oceans worldwide.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bottlenose_Dolphin.JPG",
      creatorName: "NASA",
      licenseName: "Public domain",
      licenseUrl: "https://commons.wikimedia.org/wiki/File:Bottlenose_Dolphin.JPG",
      location: "Open ocean",
    },
  },
  "red-panda": {
    "red-panda-core-diet": {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Ailurus_fulgens_fulgens_feeding_on_bamboo_leaves.jpg",
      width: 3456,
      height: 2304,
      alt: "Red panda feeding on bamboo leaves in mountain forest habitat",
      caption: "Red pandas eat mostly bamboo leaves and shoots, plus fruit and eggs.",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_fulgens_feeding_on_bamboo_leaves.jpg",
      creatorName: "Mathias Appel",
      licenseName: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      location: "Mountain forest, Asia",
    },
    "red-panda-core-baby": {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Red_panda_cub_%288938075606%29.jpg",
      width: 2048,
      height: 1365,
      alt: "Young red panda cub resting on a mossy branch in the wild",
      caption: "Red panda cubs stay with their mother for months after birth.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_panda_cub_(8938075606).jpg",
      creatorName: "Mathias Appel",
      licenseName: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      location: "Mountain forest, Asia",
    },
  },
  "giant-panda": {
    "giant-panda-core-habitat": {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Giant_Panda_2004-03-27.jpg",
      width: 1600,
      height: 1200,
      alt: "Giant panda in cool mountain bamboo forest habitat",
      caption: "Wild giant pandas live in cool, misty bamboo forests on mountain slopes.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Giant_Panda_2004-03-27.jpg",
      creatorName: "Sheba_Also",
      licenseName: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      location: "Sichuan, China",
    },
    "giant-panda-core-family": {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/67/Juvenile_Giant_Panda.jpg",
      width: 1024,
      height: 768,
      alt: "Juvenile giant panda resting beside an adult in bamboo forest",
      caption: "A mother panda cares for her cub alone, teaching it to climb and eat bamboo.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Juvenile_Giant_Panda.jpg",
      creatorName: "Sheba_Also",
      licenseName: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      location: "Sichuan, China",
    },
    "giant-panda-core-baby": {
      src: "https://upload.wikimedia.org/wikipedia/commons/1/11/Giant_panda_%28Ailuropoda_melanoleuca%29_1.jpg",
      width: 2048,
      height: 1536,
      alt: "Giant panda cub exploring bamboo forest under its mother's care",
      caption: "Panda cubs are born tiny and depend on their mother for months.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Giant_panda_(Ailuropoda_melanoleuca)_1.jpg",
      creatorName: "Sheba_Also",
      licenseName: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      location: "Sichuan, China",
    },
    "giant-panda-core-range": {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Panda_g%C3%A9ant_%28Ailuropoda_melanoleuca%29.JPG",
      width: 2816,
      height: 2112,
      alt: "Giant panda in bamboo-rich mountain forest in central China",
      caption: "Today wild giant pandas survive only in scattered mountain forests in central China.",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Panda_g%C3%A9ant_(Ailuropoda_melanoleuca).JPG",
      creatorName: "Sheba_Also",
      licenseName: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      location: "Sichuan, China",
    },
  },
};

function applyPatch(animalSlug, slug, patch) {
  const filePath = path.join(__dirname, `../content/animals/${animalSlug}/images/${slug}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const next = {
    ...existing,
    src: patch.src,
    width: patch.width,
    height: patch.height,
    alt: patch.alt,
    caption: patch.caption,
    location: patch.location,
    attributionText: `Photo by ${patch.creatorName} via Wikimedia Commons, ${patch.licenseName}`,
    attributionHtml: `Photo by <a href="${patch.sourceUrl}">${patch.creatorName}</a> via <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, <a href="${patch.licenseUrl}">${patch.licenseName}</a>`,
    source: {
      sourceName: "Wikimedia Commons",
      sourceUrl: patch.sourceUrl,
      creatorName: patch.creatorName,
      licenseName: patch.licenseName,
      licenseUrl: patch.licenseUrl,
      requiresAttribution: !["CC0", "Public domain"].includes(patch.licenseName),
      downloadedAt: timestamp,
      reviewedBy: "editor@kidsfacts.local",
    },
    acquisitionNotes: "Core article image — verified species, separate from gallery set.",
    updatedAt: timestamp,
  };

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${animalSlug}/${slug}`);
}

for (const [animalSlug, slugPatches] of Object.entries(patches)) {
  for (const [slug, patch] of Object.entries(slugPatches)) {
    applyPatch(animalSlug, slug, patch);
  }
}
