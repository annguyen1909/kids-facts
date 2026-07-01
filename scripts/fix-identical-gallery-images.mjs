#!/usr/bin/env node
/**
 * Replace gallery images that look identical to other photos on the same animal page.
 */
import { applyWikimediaUpdates } from "./lib/update-wikimedia-animal-images.mjs";

const GALLERY_REPLACEMENTS = [
  {
    animalSlug: "frilled-lizard",
    updates: [
      {
        slug: "frilled-lizard-fun-fact",
        title: "Frill-necked Lizard (Chlamydosaurus kingii) (8692599712).jpg",
        alt: "Frilled lizard sprinting upright on its hind legs across open ground",
        caption:
          "When escape is the best defense, the frilled lizard can rear up and run on its hind legs.",
        imageType: "fun-fact",
        galleryTopics: ["fun-fact"],
        featuredOnPages: ["gallery"],
        location: "Northern Territory, Australia",
        acquisitionNotes: "Distinct fun-fact gallery image — running display, not the hero frill shot.",
      },
      {
        slug: "frilled-lizard-family",
        title: "Chlamydosaurus kingii 103835211.jpg",
        alt: "Frilled lizard resting on a tree branch with its frill folded",
        caption: "Outside breeding season, frilled lizards spend much of their time quietly perched in trees.",
        imageType: "family",
        galleryTopics: ["family"],
        featuredOnPages: ["gallery"],
        location: "Northern Territory, Australia",
        acquisitionNotes: "Replaced burst-pair photo that looked identical to the range image.",
      },
    ],
  },
  {
    animalSlug: "narwhal",
    updates: [
      {
        slug: "narwhal-fun-fact",
        title: "EB1911 Cetacea - Fig. 8.—Upper surface of the Skull of male Narwhal (Monodon monoceros).jpg",
        alt: "Illustration of a male narwhal skull showing the long spiral tusk tooth",
        caption:
          "A narwhal's tusk is actually an elongated tooth that can grow more than 8 feet long.",
        imageType: "fun-fact",
        galleryTopics: ["fun-fact"],
        featuredOnPages: ["gallery"],
        location: "Arctic Ocean",
        acquisitionNotes: "Distinct fun-fact gallery image — unique from the pod baby photo.",
      },
    ],
  },
  {
    animalSlug: "axolotl",
    updates: [
      {
        slug: "axolotl-closeup",
        title: "Cromatóforos de larva de axolote pardo (Ambystoma mexicanum).jpg",
        alt: "Microscopic view of pigment cells in an axolotl larva",
        caption: "Axolotls can shift skin color through pigment cells called chromatophores.",
        imageType: "closeup",
        galleryTopics: ["closeup"],
        featuredOnPages: ["gallery"],
        location: "Mexico",
        acquisitionNotes: "Distinct close-up gallery image — unique from the hero portrait.",
      },
    ],
  },
  {
    animalSlug: "electric-eel",
    updates: [
      {
        slug: "electric-eel-closeup",
        title: "Electrophorus electricus 7zz.jpg",
        alt: "Electric eel showing its long snake-like body in dark aquarium water",
        caption: "Special electric organs along the eel's body can deliver powerful shocks.",
        imageType: "closeup",
        galleryTopics: ["closeup"],
        featuredOnPages: ["gallery"],
        location: "Amazon Basin",
        acquisitionNotes: "Distinct close-up gallery image — unique from the hero full-body shot.",
      },
    ],
  },
  {
    animalSlug: "hammerhead-shark",
    updates: [
      {
        slug: "hammerhead-shark-closeup",
        title: "Sphyrna mokarran head.jpg",
        alt: "Close-up of a great hammerhead shark head showing its wide hammer-shaped cephalofoil",
        caption: "The hammer-shaped head gives these sharks excellent binocular vision and sensing ability.",
        imageType: "closeup",
        galleryTopics: ["closeup"],
        featuredOnPages: ["gallery"],
        location: "Bahamas",
        acquisitionNotes: "Distinct close-up gallery image — unique from the hero swimming photo.",
      },
    ],
  },
  {
    animalSlug: "hippopotamus",
    updates: [
      {
        slug: "hippopotamus-size",
        title: "Hippopotamus @ Barcelona zoo.jpg",
        alt: "Adult hippopotamus standing at the edge of a pool showing its massive body size",
        caption: "Despite their stocky shape, hippos can weigh more than 3,000 pounds.",
        imageType: "size",
        galleryTopics: ["size"],
        featuredOnPages: ["gallery"],
        location: "Spain",
        acquisitionNotes: "Distinct size gallery image — unique from the hero fight scene.",
      },
    ],
  },
  {
    animalSlug: "ostrich",
    updates: [
      {
        slug: "ostrich-fun-fact",
        title: "Avestruz alta.jpg",
        alt: "Tall ostrich standing upright on open grassland showing its long neck and legs",
        caption: "Ostriches are the world's largest birds and can sprint faster than 40 mph.",
        imageType: "fun-fact",
        galleryTopics: ["fun-fact"],
        featuredOnPages: ["gallery"],
        location: "Africa",
        acquisitionNotes: "Distinct fun-fact gallery image — unique from the hero running composite.",
      },
    ],
  },
  {
    animalSlug: "salmon",
    updates: [
      {
        slug: "salmon-size",
        title: "Salmo salar.jpg",
        alt: "Atlantic salmon showing the full length of an adult fish",
        caption: "Large adult salmon can exceed 3 feet in length after years at sea.",
        imageType: "size",
        galleryTopics: ["size"],
        featuredOnPages: ["gallery"],
        location: "Norway",
        acquisitionNotes: "Distinct size gallery image — unique from the hero aquarium portrait.",
      },
    ],
  },
];

async function main() {
  for (const entry of GALLERY_REPLACEMENTS) {
    console.log(`\n=== ${entry.animalSlug} ===`);
    await applyWikimediaUpdates(entry);
  }

  console.log("\nDone updating gallery image manifests.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
