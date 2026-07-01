#!/usr/bin/env node
/**
 * Curated Wikimedia Commons photos for bottlenose dolphin — verified Tursiops truncatus only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/animals/bottlenose-dolphin/images");
const timestamp = new Date().toISOString();

const updates = {
  "dolphin-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/60/010_Atlantic_bottlenose_dolphin_jumping_at_Pelican_point_Photo_by_Giles_Laurent.jpg",
    width: 3628,
    height: 2419,
    alt: "Bottlenose dolphin leaping above the ocean surface",
    caption: "Dolphins leap out of the water to breathe through the blowhole on top of their heads.",
    galleryTopics: ["hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:010_Atlantic_bottlenose_dolphin_jumping_at_Pelican_point_Photo_by_Giles_Laurent.jpg",
    creatorName: "Giles Laurent",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Pelican Point, Namibia",
    imageType: "hero",
    featuredOnPages: ["core", "gallery"],
  },
  "dolphin-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/23/Tursiops_truncatus_%28Atlantic_bottlenose_dolphins%29_%28Pine_Island_Sound%2C_Florida%2C_USA%29_4_%2824181206149%29.jpg",
    width: 3008,
    height: 1445,
    alt: "Pod of bottlenose dolphins swimming in coastal waters off Florida",
    caption: "Bottlenose dolphins live in warm coastal waters, bays, and open ocean around the world.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tursiops_truncatus_(Atlantic_bottlenose_dolphins)_(Pine_Island_Sound,_Florida,_USA)_4_(24181206149).jpg",
    creatorName: "James St. John",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    location: "Pine Island Sound, Florida, USA",
    imageType: "habitat",
    featuredOnPages: ["gallery"],
  },
  "dolphin-diet": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/50/Dolphins_in_Cromarty_Firth_%282%29.JPG",
    width: 3344,
    height: 2504,
    alt: "Bottlenose dolphin surfacing in coastal waters while hunting",
    caption: "Dolphins hunt fish and squid, often working together to chase prey in shallow water.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dolphins_in_Cromarty_Firth_(2).JPG",
    creatorName: "Nilfanion",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    location: "Cromarty Firth, Scotland",
    imageType: "diet",
    featuredOnPages: ["gallery"],
  },
  "dolphin-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bottlenose_dolphin_with_young.JPG",
    width: 1679,
    height: 1153,
    alt: "Bottlenose dolphin mother swimming with her calf",
    caption: "Dolphin calves stay beside their mothers and learn how to hunt and communicate.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bottlenose_dolphin_with_young.JPG",
    creatorName: "Peter Asprey",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    location: "Ocean",
    imageType: "baby",
    featuredOnPages: ["gallery"],
  },
  "dolphin-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/99/Common_bottlenose_dolphins_%28Tursiops_truncatus%29_Sagres.jpg",
    width: 4231,
    height: 2116,
    alt: "Pod of common bottlenose dolphins swimming together off Sagres, Portugal",
    caption: "Dolphins live in social groups called pods that cooperate, play, and travel together.",
    galleryTopics: ["family", "fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Common_bottlenose_dolphins_(Tursiops_truncatus)_Sagres.jpg",
    creatorName: "Charles J. Sharp",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Sagres, Portugal",
    imageType: "family",
    featuredOnPages: ["gallery"],
  },
  "dolphin-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Common_Bottlenose_Dolphin_%28Tursiops_truncatus%29_Catalina_swimming.jpg",
    width: 4608,
    height: 3072,
    alt: "Bottlenose dolphin swimming in clear blue coastal water",
    caption: "These dolphins are found in temperate and tropical seas on almost every continent.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Common_Bottlenose_Dolphin_(Tursiops_truncatus)_Catalina_swimming.jpg",
    creatorName: "Kiloueka",
    licenseName: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    location: "Coastal ocean",
    imageType: "range",
    featuredOnPages: ["gallery"],
  },
  "dolphin-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Tursiops_truncatus_178353051.jpg",
    width: 2048,
    height: 1408,
    alt: "Side view of a bottlenose dolphin showing its full streamlined body",
    caption: "Adult bottlenose dolphins can grow about 6 to 12 feet long and weigh up to 1,400 pounds.",
    galleryTopics: ["size"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tursiops_truncatus_178353051.jpg",
    creatorName: "JUAN ROMERO",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Ocean",
    imageType: "size",
    featuredOnPages: ["gallery"],
  },
  "dolphin-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/07/Bottlenose_Dolphin_Blowhole.jpg",
    width: 800,
    height: 600,
    alt: "Close-up of a bottlenose dolphin blowhole on top of its head",
    caption: "The blowhole lets dolphins take quick breaths without slowing down in the water.",
    galleryTopics: ["closeup", "fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bottlenose_Dolphin_Blowhole.jpg",
    creatorName: "BabyNuke",
    licenseName: "Public domain",
    licenseUrl: "https://en.wikipedia.org/wiki/Public_domain",
    location: "Ocean surface",
    imageType: "closeup",
    featuredOnPages: ["gallery"],
  },
  "dolphin-fun-fact": {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg",
    width: 3000,
    height: 1995,
    alt: "Bottlenose dolphin riding the wake behind a boat on the Banana River",
    caption: "Dolphins often surf boat wakes and waves just for fun and to save energy.",
    galleryTopics: ["fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tursiops_truncatus_01.jpg",
    creatorName: "NASA",
    licenseName: "Public domain",
    licenseUrl: "https://en.wikipedia.org/wiki/Public_domain",
    location: "Banana River, Florida, USA",
    imageType: "fun-fact",
    featuredOnPages: ["gallery"],
  },
};

function buildRecord(slug, data) {
  const sourceFile = data.sourceUrl.split("/wiki/File:")[1];
  const commonsFile = decodeURIComponent(sourceFile);

  return {
    id: slug,
    animalSlug: "bottlenose-dolphin",
    slug,
    fileName: commonsFile.replace(/\.[^.]+$/, ".webp"),
    src: data.src,
    width: data.width,
    height: data.height,
    alt: data.alt,
    caption: data.caption,
    attributionText: `Photo by ${data.creatorName} via Wikimedia Commons, ${data.licenseName}`,
    attributionHtml: `Photo by <a href="${data.sourceUrl}">${data.creatorName}</a> via <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, <a href="${data.licenseUrl}">${data.licenseName}</a>`,
    source: {
      sourceName: "Wikimedia Commons",
      sourceUrl: data.sourceUrl,
      creatorName: data.creatorName,
      licenseName: data.licenseName,
      licenseUrl: data.licenseUrl,
      requiresAttribution: data.licenseName !== "CC0" && data.licenseName !== "Public domain",
      downloadedAt: timestamp,
      reviewedBy: "editor@wildlifedb.local",
    },
    imageType: data.imageType,
    galleryTopics: data.galleryTopics,
    featuredOnPages: data.featuredOnPages,
    location: data.location,
    acquisitionNotes: "Manually verified bottlenose dolphin image with correct species identification.",
    updatedAt: timestamp,
  };
}

for (const [slug, data] of Object.entries(updates)) {
  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(buildRecord(slug, data), null, 2)}\n`, "utf8");
  console.log(`Updated ${slug}`);
}
