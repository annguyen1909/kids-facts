#!/usr/bin/env node
/**
 * Curated Wikimedia Commons photos for giant panda — verified Ailuropoda melanoleuca only.
 * URLs verified via Wikimedia API (2026-06-22).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/animals/giant-panda/images");
const timestamp = new Date().toISOString();

const updates = {
  "giant-panda-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Lightmatter_panda.jpg",
    width: 720,
    height: 480,
    alt: "Giant panda resting with black and white fur markings",
    caption: "Giant pandas are famous bears with black patches around their eyes, ears, and legs.",
    galleryTopics: ["hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lightmatter_panda.jpg",
    creatorName: "Aaron Logan",
    licenseName: "CC BY 1.0",
    licenseUrl: "https://creativecommons.org/licenses/by/1.0/",
    location: "San Diego Zoo, United States",
  },
  "giant-panda-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Pandas%21%21_%28GIANT_PANDA-WOLONG-SICHUAN-CHINA%29_%282150600169%29.jpg",
    width: 4124,
    height: 2912,
    alt: "Giant pandas in bamboo forest habitat at Wolong Nature Reserve, Sichuan, China",
    caption: "Wild giant pandas live in cool, misty bamboo forests on mountain slopes in central China.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pandas!!_(GIANT_PANDA-WOLONG-SICHUAN-CHINA)_(2150600169).jpg",
    creatorName: "Chi King",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    location: "Wolong Nature Reserve, Sichuan, China",
  },
  "giant-panda-diet": {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Panda_eating_bamboo_in_Panda_Base.jpg",
    width: 3456,
    height: 4608,
    alt: "Giant panda sitting and chewing fresh bamboo shoots",
    caption: "Giant pandas eat bamboo for up to 14 hours a day, munching on leaves and shoots.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panda_eating_bamboo_in_Panda_Base.jpg",
    creatorName: "MspreilsCN",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    location: "Chengdu Research Base of Giant Panda Breeding, China",
  },
  "giant-panda-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Panda_Cub_from_Wolong%2C_Sichuan%2C_China.JPG",
    width: 1728,
    height: 1152,
    alt: "Seven-month-old giant panda cub at Wolong Nature Reserve in Sichuan, China",
    caption: "Panda cubs are born tiny and pink, growing their black-and-white fur over several weeks.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panda_Cub_from_Wolong,_Sichuan,_China.JPG",
    creatorName: "Sheila Lau",
    licenseName: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Panda_Cub_from_Wolong,_Sichuan,_China.JPG",
    location: "Wolong Nature Reserve, Sichuan, China",
  },
  "giant-panda-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Panda_Mom_and_cub_play_%2825114209140%29.jpg",
    width: 2030,
    height: 2410,
    alt: "Mother giant panda playing with her cub on grass",
    caption: "A mother panda cares for her cub alone, teaching it to climb and eat bamboo.",
    galleryTopics: ["family", "baby"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panda_Mom_and_cub_play_(25114209140).jpg",
    creatorName: "J. Young P",
    licenseName: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Panda_Mom_and_cub_play_(25114209140).jpg",
    location: "China",
  },
  "giant-panda-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Pandas%21%21_%28GIANT_PANDA-WOLONG-SICHUAN-CHINA%29_%282150602031%29.jpg",
    width: 4048,
    height: 1936,
    alt: "Giant pandas in mountain bamboo habitat at Wolong, Sichuan province, China",
    caption: "Today wild giant pandas survive only in scattered mountain forests in Sichuan, Shaanxi, and Gansu.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pandas!!_(GIANT_PANDA-WOLONG-SICHUAN-CHINA)_(2150602031).jpg",
    creatorName: "Chi King",
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    location: "Wolong, Sichuan, China",
  },
  "giant-panda-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/54/Chengdu-pandas-d10.jpg",
    width: 1024,
    height: 768,
    alt: "Full-body view of a giant panda showing its round shape and size",
    caption: "Adult giant pandas weigh 200 to 300 pounds and have a thick, round body built for eating bamboo.",
    galleryTopics: ["size"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chengdu-pandas-d10.jpg",
    creatorName: "Colegota",
    licenseName: "CC BY-SA 2.5 es",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/es/deed.en",
    location: "Chengdu Research Base of Giant Panda Breeding, China",
  },
  "giant-panda-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/27/Panda_closeup.jpg",
    width: 1180,
    height: 1016,
    alt: "Close-up of a giant panda face with black eye patches and white fur",
    caption: "A giant panda's wide jaw and strong teeth are adapted for crushing tough bamboo stems.",
    galleryTopics: ["closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panda_closeup.jpg",
    creatorName: "Jcwf",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    location: "China",
  },
  "giant-panda-fun-fact": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/50/NZP-20091222-189MM-000002.jpg",
    width: 800,
    height: 533,
    alt: "Giant panda rolling and playing in fresh snow",
    caption: "Giant pandas love to roll in snow—even though their wild homes are usually mild mountain forests.",
    galleryTopics: ["fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:NZP-20091222-189MM-000002.jpg",
    creatorName: "Smithsonian's National Zoo",
    licenseName: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    location: "Smithsonian National Zoo, United States",
  },
};

for (const [slug, data] of Object.entries(updates)) {
  const filePath = path.join(dir, `${slug}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const next = {
    ...existing,
    src: data.src,
    width: data.width,
    height: data.height,
    alt: data.alt,
    caption: data.caption,
    galleryTopics: data.galleryTopics,
    location: data.location,
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
    acquisitionNotes: "Manually verified giant panda image with correct species identification.",
    updatedAt: timestamp,
  };

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${slug}`);
}
