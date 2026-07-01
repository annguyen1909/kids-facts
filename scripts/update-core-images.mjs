#!/usr/bin/env node
/**
 * @deprecated Use `npm run content:repair-urls` to re-sync src from Commons sourceUrl.
 * This script is kept for one-off patches only — always resolve files via Commons API.
 */
import { applyWikimediaUpdates } from "./lib/update-wikimedia-animal-images.mjs";

await applyWikimediaUpdates({
  animalSlug: "bottlenose-dolphin",
  updates: [
    {
      slug: "dolphin-core-range",
      title: "Tursiops truncatus.jpg",
      alt: "Bottlenose dolphin swimming in open coastal waters",
      caption: "Bottlenose dolphins live in warm coastal waters and open oceans worldwide.",
      imageType: "range",
      galleryTopics: ["range"],
      featuredOnPages: ["core"],
      location: "Open ocean",
      acquisitionNotes: "Core article range image — verified Commons file.",
    },
  ],
});

console.log("Patched dolphin-core-range via Commons API.");
