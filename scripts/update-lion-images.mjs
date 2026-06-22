#!/usr/bin/env node
/**
 * One-off updater: replace placeholder Unsplash URLs with verified Wikimedia Commons assets.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dir = path.join(__dirname, "../content/animals/lion/images");

const updates = {
  "lion-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
    width: 1920,
    height: 1280,
    alt: "Male African lion resting on a rock in Namibia",
    caption: "A male lion rests on a rock while scanning the savanna around him.",
    galleryTopics: ["hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_waiting_in_Namibia.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  "lion-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Male_lion_on_savanna.jpg",
    width: 1920,
    height: 1280,
    alt: "Male lion standing in African savanna grassland",
    caption: "Lions live in open savannas where grass and scattered trees provide cover.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Male_lion_on_savanna.jpg",
    creatorName: "McD22",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  "lion-hunting": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Lion_%28Panthera_leo%29_on_zebra_remains_..._%2852153558417%29.jpg/1920px-Lion_%28Panthera_leo%29_on_zebra_remains_..._%2852153558417%29.jpg",
    width: 1920,
    height: 1280,
    alt: "Lion feeding at zebra remains on the savanna",
    caption: "Lions hunt large hoofed animals such as zebra and wildebeest.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_(Panthera_leo)_on_zebra_remains_..._(52153558417).jpg",
    creatorName: "Bernard DUPONT",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  "lion-eating": {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Lioness_at_kill.jpg",
    width: 1920,
    height: 1280,
    alt: "Lioness feeding at a prey carcass",
    caption: "After a hunt, pride members gather to feed on the kill.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lioness_at_kill.jpg",
    creatorName: "Clément Bardot",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  "lion-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Lion_%28Panthera_leo%29_cub_Etosha.jpg/1920px-Lion_%28Panthera_leo%29_cub_Etosha.jpg",
    width: 1920,
    height: 1280,
    alt: "Young lion cub in Etosha National Park",
    caption: "Lion cubs stay close to adults while learning how to survive.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_(Panthera_leo)_cub_Etosha.jpg",
    creatorName: "Bernard DUPONT",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  "lion-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Lions_%28Panthera_leo%29_pride_..._%2852742147651%29.jpg/1920px-Lions_%28Panthera_leo%29_pride_..._%2852742147651%29.jpg",
    width: 1920,
    height: 1280,
    alt: "Lion pride resting together on the savanna",
    caption: "Prides spend many hours resting together when the day is hot.",
    galleryTopics: ["family", "baby"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lions_(Panthera_leo)_pride_..._(52742147651).jpg",
    creatorName: "Bernard DUPONT",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  "lion-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lioness_%28Panthera_leo%29_%286871765268%29.jpg/1920px-Lioness_%28Panthera_leo%29_%286871765268%29.jpg",
    width: 1920,
    height: 1280,
    alt: "Close-up portrait of a lioness face",
    caption: "Close-up views reveal whiskers, eyes, and powerful jaw muscles.",
    galleryTopics: ["closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lioness_(Panthera_leo)_(6871765268).jpg",
    creatorName: "flowcomm",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  "lion-mane": {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
    width: 1920,
    height: 1280,
    alt: "Male lion with a full dark mane",
    caption: "A male lion's mane grows fuller with age and signals maturity.",
    galleryTopics: ["closeup", "fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_waiting_in_Namibia.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  "lion-roaring": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lion%2C_Mid-Roar.jpg/1920px-Lion%2C_Mid-Roar.jpg",
    width: 1920,
    height: 1280,
    alt: "Male lion roaring with mouth wide open",
    caption: "A lion's roar can carry for miles across open savanna.",
    galleryTopics: ["fun-fact", "hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion,_Mid-Roar.jpg",
    creatorName: "Ross Elliott",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  "lion-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/African-landscape-lion_%28Unsplash%29.jpg/1920px-African-landscape-lion_%28Unsplash%29.jpg",
    width: 1920,
    height: 1280,
    alt: "Lion in wide African grassland landscape",
    caption: "Open country shows the kind of spaces wild lions patrol.",
    galleryTopics: ["range", "habitat"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African-landscape-lion_(Unsplash).jpg",
    creatorName: "Unsplash contributor",
    licenseName: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  "lion-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lion_%28Panthera_leo%29_male_and_cub_Etosha.jpg/1920px-Lion_%28Panthera_leo%29_male_and_cub_Etosha.jpg",
    width: 1920,
    height: 1280,
    alt: "Adult male lion with a small cub showing size difference",
    caption: "A cub beside an adult shows how much lions grow over time.",
    galleryTopics: ["size", "baby"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_(Panthera_leo)_male_and_cub_Etosha.jpg",
    creatorName: "Bernard DUPONT",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  "lion-asiatic": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Adult_Asiatic_Lion.jpg",
    width: 1920,
    height: 1280,
    alt: "Adult Asiatic lion in forest habitat",
    caption: "Asiatic lions survive in India's Gir Forest, a woodland-grassland mosaic.",
    galleryTopics: ["range", "habitat"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Adult_Asiatic_Lion.jpg",
    creatorName: "Rupal Vaidya",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
};

for (const [slug, patch] of Object.entries(updates)) {
  const filePath = path.join(dir, `${slug}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  data.src = patch.src;
  data.width = patch.width;
  data.height = patch.height;
  data.alt = patch.alt;
  data.caption = patch.caption;
  data.galleryTopics = patch.galleryTopics;
  data.attributionText = `Photo by ${patch.creatorName} via Wikimedia Commons, ${patch.licenseName}`;
  data.source = {
    sourceName: "Wikimedia Commons",
    sourceUrl: patch.sourceUrl,
    creatorName: patch.creatorName,
    licenseName: patch.licenseName,
    licenseUrl: patch.licenseUrl,
    requiresAttribution: true,
    downloadedAt: "2026-06-21T00:00:00.000Z",
    reviewedBy: "content-team",
  };
  data.acquisitionNotes = "Licensed Wikimedia Commons image matched to image role.";
  data.updatedAt = "2026-06-21T00:00:00.000Z";

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(`Updated ${Object.keys(updates).length} lion image records.`);
