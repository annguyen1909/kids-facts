#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { validateContent } from "@/lib/content-validation";
import { getDisplayImageSrc } from "@/lib/images";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] = val;
  }
}

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchImageBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let mimeType = res.headers.get("content-type") || "image/jpeg";
    if (!mimeType.startsWith("image/")) {
      mimeType = url.endsWith(".png") ? "image/png" : "image/jpeg";
    }

    return {
      data: buffer.toString("base64"),
      mimeType
    };
  } catch (err) {
    return null;
  }
}

const targetSlugs = [
  "ladybug",
  "honeybee",
  "monarch-butterfly",
  "praying-mantis",
  "luna-moth",
  "dragonfly",
  "firefly",
  "cicada",
  "leafcutter-ant",
  "hercules-beetle",
  "galapagos-tortoise",
  "iguana",
  "frilled-lizard",
  "gila-monster",
  "tokay-gecko",
  "manta-ray",
  "whale-shark",
  "hammerhead-shark",
  "lionfish"
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is not defined in .env.local");
    process.exit(1);
  }

  const { animals } = validateContent();
  const ai = new GoogleGenAI({ apiKey });

  const reportPath = path.join(
    "/Users/annguyen19/.gemini/antigravity/brain/dc06f6c4-d7cb-404e-ab49-e5358b7ef583",
    "image_validation_report.md"
  );

  let mdContent = `# AI Image Verification Report for New Animals\n\n`;
  mdContent += `This report lists the species, context, and quality validation results for the newly added animals using Gemini 2.5.\n\n`;
  mdContent += `| Animal | Image Slug | Type | Species Check | Context Check | Quality Check | Remarks |\n`;
  mdContent += `| --- | --- | --- | --- | --- | --- | --- |\n`;

  console.log(`Starting batch image check for ${targetSlugs.length} animals...`);
  console.log(`Saving report to: ${reportPath}`);

  for (const slug of targetSlugs) {
    const animal = animals.find(a => a.core.slug === slug);
    if (!animal) {
      console.log(`⚠️ Animal slug not found in database: ${slug}`);
      continue;
    }

    console.log(`\n🐾 Processing Animal: ${animal.core.name}...`);

    // Choose key images: only 'hero'
    const imagesToCheck = animal.images.filter(img => img.imageType === "hero");

    for (const image of imagesToCheck) {
      const displaySrc = getDisplayImageSrc(image.src);
      console.log(`   - Checking image: ${image.slug} (${image.imageType})...`);

      const imageData = await fetchImageBase64(displaySrc);
      if (!imageData) {
        console.log(`     ⚠️ Could not fetch image bytes. Skipping...`);
        mdContent += `| ${animal.core.name} | ${image.slug} | ${image.imageType} | ⚠️ SKIP | ⚠️ SKIP | ⚠️ SKIP | Fetch failed (rate limited/offline) |\n`;
        continue;
      }

      try {
        const prompt = `
You are an expert wildlife auditor. Verify this image for the animal "${animal.core.name}" (Scientific Name: ${animal.core.scientificName}).
Category: "${image.imageType}"
Alt text: "${image.alt}"
Caption: "${image.caption}"

Analyze the image and return EXACTLY four lines:
SPECIES: [PASS/FAIL] - [1 sentence justification]
CONTEXT: [PASS/FAIL] - [1 sentence justification]
QUALITY: [PASS/FAIL] - [1 sentence justification]
REMARKS: [Remarks or "None"]
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            {
              inlineData: {
                data: imageData.data,
                mimeType: imageData.mimeType
              }
            },
            prompt
          ]
        });

        const text = response.text || "";
        const lines = text.split("\n");
        let species = "FAIL";
        let context = "FAIL";
        let quality = "FAIL";
        let remarks = "None";

        for (const line of lines) {
          if (line.startsWith("SPECIES:")) species = line.replace("SPECIES:", "").trim();
          if (line.startsWith("CONTEXT:")) context = line.replace("CONTEXT:", "").trim();
          if (line.startsWith("QUALITY:")) quality = line.replace("QUALITY:", "").trim();
          if (line.startsWith("REMARKS:")) remarks = line.replace("REMARKS:", "").trim();
        }

        mdContent += `| **${animal.core.name}** | \`${image.slug}\` | ${image.imageType} | ${species} | ${context} | ${quality} | ${remarks} |\n`;
        console.log(`     Species: ${species.split("-")[0]}`);
      } catch (err: any) {
        console.error(`     ❌ Gemini Error: ${err.message}`);
        mdContent += `| **${animal.core.name}** | \`${image.slug}\` | ${image.imageType} | ❌ ERROR | ❌ ERROR | ❌ ERROR | Gemini API call failed: ${err.message} |\n`;
      }

      // Concurrency delay to prevent 429 from Google APIs
      await new Promise(resolve => setTimeout(resolve, 13000));
    }
    
    // Write progress to file after each animal
    fs.writeFileSync(reportPath, mdContent);
  }

  console.log(`\nBatch checking completed! Report saved to ${reportPath}`);
}

main().catch(console.error);
