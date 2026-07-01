import fs from "node:fs";
import path from "node:path";
import {
  buildSyncedImageRecord,
  fetchCommonsFiles,
} from "./lib/wikimedia-image.mjs";

async function fetchMetadata(fileTitle, attempt = 1) {
  const normalizedTitle = fileTitle.replace(/^File:/, "");
  const files = await fetchCommonsFiles([normalizedTitle]);
  
  const lookupKey = normalizedTitle.replace(/_/g, " ").toLowerCase();
  let commons = files.get(normalizedTitle);
  if (!commons) {
    for (const [key, value] of files.entries()) {
      if (key.replace(/_/g, " ").toLowerCase() === lookupKey) {
        commons = value;
        break;
      }
    }
  }

  if (!commons) {
    if (attempt < 5) {
      const waitTime = attempt * 3000;
      console.warn(`Could not resolve ${fileTitle}. Retrying in ${waitTime / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitTime));
      return fetchMetadata(fileTitle, attempt + 1);
    }
    throw new Error(`No image info found for title: "${fileTitle}"`);
  }

  return commons;
}

async function updateAnimalImages(animalSlug, imageConfig) {
  const targetDir = path.join(process.cwd(), "content", "animals", animalSlug, "images");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Updating images for "${animalSlug}" in ${targetDir}...`);
  const timestamp = new Date().toISOString();

  for (const [key, config] of Object.entries(imageConfig)) {
    const slug = `${animalSlug}-${key}`;
    const filePath = path.join(targetDir, `${slug}.json`);

    try {
      console.log(`Fetching metadata for ${slug}...`);
      const commons = await fetchMetadata(config.fileTitle);

      const next = buildSyncedImageRecord(
        {
          id: slug,
          animalSlug,
          slug,
          fileName: `${slug}.jpg`,
          alt: config.alt || `${animalSlug} ${config.imageType}`,
          caption: config.caption || `${animalSlug} in its natural environment.`,
          galleryTopics: [config.imageType],
          featuredOnPages: config.featuredOnPages,
          imageType: config.imageType,
          location: config.location || "Unknown",
        },
        commons,
        timestamp,
        `Manually verified ${animalSlug} image for ${config.imageType}.`,
      );

      fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
      console.log(`Successfully wrote ${slug}.json`);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Error processing ${slug}:`, e.message);
    }
  }
}

const slug = process.argv[2];
const configPath = process.argv[3];

if (!slug || !configPath) {
  console.log("Usage: node scripts/update-animal-images-api.mjs <animal-slug> <config-json-path>");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
updateAnimalImages(slug, config)
  .then(() => console.log("Done!"))
  .catch((e) => console.error("Failed:", e));
