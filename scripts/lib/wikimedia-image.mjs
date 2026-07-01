const COMMONS_FILE_PREFIX = "https://commons.wikimedia.org/wiki/File:";

export function isWikimediaUploadUrl(src) {
  return /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons(?:\/thumb)?\//.test(src);
}

export function isWikimediaCommonsPageUrl(url) {
  return /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/i.test(url);
}

export function extractTitleFromCommonsUrl(url) {
  if (!url || !isWikimediaCommonsPageUrl(url)) return null;
  try {
    const { pathname } = new URL(url);
    const encoded = pathname.replace(/^\/wiki\/File:/i, "");
    if (!encoded) return null;
    return decodeURIComponent(encoded).replace(/_/g, " ");
  } catch {
    return null;
  }
}

export function buildCommonsFilePageUrl(title) {
  return `${COMMONS_FILE_PREFIX}${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

function commonsFileTitleFromUploadPath(fileSegment) {
  return decodeURIComponent(fileSegment).replace(/_/g, " ");
}

export function fileTitleFromWikimediaUploadUrl(src) {
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

export function resolveCommonsFileTitle({ sourceUrl, src }) {
  return extractTitleFromCommonsUrl(sourceUrl) ?? (src ? fileTitleFromWikimediaUploadUrl(src) : null);
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const LICENSE_URL_BY_NAME = {
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 2.5": "https://creativecommons.org/licenses/by-sa/2.5/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 2.5": "https://creativecommons.org/licenses/by/2.5/",
  "CC BY 1.0": "https://creativecommons.org/licenses/by/1.0/",
  "CC BY": "https://creativecommons.org/licenses/by/4.0/",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "Public domain": "https://creativecommons.org/publicdomain/mark/1.0/",
};

function licenseUrlFromName(licenseName) {
  const normalized = licenseName.trim();
  const exact = LICENSE_URL_BY_NAME[normalized];
  if (exact) return exact;

  const version = normalized.match(/(\d+(?:\.\d+)?)/)?.[1];

  if (/cc\s*by-sa/i.test(normalized)) {
    return version
      ? `https://creativecommons.org/licenses/by-sa/${version}/`
      : LICENSE_URL_BY_NAME["CC BY-SA"];
  }

  if (/cc\s*by\b/i.test(normalized)) {
    return version
      ? `https://creativecommons.org/licenses/by/${version}/`
      : LICENSE_URL_BY_NAME["CC BY"];
  }

  if (/cc0|public\s*domain/i.test(normalized)) {
    return /cc0/i.test(normalized)
      ? LICENSE_URL_BY_NAME.CC0
      : LICENSE_URL_BY_NAME["Public domain"];
  }

  return LICENSE_URL_BY_NAME["CC BY-SA"];
}

function isCanonicalLicenseUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "creativecommons.org" ||
        parsed.hostname === "www.creativecommons.org" ||
        parsed.hostname === "en.wikipedia.org")
    );
  } catch {
    return false;
  }
}

export function normalizeLicenseUrl(licenseUrl, licenseName) {
  let url = stripHtml(licenseUrl ?? "").trim();
  if (url.startsWith("//")) url = `https:${url}`;

  const pointsAtCommonsFile =
    /commons\.wikimedia\.org\/wiki\/File:/i.test(url) ||
    /upload\.wikimedia\.org/i.test(url);

  if (!url || pointsAtCommonsFile || !isCanonicalLicenseUrl(url)) {
    return licenseUrlFromName(licenseName);
  }

  return url;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCommonsFiles(titles, userAgent = "wildlifedb-wikimedia/1.0") {
  const files = new Map();
  if (titles.length === 0) return files;

  const batchSize = 40;
  for (let index = 0; index < titles.length; index += batchSize) {
    const batch = titles.slice(index, index + batchSize);
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");
    url.searchParams.set("origin", "*");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url|size|extmetadata");
    url.searchParams.set("titles", batch.map((title) => `File:${title}`).join("|"));

    let payload;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await fetch(url, { headers: { "user-agent": userAgent } });
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : 2 * (attempt + 1);
        await sleep(waitSeconds * 1000 + 500);
        continue;
      }
      if (!response.ok) throw new Error(`Wikimedia API returned HTTP ${response.status}`);
      payload = await response.json();
      break;
    }

    for (const page of payload?.query?.pages ?? []) {
      const image = page?.imageinfo?.[0];
      if (!page?.title || page.missing || !image?.url) continue;
      const title = page.title.replace(/^File:/, "");
      const meta = image.extmetadata ?? {};
      const creatorName = stripHtml(meta.Artist?.value || meta.Credit?.value || "Unknown creator");
      const licenseName = stripHtml(meta.LicenseShortName?.value || "License not listed");
      const sourceUrl = image.descriptionurl || buildCommonsFilePageUrl(title);
      const rawLicenseUrl = stripHtml(meta.LicenseUrl?.value || sourceUrl);
      files.set(title, {
        title,
        src: image.url,
        width: image.width,
        height: image.height,
        sourceUrl,
        creatorName,
        licenseName,
        licenseUrl: normalizeLicenseUrl(rawLicenseUrl, licenseName),
      });
    }

    if (index + batchSize < titles.length) await sleep(1000);
  }

  return files;
}

export function buildSyncedImageRecord(existing, commons, timestamp, acquisitionNotes) {
  const licenseUrl = normalizeLicenseUrl(commons.licenseUrl, commons.licenseName);
  const requiresAttribution = !["CC0", "Public domain"].includes(commons.licenseName);
  return {
    ...existing,
    fileName: commons.title,
    src: commons.src,
    width: commons.width,
    height: commons.height,
    attributionText: `Photo by ${commons.creatorName} via Wikimedia Commons, ${commons.licenseName}`,
    attributionHtml: `Photo by <a href="${commons.sourceUrl}">${commons.creatorName}</a> via <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, <a href="${licenseUrl}">${commons.licenseName}</a>`,
    source: {
      sourceName: "Wikimedia Commons",
      sourceUrl: commons.sourceUrl,
      creatorName: commons.creatorName,
      licenseName: commons.licenseName,
      licenseUrl,
      requiresAttribution,
      downloadedAt: timestamp,
      reviewedBy: "editor@wildlifedb.local",
    },
    acquisitionNotes: acquisitionNotes ?? existing.acquisitionNotes,
    updatedAt: timestamp,
  };
}
