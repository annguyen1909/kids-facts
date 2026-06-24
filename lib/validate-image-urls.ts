import type { ValidationIssue } from "@/lib/content-validation";
import type { AnimalRecord } from "@/lib/types";

const USER_AGENT = "kids-facts-content-validator/1.0";
const REQUEST_TIMEOUT_MS = 10_000;
const WIKIMEDIA_BATCH_SIZE = 40;
const EXTERNAL_CONCURRENCY = 6;

type ImageRef = {
  scope: string;
  src: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isWikimediaUploadUrl(src: string) {
  return /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons(?:\/thumb)?\//.test(src);
}

function commonsFileTitleFromUploadPath(fileSegment: string): string {
  return decodeURIComponent(fileSegment).replace(/_/g, " ");
}

function fileTitleFromWikimediaUploadUrl(src: string): string | null {
  try {
    const { pathname } = new URL(src);
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] !== "wikipedia" || segments[1] !== "commons") return null;

    if (segments[2] === "thumb") {
      return commonsFileTitleFromUploadPath(segments[5] ?? "");
    }

    return commonsFileTitleFromUploadPath(segments[segments.length - 1] ?? "");
  } catch {
    return null;
  }
}

async function fetchWikimediaFileStatuses(titles: string[]): Promise<Map<string, boolean>> {
  const statuses = new Map<string, boolean>();
  if (titles.length === 0) return statuses;

  for (let index = 0; index < titles.length; index += WIKIMEDIA_BATCH_SIZE) {
    const batch = titles.slice(index, index + WIKIMEDIA_BATCH_SIZE);
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");
    url.searchParams.set("origin", "*");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url");
    url.searchParams.set("titles", batch.map((title) => `File:${title}`).join("|"));

    let payload: { query?: { pages?: Array<{ title?: string; missing?: boolean; imageinfo?: unknown[] }> } };

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          headers: { "user-agent": USER_AGENT },
          signal: controller.signal,
        });

        if (response.status === 429) {
          await sleep(1000 * (attempt + 1));
          continue;
        }

        if (!response.ok) {
          throw new Error(`Wikimedia API returned HTTP ${response.status}`);
        }

        payload = await response.json();
        break;
      } finally {
        clearTimeout(timeout);
      }
    }

    if (!payload!) {
      for (const title of batch) {
        statuses.set(title, false);
      }
      continue;
    }

    for (const page of payload.query?.pages ?? []) {
      const title = page.title?.replace(/^File:/, "") ?? "";
      statuses.set(title, !page.missing && Boolean(page.imageinfo?.length));
    }

    for (const title of batch) {
      if (!statuses.has(title)) statuses.set(title, false);
    }

    if (index + WIKIMEDIA_BATCH_SIZE < titles.length) {
      await sleep(300);
    }
  }

  return statuses;
}

async function probeExternalUrl(src: string): Promise<number | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(src, {
      method: "HEAD",
      headers: { "user-agent": USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status !== 405 && response.status !== 501) {
      return response.status;
    }
  } catch {
    // Fall through to ranged GET.
  } finally {
    clearTimeout(timeout);
  }

  const getController = new AbortController();
  const getTimeout = setTimeout(() => getController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(src, {
      method: "GET",
      headers: {
        "user-agent": USER_AGENT,
        range: "bytes=0-0",
      },
      redirect: "follow",
      signal: getController.signal,
    });

    return response.status;
  } catch {
    return null;
  } finally {
    clearTimeout(getTimeout);
  }
}

function isOkStatus(status: number) {
  return status >= 200 && status < 300;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

export function collectAnimalImageRefs(animals: AnimalRecord[]): ImageRef[] {
  const refs: ImageRef[] = [];

  for (const animal of animals) {
    const scopePrefix = `animals/${animal.core.slug}`;

    for (const image of animal.images) {
      refs.push({
        scope: `${scopePrefix}/images/${image.slug}`,
        src: image.src,
      });
    }
  }

  return refs;
}

export async function validateImageSrcUrls(refs: ImageRef[]): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  const refsBySrc = new Map<string, ImageRef[]>();

  for (const ref of refs) {
    const bucket = refsBySrc.get(ref.src) ?? [];
    bucket.push(ref);
    refsBySrc.set(ref.src, bucket);
  }

  const wikimediaRefs: Array<{ src: string; title: string }> = [];
  const externalSrcs: string[] = [];

  for (const src of refsBySrc.keys()) {
    if (!isWikimediaUploadUrl(src)) {
      externalSrcs.push(src);
      continue;
    }

    const title = fileTitleFromWikimediaUploadUrl(src);
    if (!title) {
      externalSrcs.push(src);
      continue;
    }

    wikimediaRefs.push({ src, title });
  }

  const wikimediaTitles = [...new Set(wikimediaRefs.map((entry) => entry.title))];
  const wikimediaStatuses = await fetchWikimediaFileStatuses(wikimediaTitles);

  for (const { src, title } of wikimediaRefs) {
    if (wikimediaStatuses.get(title)) continue;

    for (const ref of refsBySrc.get(src) ?? []) {
      issues.push({
        severity: "error",
        scope: ref.scope,
        message: `Wikimedia file is missing or unavailable (File:${title})`,
      });
    }
  }

  const externalStatuses = await mapWithConcurrency(externalSrcs, EXTERNAL_CONCURRENCY, async (src) => ({
    src,
    status: await probeExternalUrl(src),
  }));

  for (const { src, status } of externalStatuses) {
    if (status !== null && isOkStatus(status)) continue;

    const message =
      status === null
        ? `image src is unreachable (${src})`
        : `image src returned HTTP ${status} (${src})`;

    for (const ref of refsBySrc.get(src) ?? []) {
      issues.push({
        severity: "error",
        scope: ref.scope,
        message,
      });
    }
  }

  return issues.sort((a, b) => a.scope.localeCompare(b.scope));
}

export async function validateAnimalImageUrls(animals: AnimalRecord[]): Promise<ValidationIssue[]> {
  return validateImageSrcUrls(collectAnimalImageRefs(animals));
}
