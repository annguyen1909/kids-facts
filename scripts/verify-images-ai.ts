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
    
    // Determine mimeType from URL or headers
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

async function main() {
  const args = process.argv.slice(2);
  const targetSlug = args[0];

  if (!targetSlug) {
    console.log("Usage: npm run content:verify-images-ai <animal-slug>");
    console.log("Example: npm run content:verify-images-ai red-panda");
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is not defined in .env.local");
    process.exit(1);
  }

  const { animals } = validateContent();
  const animal = animals.find(a => a.core.slug === targetSlug);

  if (!animal) {
    console.error(`❌ Error: Animal with slug "${targetSlug}" not found in content.`);
    console.log(`Available slugs: ${animals.map(a => a.core.slug).join(", ")}`);
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  console.log("=========================================================================");
  console.log(`🤖 AI CONTENT RELEVANCE CHECK FOR: ${animal.core.name.toUpperCase()} (${animal.core.slug})`);
  console.log(`Images found: ${animal.images.length}`);
  console.log("=========================================================================\n");

  for (const image of animal.images) {
    const displaySrc = getDisplayImageSrc(image.src);
    console.log(`Checking image: "${image.slug}" (${image.imageType})...`);
    console.log(`  Source: ${displaySrc}`);

    const imageData = await fetchImageBase64(displaySrc);
    if (!imageData) {
      console.log(`  ⚠️ Could not fetch image data from URL (might be rate-limited or offline). Skipping...\n`);
      continue;
    }

    try {
      const prompt = `
You are an expert wildlife biologist and educational content auditor for a kids' encyclopedia.
Review this image for the animal page of the "${animal.core.name}" (Scientific Name: ${animal.core.scientificName}).
The image is categorized as: "${image.imageType}" (e.g. hero, baby, diet, habitat, family, size).
Alt text: "${image.alt}"
Caption: "${image.caption}"

Perform the following verification:
1. [SPECIES CORRECTNESS]: Does this image show the correct animal (${animal.core.name} / ${animal.core.scientificName})? If not, identify what animal it actually shows.
2. [CONTEXT APPROPRIATENESS]: Does the image depict the assigned category "${image.imageType}" accurately? (e.g., if it is 'baby', is it a baby/young animal? if it is 'diet', does it show it eating or show its food source? if it is 'habitat', is it in the correct natural surroundings?).
3. [VISUAL QUALITY & SUITABILITY]: Is the image clear, appropriate, and of high educational quality for children?

Return your response in this EXACT format:
SPECIES: [PASS or FAIL] - [Short 1-sentence explanation]
CONTEXT: [PASS or FAIL] - [Short 1-sentence explanation]
QUALITY: [PASS or FAIL] - [Short 1-sentence explanation]
REMARKS: [Any warnings or suggestions for replacement, otherwise "None"]
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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

      console.log(response.text?.trim());
      console.log("\n-------------------------------------------------------------------------\n");
    } catch (err: any) {
      console.error(`  ❌ Error querying Gemini API: ${err.message}\n`);
    }

    // Delay slightly to prevent rapid request rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main().catch(console.error);
