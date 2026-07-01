import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { buildSyncedImageRecord } from "./lib/wikimedia-image.mjs";

type BabyUpdateConfig = {
  alt: string;
  caption: string;
  imageType: string;
  featuredOnPages: string[];
  location: string;
  fileTitle: string;
  licensing: {
    imageUrl: string;
    width: number;
    height: number;
    pageUrl: string;
    artist: string;
    licenseName: string;
    licenseUrl: string;
  };
};

type AnimalReplacement = {
  commonName: string;
  updates: Record<string, BabyUpdateConfig>;
};

async function main() {
  const scratchDir = "/Users/annguyen19/.gemini/antigravity/brain/b74091bc-ff32-4525-86f6-d5a992b3a077/scratch";
  const replacementsPath = path.join(scratchDir, "proposed_baby_replacements.json");

  if (!fs.existsSync(replacementsPath)) {
    console.error("❌ proposed_baby_replacements.json not found!");
    process.exit(1);
  }

  const replacements = JSON.parse(fs.readFileSync(replacementsPath, "utf8")) as Record<
    string,
    AnimalReplacement
  >;
  const timestamp = new Date().toISOString();

  const animalsToIngest = new Set<string>();

  for (const [animalSlug, animalData] of Object.entries(replacements)) {
    const { updates } = animalData;
    const targetDir = path.join(process.cwd(), "content", "animals", animalSlug, "images");

    console.log(`Processing updates for ${animalSlug}...`);

    for (const [key, updateConfig] of Object.entries(updates)) {
      const file = `${animalSlug}-${key}.json`;
      const filePath = path.join(targetDir, file);
      const slug = `${animalSlug}-${key}`;

      let existing = {};
      if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        existing = {
          id: slug,
          animalSlug,
          slug,
          fileName: `${slug}.jpg`,
          alt: updateConfig.alt,
          caption: updateConfig.caption,
          galleryTopics: [updateConfig.imageType],
          featuredOnPages: updateConfig.featuredOnPages,
          imageType: updateConfig.imageType,
          location: updateConfig.location,
        };
      }

      // Build commons object
      const commons = {
        title: updateConfig.fileTitle.replace(/^File:/, ""),
        src: updateConfig.licensing.imageUrl,
        width: updateConfig.licensing.width,
        height: updateConfig.licensing.height,
        sourceUrl: updateConfig.licensing.pageUrl,
        creatorName: updateConfig.licensing.artist,
        licenseName: updateConfig.licensing.licenseName,
        licenseUrl: updateConfig.licensing.licenseUrl,
      };

      try {
        const next = buildSyncedImageRecord(
          existing,
          commons,
          timestamp,
          `Manually verified ${animalSlug} image for ${updateConfig.imageType}.`
        );

        fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
        console.log(`  Updated ${file}`);
        animalsToIngest.add(animalSlug);
      } catch (err: any) {
        console.error(`  ❌ Error updating ${file}:`, err.message);
      }
    }
  }

  console.log(`\nUpdated configuration for ${animalsToIngest.size} animals.`);
  console.log(`Starting image ingestion for updated species...`);

  // Run ingestion sequentially or in batch for updated animals
  for (const animal of animalsToIngest) {
    console.log(`\nIngesting images for: ${animal}`);
    try {
      execSync(`npx tsx scripts/ingest-animal-images.ts --animal ${animal} --fast`, {
        cwd: process.cwd(),
        stdio: "inherit"
      });
    } catch (err: any) {
      console.error(`❌ Ingestion failed for ${animal}:`, err.message);
    }
  }

  console.log("\nFinished executing all updates!");
}

main().catch(console.error);
