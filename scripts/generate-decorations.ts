#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import {
  buildDecorationPrompt,
  DECORATION_MODEL,
  DECORATION_PROMPT_VERSION,
} from "@/lib/decorations/prompt";
import type { DecorationManifest, DecorationManifestItem } from "@/lib/decorations/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MANIFEST_PATH = path.join(ROOT, "content/decorations/manifest.json");
const ORIGINAL_DIR = path.join(ROOT, "assets/decorations/original");
const PUBLIC_DIR = path.join(ROOT, "public/decorations");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

type CliOptions = {
  ids: string[];
  animal?: string;
  force: boolean;
  dryRun: boolean;
  list: boolean;
};

function printUsage() {
  console.log(`Usage: npm run generate-decorations -- [options]

Generate flat cartoon animal stickers via Gemini (gemini-2.5-flash-image).

Options:
  --id <id>         Generate one manifest item (repeatable)
  --animal <name>   Quick one-off: generate sticker-<slug>.png (not saved to manifest)
  --force           Regenerate even if status is approved
  --dry-run         Print prompts only, no API call
  --list            List manifest items and status
  -h, --help        Show this help

Setup:
  1. Copy .env.example to .env.local
  2. Set GEMINI_API_KEY from https://aistudio.google.com/apikey
  3. Run: npm run generate-decorations

Output:
  assets/decorations/original/<id>.png   (archive)
  public/decorations/<id>.png            (served by Next.js)
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    ids: [],
    force: false,
    dryRun: false,
    list: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--force") {
      options.force = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--list") {
      options.list = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--id") {
      const value = argv[i + 1];
      if (!value) throw new Error("--id requires a value");
      options.ids.push(value);
      i += 1;
      continue;
    }
    if (arg === "--animal") {
      const value = argv[i + 1];
      if (!value) throw new Error("--animal requires a value");
      options.animal = value;
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readManifest(): DecorationManifest {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  return JSON.parse(raw) as DecorationManifest;
}

function writeManifest(manifest: DecorationManifest) {
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function ensureDirs() {
  fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function shouldSkip(item: DecorationManifestItem, force: boolean): boolean {
  if (force) return false;
  return item.status === "approved";
}

function selectItems(manifest: DecorationManifest, options: CliOptions): DecorationManifestItem[] {
  if (options.ids.length === 0) {
    return manifest.items.filter((item) => item.status !== "approved" || options.force);
  }

  const selected = options.ids.map((id) => {
    const item = manifest.items.find((entry) => entry.id === id);
    if (!item) {
      throw new Error(`Manifest item not found: ${id}`);
    }
    return item;
  });

  return selected.filter((item) => !shouldSkip(item, options.force));
}

function extractImagePart(response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>) {
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        data: part.inlineData.data,
        mimeType: part.inlineData.mimeType ?? "image/png",
      };
    }
  }

  const textParts = parts
    .map((part) => part.text)
    .filter((value): value is string => Boolean(value));

  if (textParts.length > 0) {
    throw new Error(`Model returned text instead of an image:\n${textParts.join("\n")}`);
  }

  throw new Error("No image data in API response");
}

function extensionForMime(mimeType: string): string {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  return "png";
}

async function generateSticker(
  ai: GoogleGenAI,
  item: DecorationManifestItem,
  options: CliOptions,
) {
  const prompt = buildDecorationPrompt(item.animal);

  if (options.dryRun) {
    console.log(`\n--- ${item.id} (${item.animal}) ---\n`);
    console.log(prompt);
    return null;
  }

  console.log(`Generating ${item.id} (${item.animal})…`);

  const response = await ai.models.generateContent({
    model: DECORATION_MODEL,
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  const image = extractImagePart(response);
  const ext = extensionForMime(image.mimeType);
  const fileName = `${item.id}.${ext}`;
  const originalPath = path.join(ORIGINAL_DIR, fileName);
  const publicPath = path.join(PUBLIC_DIR, fileName);
  const buffer = Buffer.from(image.data, "base64");

  fs.writeFileSync(originalPath, buffer);
  fs.writeFileSync(publicPath, buffer);

  return {
    src: `/decorations/${fileName}`,
    generatedAt: new Date().toISOString(),
    ext,
  };
}

async function generateOneOff(ai: GoogleGenAI, animal: string, options: CliOptions) {
  const id = `sticker-${slugify(animal)}`;
  const item: DecorationManifestItem = {
    id,
    animal,
    status: "pending",
    placement: [],
    src: null,
    generatedAt: null,
  };

  const result = await generateSticker(ai, item, options);
  if (!result) return;

  console.log(`\n✓ Saved ${id}.${result.ext}`);
  console.log(`  public/decorations/${id}.${result.ext}`);
  console.log(`  assets/decorations/original/${id}.${result.ext}`);
  console.log("\nAdd this item to content/decorations/manifest.json if you want to use it on the site.");
}

async function main() {
  loadEnvLocal();
  const options = parseArgs(process.argv.slice(2));

  if (options.list) {
    const manifest = readManifest();
    console.log(`Model: ${manifest.model} | Prompt v${manifest.promptVersion}\n`);
    for (const item of manifest.items) {
      console.log(`${item.status.padEnd(10)} ${item.id.padEnd(28)} ${item.animal}`);
    }
    return;
  }

  ensureDirs();

  if (options.dryRun && !options.animal && options.ids.length === 0) {
    const manifest = readManifest();
    options.ids.push(...manifest.items.map((item) => item.id));
  }

  if (options.animal) {
    if (!process.env.GEMINI_API_KEY && !options.dryRun) {
      throw new Error("Missing GEMINI_API_KEY. Copy .env.example to .env.local and add your key.");
    }

    const ai = new GoogleGenAI({});
    await generateOneOff(ai, options.animal, options);
    return;
  }

  const manifest = readManifest();
  const items = selectItems(manifest, options);

  if (items.length === 0) {
    console.log("Nothing to generate. Use --list to inspect manifest or --force to regenerate.");
    return;
  }

  if (options.dryRun) {
    for (const item of items) {
      await generateSticker({} as GoogleGenAI, item, options);
    }
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Copy .env.example to .env.local and add your key.");
  }

  const ai = new GoogleGenAI({});
  let generated = 0;

  for (const item of items) {
    try {
      const result = await generateSticker(ai, item, options);
      if (!result) continue;

      const index = manifest.items.findIndex((entry) => entry.id === item.id);
      if (index === -1) continue;

      manifest.items[index] = {
        ...manifest.items[index],
        src: result.src,
        generatedAt: result.generatedAt,
        status: "generated",
        promptVersion: DECORATION_PROMPT_VERSION,
        model: DECORATION_MODEL,
        width: 1024,
        height: 1024,
      };

      generated += 1;
      console.log(`  → ${result.src}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ ${item.id}: ${message}`);
    }

    // Gentle pacing for free-tier rate limits
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (generated > 0) {
    manifest.model = DECORATION_MODEL;
    manifest.promptVersion = DECORATION_PROMPT_VERSION;
    writeManifest(manifest);
  }

  console.log(`\nDone. Generated ${generated}/${items.length}.`);
  console.log("Review images in public/decorations/, then set status to \"approved\" in manifest.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
