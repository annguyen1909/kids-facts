import type { ValidationIssue } from "@/lib/content-validation";
import type { AnimalRecord } from "@/lib/types";
import {
  fetchCommonsFiles,
  isWikimediaUploadUrl,
  resolveCommonsFileTitle,
} from "@/lib/wikimedia-image";

const USER_AGENT = "wildlifedb-content-validator/1.0";
const REQUEST_TIMEOUT_MS = 10_000;
const EXTERNAL_CONCURRENCY = 6;

export type ImageRef = {
  scope: string;
  src: string;
  commonsFileTitle: string | null;
};

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
        commonsFileTitle: resolveCommonsFileTitle({
          sourceUrl: image.source?.sourceUrl,
          src: image.src,
        }),
      });
    }
  }

  return refs;
}

export async function validateImageSrcUrls(refs: ImageRef[]): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  const refsByCommonsTitle = new Map<string, ImageRef[]>();
  const externalRefs: ImageRef[] = [];

  for (const ref of refs) {
    if (ref.commonsFileTitle) {
      const bucket = refsByCommonsTitle.get(ref.commonsFileTitle) ?? [];
      bucket.push(ref);
      refsByCommonsTitle.set(ref.commonsFileTitle, bucket);
      continue;
    }

    if (!isWikimediaUploadUrl(ref.src)) {
      externalRefs.push(ref);
      continue;
    }

    issues.push({
      severity: "error",
      scope: ref.scope,
      message: `Wikimedia image is missing a resolvable Commons file title (${ref.src})`,
    });
  }

  const commonsTitles = [...refsByCommonsTitle.keys()];
  const commonsFiles = await fetchCommonsFiles(commonsTitles, USER_AGENT);

  for (const title of commonsTitles) {
    if (commonsFiles.has(title)) continue;

    for (const ref of refsByCommonsTitle.get(title) ?? []) {
      issues.push({
        severity: "error",
        scope: ref.scope,
        message: `Wikimedia file is missing or unavailable (File:${title})`,
      });
    }
  }

  const externalSrcs = [...new Set(externalRefs.map((ref) => ref.src))];
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

    for (const ref of externalRefs.filter((entry) => entry.src === src)) {
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
