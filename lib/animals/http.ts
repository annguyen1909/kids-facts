import { siteConfig } from "@/lib/site-config";

const USER_AGENT = `WildlifeDBImporter/1.0 (${siteConfig.url}; importer@wildlifedb.local)`;
const MIN_REQUEST_INTERVAL_MS = 350;
const MAX_RETRIES = 3;

let lastRequestAt = 0;
const inFlight = new Map<string, Promise<unknown>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForSlot(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await sleep(MIN_REQUEST_INTERVAL_MS - elapsed);
  }
  lastRequestAt = Date.now();
}

function shouldRetry(status: number): boolean {
  return status === 429 || status === 503 || status >= 500;
}

export async function fetchJsonOptional<T>(
  url: string,
  init: RequestInit = {},
  dedupeKey?: string,
): Promise<T | null> {
  try {
    return await fetchJson<T>(url, init, dedupeKey);
  } catch (error) {
    if (error instanceof Error && error.message.includes("(404)")) {
      return null;
    }
    throw error;
  }
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit = {},
  dedupeKey?: string,
): Promise<T> {
  const key = dedupeKey ?? url;
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const request = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      await waitForSlot();

      try {
        const response = await fetch(url, {
          ...init,
          headers: {
            Accept: "application/json",
            "User-Agent": USER_AGENT,
            ...(init.headers ?? {}),
          },
        });

        if (!response.ok) {
          if (shouldRetry(response.status) && attempt < MAX_RETRIES - 1) {
            await sleep(500 * (attempt + 1));
            continue;
          }

          throw new Error(`Request failed (${response.status}) for ${url}`);
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < MAX_RETRIES - 1) {
          await sleep(500 * (attempt + 1));
        }
      }
    }

    throw lastError ?? new Error(`Request failed for ${url}`);
  })();

  inFlight.set(key, request);

  try {
    return await request;
  } finally {
    inFlight.delete(key);
  }
}
