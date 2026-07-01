import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

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

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY is not defined");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

type Suspect = {
  animal: string;
  file: string;
  imageType: string;
  originalTitle: string;
  sourceUrl: string;
};

function resolveLocalFile(animal: string, imgData: any): string | null {
  const relativePaths = [
    imgData.srcSet?.web1200,
    imgData.srcSet?.thumbnail400,
    imgData.src
  ].filter(Boolean);

  for (const rel of relativePaths) {
    const abs = path.join(process.cwd(), "public", rel);
    if (fs.existsSync(abs)) {
      return abs;
    }
  }

  const baseSlug = imgData.slug;
  const webDir = path.join(process.cwd(), "public", "images", "animals", animal, "web");
  if (fs.existsSync(webDir)) {
    const files = fs.readdirSync(webDir);
    const match = files.find(f => f.startsWith(baseSlug));
    if (match) {
      return path.join(webDir, match);
    }
  }

  const thumbDir = path.join(process.cwd(), "public", "images", "animals", animal, "thumbnails");
  if (fs.existsSync(thumbDir)) {
    const files = fs.readdirSync(thumbDir);
    const match = files.find(f => f.startsWith(baseSlug));
    if (match) {
      return path.join(thumbDir, match);
    }
  }

  return null;
}

async function checkImage(suspect: Suspect, attempt = 1): Promise<any> {
  const animalJsonPath = path.join(process.cwd(), "content", "animals", suspect.animal, "animal.json");
  if (!fs.existsSync(animalJsonPath)) {
    return { status: "error", reason: "animal.json not found" };
  }
  const animalData = JSON.parse(fs.readFileSync(animalJsonPath, "utf-8"));
  const commonName = animalData.name;
  const scientificName = animalData.scientificName;
  const offspringName = animalData.reproduction?.offspringName || "baby";

  const imgJsonPath = path.join(process.cwd(), "content", "animals", suspect.animal, "images", suspect.file);
  if (!fs.existsSync(imgJsonPath)) {
    return { status: "error", reason: "image json not found" };
  }
  const imgData = JSON.parse(fs.readFileSync(imgJsonPath, "utf-8"));
  
  const absolutePath = resolveLocalFile(suspect.animal, imgData);
  if (!absolutePath) {
    return { status: "error", reason: `No local image file found for ${suspect.animal}/${suspect.file}` };
  }

  const buffer = fs.readFileSync(absolutePath);
  const base64Data = buffer.toString("base64");
  const mimeType = absolutePath.endsWith(".webp") ? "image/webp" : "image/jpeg";

  const prompt = `
You are a zoologist. Inspect this image.
We are auditing species images for an educational wildlife website.
This image is assigned to the "baby" or "young" category for the species: "${commonName}" (scientific name: "${scientificName}").
The offspring name for this species is: "${offspringName}".

Is the animal in this image a baby, pup, cub, larva, caterpillar, nymph, chick, fledgling, joey, hatchling, tadpole, or young juvenile of the species "${commonName}"? Or is it an adult?
Note: For insects or amphibians, a larva, nymph, caterpillar, or tadpole is a valid baby stage. For fish, a fry, fingerling, or small juvenile is a valid baby stage.

Provide your output in this exact format:
IS_BABY: [YES or NO]
REASON: [Brief explanation of why it is or isn't a baby/young animal]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType
          }
        },
        prompt
      ]
    });

    const text = response.text?.trim() || "";
    const isBabyLine = text.split("\n").find(line => line.startsWith("IS_BABY:"));
    const reasonLine = text.split("\n").find(line => line.startsWith("REASON:"));

    const isBabyStr = isBabyLine ? isBabyLine.replace("IS_BABY:", "").trim() : "UNKNOWN";
    const reason = reasonLine ? reasonLine.replace("REASON:", "").trim() : "No reason provided";

    return {
      status: "success",
      isBaby: isBabyStr === "YES",
      verdict: isBabyStr,
      reason,
      commonName,
      scientificName,
      offspringName,
      originalTitle: suspect.originalTitle,
      sourceUrl: suspect.sourceUrl
    };
  } catch (err: any) {
    if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("quota")) {
      if (attempt <= 5) {
        const waitTime = attempt * 30000; // 30s, 60s, 90s...
        console.warn(`⚠️ Rate limited. Waiting ${waitTime / 1000}s before retry (attempt ${attempt}/5)...`);
        await new Promise(r => setTimeout(r, waitTime));
        return checkImage(suspect, attempt + 1);
      }
    }
    return { status: "error", reason: err.message };
  }
}

async function main() {
  const scratchDir = "/Users/annguyen19/.gemini/antigravity/brain/b74091bc-ff32-4525-86f6-d5a992b3a077/scratch";
  const suspectsPath = path.join(scratchDir, "suspects.json");
  const progressPath = path.join(scratchDir, "gemini_suspect_results.json");

  if (!fs.existsSync(suspectsPath)) {
    console.error("❌ suspects.json not found");
    process.exit(1);
  }

  const suspects: Suspect[] = JSON.parse(fs.readFileSync(suspectsPath, "utf8"));
  console.log(`Auditing ${suspects.length} suspect images...`);

  let results: any[] = [];
  // If the file exists, let's load it but filter out any entries that had errors
  if (fs.existsSync(progressPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(progressPath, "utf8"));
      results = existing.filter((r: any) => r.status === "success");
      console.log(`Loaded ${results.length} successfully verified records from progress.`);
    } catch (e) {
      results = [];
    }
  }

  const processedFiles = new Set(results.map(r => r.file));

  for (let i = 0; i < suspects.length; i++) {
    const suspect = suspects[i];
    if (processedFiles.has(suspect.file)) {
      console.log(`[${i + 1}/${suspects.length}] Skipping already processed file: ${suspect.animal} (${suspect.file})`);
      continue;
    }

    console.log(`[${i + 1}/${suspects.length}] Checking ${suspect.animal} (${suspect.file})...`);
    
    const result = await checkImage(suspect);
    console.log(`  Verdict: ${result.status === "success" ? result.verdict : "ERROR (" + result.reason + ")"}`);
    if (result.status === "success") {
      console.log(`  Reason: ${result.reason}`);
    }
    
    results.push({
      animal: suspect.animal,
      file: suspect.file,
      imageType: suspect.imageType,
      ...result
    });

    fs.writeFileSync(progressPath, JSON.stringify(results, null, 2), "utf8");

    // Sleep 13 seconds between requests to keep rate under 5 RPM
    await new Promise(r => setTimeout(r, 13000));
  }

  console.log(`\nFinished! Audit results written to ${progressPath}`);
}

main().catch(console.error);
