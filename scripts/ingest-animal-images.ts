import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { fetchCommonsFiles, resolveCommonsFileTitle } from "@/lib/wikimedia-image";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "animals");
const PUBLIC_IMAGES = path.join(ROOT, "public", "images", "animals");

const WEBP_QUALITY = 78;
const USER_AGENT = "WildlifeDB/1.0 (image-ingest; contact@wildlifedb.local)";

const DERIVATIVE_SIZES = [
  { key: "web1200" as const, width: 1200, dir: "web" },
  { key: "thumbnail400" as const, width: 400, dir: "thumbnails" },
];

type CliOptions = {
  animal?: string;
  dryRun: boolean;
  force: boolean;
  concurrency: number;
};

type ImageJson = {
  id: string;
  animalSlug: string;
  slug: string;
  fileName: string;
  src: string;
  srcSet?: Partial<Record<(typeof DERIVATIVE_SIZES)[number]["key"] | "original", string>>;
  width: number;
  height: number;
  source?: { downloadedAt?: string; [key: string]: unknown };
  acquisitionNotes?: string;
  updatedAt: string;
  [key: string]: unknown;
};

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const animalIdx = args.indexOf("--animal");
  return {
    animal: animalIdx >= 0 ? args[animalIdx + 1] : undefined,
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
    concurrency: args.includes("--fast") ? 4 : 2,
  };
}

function isRemoteUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function resolveDownloadUrl(src: string): string {
  if (src.includes("upload.wikimedia.org/wikipedia/commons/thumb/")) {
    try {
      const url = new URL(src);
      const parts = url.pathname.split("/").filter(Boolean);
      const commonsIndex = parts.indexOf("commons");
      if (commonsIndex >= 0 && parts[commonsIndex + 1] === "thumb") {
        const hashPath = parts.slice(commonsIndex + 2, -2);
        const fileName = parts[parts.length - 2]!;
        return `https://upload.wikimedia.org/wikipedia/commons/${hashPath.join("/")}/${fileName}`;
      }
    } catch {
      // fall through
    }
  }

  return src;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadBuffer(url: string, attempt = 1): Promise<Buffer> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if ((response.status === 429 || response.status === 503) && attempt <= 5) {
    const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "5", 10);
    console.warn(`Rate limited (${response.status}), waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return downloadBuffer(url, attempt + 1);
  }

  if (!response.ok) {
    if (attempt <= 3) {
      await sleep(2000 * attempt);
      return downloadBuffer(url, attempt + 1);
    }
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function listImageJsonFiles(animalFilter?: string): Promise<string[]> {
  const animals = await fs.readdir(CONTENT_DIR);
  const files: string[] = [];

  for (const animal of animals) {
    if (animalFilter && animal !== animalFilter) continue;
    const imagesDir = path.join(CONTENT_DIR, animal, "images");
    try {
      const entries = await fs.readdir(imagesDir);
      for (const entry of entries) {
        if (entry.endsWith(".json")) {
          files.push(path.join(imagesDir, entry));
        }
      }
    } catch {
      // no images dir
    }
  }

  return files.sort();
}

async function localFileExists(publicPath: string): Promise<boolean> {
  if (!publicPath.startsWith("/images/")) return false;
  try {
    await fs.access(path.join(ROOT, "public", publicPath));
    return true;
  } catch {
    return false;
  }
}

async function shouldSkip(data: ImageJson, force: boolean): Promise<boolean> {
  if (force) return false;
  if (!data.src.startsWith("/images/")) return false;
  const web1200 = data.srcSet?.web1200;
  if (web1200 && (await localFileExists(web1200))) return true;
  return !(await localFileExists(data.src));
}

async function resolveRemoteSrc(data: ImageJson, force: boolean): Promise<string | null> {
  if (isRemoteUrl(data.src)) return data.src;
  if (!force) return null;

  const title = resolveCommonsFileTitle({
    sourceUrl: typeof data.source?.sourceUrl === "string" ? data.source.sourceUrl : undefined,
    src: data.src,
  });
  if (!title) return null;

  const commonsFiles = await fetchCommonsFiles([title]);
  return commonsFiles.get(title)?.src ?? null;
}

async function ingestOne(jsonPath: string, options: CliOptions): Promise<"ok" | "skip" | "fail"> {
  const raw = await fs.readFile(jsonPath, "utf8");
  const data = JSON.parse(raw) as ImageJson;

  if (await shouldSkip(data, options.force)) {
    return "skip";
  }

  const remoteSrc = await resolveRemoteSrc(data, options.force);
  if (!remoteSrc) {
    console.warn(`Skip ${jsonPath}: no remote src to download`);
    return "skip";
  }

  const baseName = `${data.slug}-01`;
  const animalSlug = data.animalSlug;
  const publicBase = `/images/animals/${animalSlug}`;

  if (options.dryRun) {
    console.log(`[dry-run] ${data.slug} ← ${resolveDownloadUrl(remoteSrc)}`);
    return "ok";
  }

  const downloadUrl = resolveDownloadUrl(remoteSrc);
  const buffer = await downloadBuffer(downloadUrl);
  await sleep(250);
  const resized = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await resized.metadata();

  for (const dir of ["web", "thumbnails"] as const) {
    await fs.mkdir(path.join(PUBLIC_IMAGES, animalSlug, dir), { recursive: true });
  }

  const srcSet: ImageJson["srcSet"] = {};

  for (const { key, width, dir } of DERIVATIVE_SIZES) {
    const fileName = `${baseName}-${width}.webp`;
    const outPath = path.join(PUBLIC_IMAGES, animalSlug, dir, fileName);
    const outUrl = `${publicBase}/${dir}/${fileName}`;

    await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(outPath);

    srcSet[key] = outUrl;
  }

  const web1200Path = srcSet.web1200!;
  const web1200Meta = await sharp(path.join(ROOT, "public", web1200Path)).metadata();
  const timestamp = new Date().toISOString();

  const updated: ImageJson = {
    ...data,
    fileName: `${baseName}-1200.webp`,
    src: web1200Path,
    srcSet: {
      ...srcSet,
      original: srcSet.web1200,
    },
    width: web1200Meta.width ?? metadata.width ?? data.width,
    height: web1200Meta.height ?? metadata.height ?? data.height,
    updatedAt: timestamp,
    source: data.source
      ? { ...data.source, downloadedAt: timestamp }
      : data.source,
    acquisitionNotes: [
      data.acquisitionNotes,
      `Local WebP ingested from ${remoteSrc}`,
    ]
      .filter(Boolean)
      .join(" "),
  };

  await fs.writeFile(jsonPath, `${JSON.stringify(updated, null, 2)}\n`);
  return "ok";
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  let index = 0;

  async function runWorker() {
    while (index < items.length) {
      const current = index++;
      await worker(items[current]!);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()));
}

async function main() {
  const options = parseArgs();
  const files = await listImageJsonFiles(options.animal);

  console.log(
    `Ingesting ${files.length} image JSON files` +
      (options.animal ? ` for ${options.animal}` : "") +
      (options.dryRun ? " (dry-run)" : "") +
      (options.force ? " (force)" : ""),
  );

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  await runPool(files, options.concurrency, async (jsonPath) => {
    const label = path.relative(CONTENT_DIR, jsonPath);
    try {
      const result = await ingestOne(jsonPath, options);
      if (result === "ok") {
        ok++;
        if (!options.dryRun) console.log(`✓ ${label}`);
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;
      console.error(`✗ ${label}:`, error instanceof Error ? error.message : error);
    }
  });

  console.log(`\nDone: ${ok} ingested, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
