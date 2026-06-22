#!/usr/bin/env node
/**
 * Curated Wikimedia Commons images for red panda — verified Ailurus fulgens only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/animals/red-panda/images");
const timestamp = new Date().toISOString();

const updates = {
  "red-panda-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Red_Panda7.jpg",
    width: 7808,
    height: 5204,
    alt: "Red panda resting on a mossy branch in Langtang National Park, Nepal",
    caption: "Wild red pandas live in cool, forested mountains where they climb and rest in trees.",
    galleryTopics: ["hero", "habitat"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_Panda7.jpg",
    creatorName: "Mildeep",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Langtang National Park, Nepal",
  },
  "red-panda-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Red_Panda_DSC_3253_copy.jpg",
    width: 5130,
    height: 3383,
    alt: "Red panda perched in a tree in its forest habitat",
    caption: "Red pandas use trees for resting, escaping danger, and moving through mountain forests.",
    galleryTopics: ["habitat"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_Panda_DSC_3253_copy.jpg",
    creatorName: "Supradai",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    location: "Montane forest",
  },
  "red-panda-diet": {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Ailurus_fulgens_eating.JPG",
    width: 3400,
    height: 3400,
    alt: "Red panda eating bamboo leaves",
    caption: "Red pandas spend much of their day eating bamboo leaves and shoots.",
    galleryTopics: ["diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_eating.JPG",
    creatorName: "Ericj",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    location: "Bamboo forest",
  },
  "red-panda-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/80/Two_Red_Panda_Cubs_in_the_Tree_01.jpg",
    width: 8824,
    height: 5883,
    alt: "Two red panda cubs perched in a tree in Langtang National Park, Nepal",
    caption: "Red panda cubs stay in the nest and with their mother for months after birth.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_Red_Panda_Cubs_in_the_Tree_01.jpg",
    creatorName: "Sunuwargr",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Langtang National Park, Nepal",
  },
  "red-panda-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Curious_Red_Panda_Siblings_in_Langtang_National_Park.jpg",
    width: 9068,
    height: 6045,
    alt: "Two young red pandas in a tree in Langtang National Park, Nepal",
    caption: "Young red pandas learn to climb and explore the forest under their mother's care.",
    galleryTopics: ["family", "baby"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Curious_Red_Panda_Siblings_in_Langtang_National_Park.jpg",
    creatorName: "Sunuwargr",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Langtang National Park, Nepal",
  },
  "red-panda-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Panda%2C_Gentle_Tree-Dweller_of_the_Himalayas.jpg",
    width: 9323,
    height: 6215,
    alt: "Red panda in the Himalayan mountains",
    caption: "Red pandas are native to cool mountain forests in the eastern Himalayas and nearby China.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_Panda,_Gentle_Tree-Dweller_of_the_Himalayas.jpg",
    creatorName: "Sunuwargr",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Himalayas",
  },
  "red-panda-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/16/Red_Panda_full_body_2024.jpg",
    width: 8640,
    height: 5420,
    alt: "Full-body view of a red panda showing its size and bushy tail",
    caption: "An adult red panda is about cat-sized, with a long, ringed tail that helps with balance.",
    galleryTopics: ["size"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_Panda_full_body_2024.jpg",
    creatorName: "Suyesha-Pooja",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Mountain forest",
  },
  "red-panda-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Red_panda_DSC_3219_copy.jpg",
    width: 4668,
    height: 3210,
    alt: "Close-up of a red panda face with reddish fur and white markings",
    caption: "Red pandas have white face markings, pointed ears, and a special thumb-like wrist bone for gripping bamboo.",
    galleryTopics: ["closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_panda_DSC_3219_copy.jpg",
    creatorName: "Supradai",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    location: "Forest habitat",
  },
  "red-panda-fun-fact": {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Red_panda_feeding_using_false_thumb%2C_Bratislava%2C_Jan_2023.jpg",
    width: 6016,
    height: 4012,
    alt: "Red panda using its false thumb to hold bamboo while feeding",
    caption: "A red panda's extra wrist bone works like a thumb, helping it grasp bamboo stems and branches.",
    galleryTopics: ["fun-fact", "diet"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_panda_feeding_using_false_thumb,_Bratislava,_Jan_2023.jpg",
    creatorName: "Soggy Pandas",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Bratislava Zoo",
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
    acquisitionNotes: "Manually verified red panda image with correct species identification.",
    updatedAt: timestamp,
  };

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${slug}`);
}
