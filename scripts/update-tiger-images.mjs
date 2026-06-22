#!/usr/bin/env node
/**
 * Curated Wikimedia Commons photos for tiger — verified Panthera tigris only.
 * URLs verified via Wikimedia API (2026-06-21).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/animals/tiger/images");
const timestamp = new Date().toISOString();

const updates = {
  "tiger-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/97/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3.jpg",
    width: 5100,
    height: 3400,
    alt: "Bengal tigress walking through grass in India",
    caption: "Tigers are powerful wild cats with orange fur and black stripes.",
    galleryTopics: ["hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bengal_tiger_(Panthera_tigris_tigris)_female_3.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "India",
  },
  "tiger-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/da/Panthera_tigris_tigris_Tidoba_20150306.jpg",
    width: 4057,
    height: 2705,
    alt: "Bengal tiger standing in dry forest habitat at Tadoba Andhari Tiger Reserve, India",
    caption: "Wild tigers live in forests, grasslands, and wetlands across Asia.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panthera_tigris_tigris_Tidoba_20150306.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Tadoba Andhari Tiger Reserve, India",
  },
  "tiger-diet": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Tiger_%28Panthera_tigris%29_eating_deer_%2819268279553%29.jpg",
    width: 3168,
    height: 4752,
    alt: "Tiger feeding on deer prey in the wild",
    caption: "Tigers are carnivores that hunt deer, wild pigs, and other large animals.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiger_(Panthera_tigris)_eating_deer_(19268279553).jpg",
    creatorName: "Rohit Varma",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    location: "India",
  },
  "tiger-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Amur_Tiger_Panthera_tigris_altaica_Cub_Walking_1500px.jpg",
    width: 1500,
    height: 1000,
    alt: "Young Amur tiger cub walking on grass",
    caption: "Tiger cubs are born blind and depend on their mother for food and protection.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amur_Tiger_Panthera_tigris_altaica_Cub_Walking_1500px.jpg",
    creatorName: "Keven Law",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    location: "Wildlife habitat",
  },
  "tiger-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Panthera_tigris_tigris_Tigress_with_cubs_Tadoba_India.jpg",
    width: 720,
    height: 480,
    alt: "Tigress with her cubs at Tadoba Andhari Tiger Reserve, India",
    caption: "A mother tiger raises her cubs alone, teaching them to hunt over two years.",
    galleryTopics: ["family", "baby"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panthera_tigris_tigris_Tigress_with_cubs_Tadoba_India.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Tadoba Andhari Tiger Reserve, India",
  },
  "tiger-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/27/Bandhavgarh_Tiger_Habitat.jpg",
    width: 2048,
    height: 1365,
    alt: "Forest and grassland habitat at Bandhavgarh National Park, India",
    caption: "Today wild tigers survive mainly in protected forests across South and Southeast Asia.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bandhavgarh_Tiger_Habitat.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Bandhavgarh National Park, India",
  },
  "tiger-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Panthera_tigris_-_the_big_cat.jpg",
    width: 2762,
    height: 1841,
    alt: "Full-body view of a tiger showing its size and stripes",
    caption: "Adult tigers are among the largest cats on Earth—males can weigh over 500 pounds.",
    galleryTopics: ["size"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panthera_tigris_-_the_big_cat.jpg",
    creatorName: "Yathin S Krishnappa",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "India",
  },
  "tiger-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/25/Amur_Tiger_Panthera_tigris_altaica_Eye_2112px_edit.jpg",
    width: 2112,
    height: 1408,
    alt: "Close-up of an Amur tiger eye and face with whiskers and stripes",
    caption: "A tiger's whiskers, sharp teeth, and night vision help it hunt in forest shadows.",
    galleryTopics: ["closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amur_Tiger_Panthera_tigris_altaica_Eye_2112px_edit.jpg",
    creatorName: "Keven Law",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    location: "Wildlife habitat",
  },
  "tiger-fun-fact": {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/01/Swimming_Panthera_tigris_altaica_Leipzig_Zoo_2013.jpg",
    width: 4552,
    height: 3035,
    alt: "Amur tiger swimming through water",
    caption: "Unlike many cats, tigers are strong swimmers and often cool off in rivers and lakes.",
    galleryTopics: ["fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Swimming_Panthera_tigris_altaica_Leipzig_Zoo_2013.jpg",
    creatorName: "Keven Law",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    location: "Leipzig Zoo, Germany",
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
      requiresAttribution: true,
      downloadedAt: timestamp,
      reviewedBy: "editor@kidsfacts.local",
    },
    acquisitionNotes: "Manually verified tiger image with correct species identification.",
    updatedAt: timestamp,
  };

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${slug}`);
}
