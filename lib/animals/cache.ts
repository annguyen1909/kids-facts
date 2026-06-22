import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "animals");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheEnvelope<T> = {
  cachedAt: string;
  value: T;
};

function cacheFilePath(key: string): string {
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return path.join(CACHE_DIR, `${hash}.json`);
}

function isFresh(cachedAt: string): boolean {
  const age = Date.now() - new Date(cachedAt).getTime();
  return age >= 0 && age < CACHE_TTL_MS;
}

export function readCache<T>(key: string): T | null {
  const filePath = cacheFilePath(key);
  if (!fs.existsSync(filePath)) return null;

  try {
    const envelope = JSON.parse(fs.readFileSync(filePath, "utf8")) as CacheEnvelope<T>;
    if (!isFresh(envelope.cachedAt)) return null;
    return envelope.value;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const envelope: CacheEnvelope<T> = {
    cachedAt: new Date().toISOString(),
    value,
  };
  fs.writeFileSync(cacheFilePath(key), `${JSON.stringify(envelope, null, 2)}\n`, "utf8");
}

export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = readCache<T>(key);
  if (cached !== null) return cached;

  const value = await fetcher();
  writeCache(key, value);
  return value;
}

export function clearAnimalCache(): void {
  if (fs.existsSync(CACHE_DIR)) {
    fs.rmSync(CACHE_DIR, { recursive: true, force: true });
  }
}
