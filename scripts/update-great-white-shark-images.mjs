#!/usr/bin/env node
import { applyWikimediaUpdates } from "./lib/update-wikimedia-animal-images.mjs";

await applyWikimediaUpdates({
  animalSlug: "great-white-shark",
  updates: [
    {
      slug: "great-white-shark-hero",
      title: "Great White Shark (14730796397).jpg",
      alt: "Great white shark swimming just below the surface",
      caption: "Great white sharks are powerful ocean fish with streamlined bodies and sharp teeth.",
      imageType: "hero",
      galleryTopics: ["hero"],
      featuredOnPages: ["gallery"],
      location: "Open ocean",
      acquisitionNotes:
        "Manually curated great white shark hero image with verified species identification.",
    },
    {
      slug: "great-white-shark-habitat",
      title: "Guadalupe Island Great White Shark Underwater.jpg",
      alt: "Great white shark gliding through clear blue ocean water",
      caption: "Great white sharks patrol coastal seas and offshore waters in many parts of the world.",
      imageType: "habitat",
      galleryTopics: ["habitat"],
      featuredOnPages: ["gallery"],
      location: "Guadalupe Island, Mexico",
      acquisitionNotes:
        "Manually curated great white shark habitat image with verified species identification.",
    },
    {
      slug: "great-white-shark-diet",
      title: "8185 white shark hunts JF.jpg",
      alt: "Great white shark hunting near the water surface",
      caption: "Great white sharks are carnivores that hunt fish and larger marine animals.",
      imageType: "diet",
      galleryTopics: ["diet"],
      featuredOnPages: ["gallery"],
      location: "South Africa",
      acquisitionNotes:
        "Manually curated great white shark diet image with verified species identification.",
    },
    {
      slug: "great-white-shark-baby",
      title: "Great white aqurium.jpg",
      alt: "Young great white shark swimming in an aquarium",
      caption: "Young great white sharks usually hunt smaller prey than full-grown adults do.",
      imageType: "baby",
      galleryTopics: ["baby"],
      featuredOnPages: ["gallery"],
      location: "Monterey Bay Aquarium, California",
      acquisitionNotes:
        "Manually curated young great white shark image used for the baby slot.",
    },
    {
      slug: "great-white-shark-family",
      title: "Great White Shark (Carcharodon carcharias) (32532118720).jpg",
      alt: "Great white shark swimming through blue water",
      caption: "Great white sharks are mostly solitary and usually do not stay in family groups.",
      imageType: "family",
      galleryTopics: ["family"],
      featuredOnPages: ["gallery"],
      location: "South Africa",
      acquisitionNotes:
        "Manually curated great white shark behavior image for the family-style slot.",
    },
    {
      slug: "great-white-shark-range",
      title: "White shark.jpg",
      alt: "Great white shark in open ocean habitat",
      caption: "Great white sharks live in temperate and coastal oceans around the world.",
      imageType: "range",
      galleryTopics: ["range"],
      featuredOnPages: ["gallery"],
      location: "Open ocean",
      acquisitionNotes:
        "Manually curated great white shark range image with verified species identification.",
    },
    {
      slug: "great-white-shark-size",
      title:
        "Great white shark at Isla Guadalupe, Mexico, 2017. Shark cage diving MV Horizon. Animal estimated at 16-18 feet in length, age unknown.png",
      alt: "Large great white shark showing full body length underwater",
      caption: "Adult great white sharks can grow longer than a small car.",
      imageType: "size",
      galleryTopics: ["size"],
      featuredOnPages: ["gallery"],
      location: "Isla Guadalupe, Mexico",
      acquisitionNotes:
        "Manually curated great white shark size image with verified species identification.",
    },
    {
      slug: "great-white-shark-closeup",
      title: "White shark teeth closeup Florida.jpg",
      alt: "Close-up of great white shark teeth in rows",
      caption: "Great white sharks replace old teeth with new ones throughout life.",
      imageType: "closeup",
      galleryTopics: ["closeup"],
      featuredOnPages: ["gallery"],
      location: "Florida, United States",
      acquisitionNotes:
        "Manually curated great white shark close-up image with verified species identification.",
    },
    {
      slug: "great-white-shark-fun-fact",
      title: "Surfacing great white edit 4.jpg",
      alt: "Great white shark surfacing with its head above water",
      caption: "A great white shark can rise quickly toward the surface while investigating prey.",
      imageType: "fun-fact",
      galleryTopics: ["fun-fact"],
      featuredOnPages: ["gallery"],
      location: "South Africa",
      acquisitionNotes:
        "Manually curated great white shark fun-fact image with verified species identification.",
    },
    {
      slug: "great-white-shark-core-habitat",
      title: "Great White Shark (Carcharodon carcharias).jpg",
      alt: "Great white shark moving through clear coastal water",
      caption: "Coastal seas give great white sharks rich hunting grounds and travel routes.",
      imageType: "habitat",
      galleryTopics: ["habitat"],
      featuredOnPages: ["core"],
      location: "Open ocean",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
    {
      slug: "great-white-shark-core-diet",
      title: "Cape Agulhas white shark JF2.jpg",
      alt: "Great white shark turning near the surface during a hunt",
      caption: "Great white sharks often attack from below with a fast upward burst.",
      imageType: "diet",
      galleryTopics: ["diet"],
      featuredOnPages: ["core"],
      location: "Cape Agulhas, South Africa",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
    {
      slug: "great-white-shark-core-family",
      title: "Great White Shark (Carcharodon carcharias) (32872319266).jpg",
      alt: "Great white shark swimming alone in open water",
      caption: "Unlike pod-living dolphins, great white sharks usually travel by themselves.",
      imageType: "family",
      galleryTopics: ["family"],
      featuredOnPages: ["core"],
      location: "South Africa",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
    {
      slug: "great-white-shark-core-baby",
      title: "Great White Shark (Carcharodon carcharias) (32531155910).jpg",
      alt: "Smaller great white shark swimming in blue water",
      caption: "Young great whites begin life hunting smaller ocean prey than adults do.",
      imageType: "baby",
      galleryTopics: ["baby"],
      featuredOnPages: ["core"],
      location: "South Africa",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
    {
      slug: "great-white-shark-core-closeup",
      title: "Great white shark at Guadalupe Island.png",
      alt: "Great white shark head and snout seen underwater",
      caption: "A great white shark uses smell, sight, and other senses while tracking prey.",
      imageType: "closeup",
      galleryTopics: ["closeup"],
      featuredOnPages: ["core"],
      location: "Guadalupe Island, Mexico",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
    {
      slug: "great-white-shark-core-range",
      title: "Great white shark at Isla Guadalupe, Mexico.png",
      alt: "Great white shark cruising through broad ocean habitat",
      caption: "Great white sharks can travel long distances between feeding areas and coasts.",
      imageType: "range",
      galleryTopics: ["range"],
      featuredOnPages: ["core"],
      location: "Isla Guadalupe, Mexico",
      acquisitionNotes:
        "Core article image curated separately from the great white shark gallery set.",
    },
  ],
});
