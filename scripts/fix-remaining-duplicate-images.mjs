#!/usr/bin/env node
import { applyWikimediaUpdates } from "./lib/update-wikimedia-animal-images.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const batches = [
  {
    animalSlug: "dragonfly",
    updates: [
      {
        slug: "dragonfly-core-diet",
        title: "Anax imperator Exuvie MHNT Parc de la Maourine.jpg",
        alt: "Emperor dragonfly exuvia showing its predatory life cycle",
        caption: "Dragonflies are fierce aerial hunters that catch insects in mid-flight.",
        imageType: "diet",
        galleryTopics: ["diet"],
        featuredOnPages: ["core"],
        location: "France",
        acquisitionNotes: "Core article diet image — unique from gallery diet image.",
      },
    ],
  },
  {
    animalSlug: "hercules-beetle",
    updates: [
      {
        slug: "hercules-beetle-core-habitat",
        title: "Dynastes hercules ecuatorianus MHNT.jpg",
        alt: "Hercules beetle in tropical forest habitat",
        caption: "Hercules beetles live in tropical rainforests of Central and South America.",
        imageType: "habitat",
        galleryTopics: ["habitat"],
        featuredOnPages: ["core"],
        location: "Ecuador",
        acquisitionNotes: "Core article habitat image — unique from gallery images.",
      },
      {
        slug: "hercules-beetle-core-range",
        title: "Dynastes hercules hercules01.JPG",
        alt: "Hercules beetle in its natural range across tropical forests",
        caption: "Hercules beetles range from southern Mexico through Central America to Bolivia.",
        imageType: "range",
        galleryTopics: ["range"],
        featuredOnPages: ["core"],
        location: "Costa Rica",
        acquisitionNotes: "Core article range image — unique from gallery images.",
      },
    ],
  },
  {
    animalSlug: "iguana",
    updates: [
      {
        slug: "iguana-core-baby",
        title: "Iguana iguana male head.jpg",
        alt: "Young green iguana showing early head and scale development",
        caption: "Baby green iguanas hatch from eggs and must learn to climb and find food quickly.",
        imageType: "baby",
        galleryTopics: ["baby"],
        featuredOnPages: ["core"],
        location: "Central America",
        acquisitionNotes: "Core article baby image — unique from gallery baby image.",
      },
    ],
  },
  {
    animalSlug: "leafcutter-ant",
    updates: [
      {
        slug: "leafcutter-ant-core-family",
        title: "Atta cephalotes-pjt.jpg",
        alt: "Leafcutter ants working together along a forest trail",
        caption: "Leafcutter ants live in huge colonies where thousands of workers cooperate.",
        imageType: "family",
        galleryTopics: ["family"],
        featuredOnPages: ["core"],
        location: "Central America",
        acquisitionNotes: "Core article family image — unique from gallery family image.",
      },
    ],
  },
  {
    animalSlug: "lionfish",
    updates: [
      {
        slug: "lionfish-core-family",
        title: "Pazifischer Rotfeuerfisch - Red lionfish - Pterois volitans.jpg",
        alt: "Red lionfish swimming with fins fully extended",
        caption: "Lionfish are solitary hunters but may gather where prey is abundant.",
        imageType: "family",
        galleryTopics: ["family"],
        featuredOnPages: ["core"],
        location: "Pacific Ocean",
        acquisitionNotes: "Core article family image — unique from gallery family and size images.",
      },
    ],
  },
  {
    animalSlug: "manta-ray",
    updates: [
      {
        slug: "manta-ray-core-baby",
        title: "Okinawa Giant oceanic manta ray.png",
        alt: "Young giant oceanic manta ray swimming in open water",
        caption: "Manta rays give birth to live young that are already several feet across.",
        imageType: "baby",
        galleryTopics: ["baby"],
        featuredOnPages: ["core"],
        location: "Okinawa, Japan",
        acquisitionNotes: "Core article baby image — unique from gallery baby image.",
      },
    ],
  },
  {
    animalSlug: "parrot",
    updates: [
      {
        slug: "parrot-core-habitat",
        title: "Scarlet Macaw Phoenix Zoo Mar23 A7R 04528.jpg",
        alt: "Scarlet macaw perched among tropical vegetation",
        caption: "Old trees with hollow trunks are essential for macaw nesting.",
        imageType: "habitat",
        galleryTopics: ["habitat"],
        featuredOnPages: ["core"],
        location: "Panama",
        acquisitionNotes: "Core article habitat image — unique from gallery habitat image.",
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    animalSlug: "lion",
    updates: [
      {
        slug: "lion-eating",
        title: "Lion (Panthera leo) feeding Kruger National Park.jpg",
        alt: "African lions feeding together on zebra remains after a hunt",
        caption: "After a hunt, pride members gather to feed on the kill.",
        imageType: "diet",
        galleryTopics: ["diet"],
        featuredOnPages: ["gallery"],
        location: "Masai Mara, Kenya",
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
  },
];

for (const batch of batches) {
  console.log(`\n=== ${batch.animalSlug} ===`);
  await applyWikimediaUpdates(batch);
  await sleep(3000);
}

console.log("\nDone.");
