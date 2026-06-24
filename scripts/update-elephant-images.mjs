#!/usr/bin/env node
/**
 * Curated Wikimedia Commons photos for African elephant — verified Loxodonta africana only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../content/animals/african-elephant/images");
const timestamp = new Date().toISOString();

const updates = {
  "elephant-hero": {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/64/African_bush_elephant_%28Loxodonta_africana%29%2C_Masai_Mara.jpg",
    width: 5068,
    height: 3379,
    alt: "African bush elephant walking across grassland in Masai Mara, Kenya",
    caption: "African elephants are the largest land animals alive today.",
    galleryTopics: ["hero"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African_bush_elephant_(Loxodonta_africana),_Masai_Mara.jpg",
    creatorName: "Hobbyfotowiki",
    licenseName: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    location: "Masai Mara, Kenya",
    imageType: "hero",
    featuredOnPages: ["core", "gallery", "habitat"],
  },
  "elephant-habitat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ea/African_Elephant_from_Amboseli.jpg",
    width: 1281,
    height: 1920,
    alt: "African elephant walking through savanna grassland in Amboseli",
    caption: "Elephants live in savannas, forests, and grasslands across sub-Saharan Africa.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African_Elephant_from_Amboseli.jpg",
    creatorName: "Siggesson77",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    location: "Amboseli, Kenya",
    imageType: "habitat",
    featuredOnPages: ["gallery", "habitat"],
  },
  "elephant-diet": {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/db/African_bush_elephant_%28Loxodonta_africana%29_drinking_Kruger.jpg",
    width: 4642,
    height: 3094,
    alt: "African bush elephant drinking water with its trunk in Kruger National Park",
    caption: "An elephant's trunk works like a hose and a hand when it drinks and feeds.",
    galleryTopics: ["diet", "closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African_bush_elephant_(Loxodonta_africana)_drinking_Kruger.jpg",
    creatorName: "Charles J. Sharp",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Kruger National Park, South Africa",
    imageType: "diet",
    featuredOnPages: ["gallery", "diet"],
  },
  "elephant-baby": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/9c/African_bush_elephant_%28Loxodonta_africana%29_baby_6_weeks.jpg",
    width: 6000,
    height: 4000,
    alt: "Six-week-old African bush elephant calf standing on grass",
    caption: "Baby elephants stay close to their mothers for years while learning to survive.",
    galleryTopics: ["baby", "family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African_bush_elephant_(Loxodonta_africana)_baby_6_weeks.jpg",
    creatorName: "Charles J. Sharp",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Wildlife habitat",
    imageType: "baby",
    featuredOnPages: ["gallery", "behavior"],
  },
  "elephant-family": {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a1/079_Herd_of_African_bush_elephants_drinking_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    width: 8640,
    height: 5760,
    alt: "Herd of African bush elephants drinking together at a waterhole",
    caption: "Female-led herds travel together and help protect calves.",
    galleryTopics: ["family"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:079_Herd_of_African_bush_elephants_drinking_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    creatorName: "Giles Laurent",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Etosha National Park, Namibia",
    imageType: "family",
    featuredOnPages: ["gallery", "behavior"],
  },
  "elephant-range": {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/African_bush_elephants_%28Loxodonta_africana%29_female_with_six-week-old_baby.jpg",
    width: 5576,
    height: 3718,
    alt: "African bush elephant mother and calf in open African grassland",
    caption: "Today wild African elephants live mainly in protected parks across sub-Saharan Africa.",
    galleryTopics: ["habitat", "range"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:African_bush_elephants_(Loxodonta_africana)_female_with_six-week-old_baby.jpg",
    creatorName: "Charles J. Sharp",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Sub-Saharan Africa",
    imageType: "range",
    featuredOnPages: ["gallery", "habitat"],
  },
  "elephant-size": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/94/178_Male_African_bush_elephant_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    width: 8213,
    height: 5475,
    alt: "Full-body view of a large male African bush elephant on open plains",
    caption: "Adult African elephants can stand up to 13 feet tall and weigh more than 6 tons.",
    galleryTopics: ["size"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:178_Male_African_bush_elephant_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    creatorName: "Giles Laurent",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Etosha National Park, Namibia",
    imageType: "size",
    featuredOnPages: ["gallery"],
  },
  "elephant-closeup": {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/101_African_bush_elephant_face_close-up_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    width: 8379,
    height: 5586,
    alt: "Close-up of an African bush elephant face showing trunk, ear, and tusks",
    caption: "Large ears help elephants cool down, while tusks are enlarged teeth.",
    galleryTopics: ["closeup"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:101_African_bush_elephant_face_close-up_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg",
    creatorName: "Giles Laurent",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Etosha National Park, Namibia",
    imageType: "closeup",
    featuredOnPages: ["gallery"],
  },
  "elephant-fun-fact": {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Male_Bush_Elephant_Head_Trunk_Up_Kafue_Jul23_A7R_05195.jpg",
    width: 4205,
    height: 2803,
    alt: "Male African bush elephant raising its trunk in Kafue National Park",
    caption: "Elephants raise their trunks to smell the air and communicate with other herd members.",
    galleryTopics: ["fun-fact"],
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Male_Bush_Elephant_Head_Trunk_Up_Kafue_Jul23_A7R_05195.jpg",
    creatorName: "Timothy A. Gonsalves",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    location: "Kafue National Park, Zambia",
    imageType: "fun-fact",
    featuredOnPages: ["gallery"],
  },
};

function buildRecord(slug, data) {
  const sourceFile = data.sourceUrl.split("/wiki/File:")[1];
  const commonsFile = decodeURIComponent(sourceFile);

  return {
    id: slug,
    animalSlug: "african-elephant",
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
      reviewedBy: "editor@kidsfacts.local",
    },
    imageType: data.imageType,
    galleryTopics: data.galleryTopics,
    featuredOnPages: data.featuredOnPages,
    location: data.location,
    acquisitionNotes: "Manually verified African elephant image with correct species identification.",
    updatedAt: timestamp,
  };
}

for (const [slug, data] of Object.entries(updates)) {
  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(buildRecord(slug, data), null, 2)}\n`, "utf8");
  console.log(`Updated ${slug}`);
}
