import { cachedFetch } from "@/lib/animals/cache";
import { fetchJson } from "@/lib/animals/http";
import type { WikimediaImageCandidate } from "@/lib/animals/types";
import { normalizeLicenseUrl } from "@/lib/wikimedia-image";

const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";

type WikimediaPage = {
  title?: string;
  imageinfo?: Array<{
    url?: string;
    thumburl?: string;
    width?: number;
    height?: number;
    mime?: string;
    extmetadata?: Record<string, { value?: string }>;
    descriptionurl?: string;
  }>;
};

type WikimediaQueryResponse = {
  query?: {
    pages?: Record<string, WikimediaPage>;
  };
};

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseCandidate(page: WikimediaPage): WikimediaImageCandidate | null {
  const info = page.imageinfo?.[0];
  if (!info?.url || !info.width || !info.height) return null;

  const metadata = info.extmetadata ?? {};
  const mime = info.mime ?? "";
  if (mime.includes("svg") || mime.includes("gif")) return null;

  const title = page.title ?? "File";
  const lowerTitle = title.toLowerCase();
  const blockedTerms = [
    "map",
    "range",
    "skull",
    "skeleton",
    "diagram",
    "icon",
    "logo",
    "stamp",
    "chart",
    "illustration",
    "drawing",
    "clipart",
  ];

  if (blockedTerms.some((term) => lowerTitle.includes(term))) return null;

  const artist = stripHtml(metadata.Artist?.value ?? metadata.Credit?.value ?? "Unknown");
  const licenseName = stripHtml(metadata.LicenseShortName?.value ?? "See source");
  const licenseUrl = normalizeLicenseUrl(metadata.LicenseUrl?.value, licenseName);
  const description = stripHtml(metadata.ImageDescription?.value ?? title.replace(/^File:/, ""));

  return {
    title,
    pageUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    imageUrl: info.url,
    thumbnailUrl: info.thumburl ?? info.url,
    width: info.width,
    height: info.height,
    mime,
    description,
    artist,
    licenseName,
    licenseUrl,
    credit: stripHtml(metadata.Credit?.value ?? ""),
  };
}

async function searchWikimedia(query: string, limit = 12): Promise<WikimediaImageCandidate[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
    iiurlwidth: "1600",
  });

  const cacheKey = `wikimedia:search:${query.toLowerCase()}:${limit}`;
  const response = await cachedFetch(cacheKey, async () => {
    const url = `${WIKIMEDIA_API}?${params.toString()}`;
    return fetchJson<WikimediaQueryResponse>(url, {}, cacheKey);
  });

  const pages = response.query?.pages ?? {};
  return Object.values(pages)
    .map((page) => parseCandidate(page))
    .filter((candidate): candidate is WikimediaImageCandidate => Boolean(candidate));
}

export async function searchWikimediaRaw(query: string, limit = 12): Promise<WikimediaImageCandidate[]> {
  return searchWikimedia(query, limit);
}

export async function searchWikimediaByScientificName(
  scientificName: string,
): Promise<WikimediaImageCandidate[]> {
  const scientificResults = await searchWikimedia(`${scientificName} animal`, 12);
  if (scientificResults.length > 0) return scientificResults;
  return searchWikimedia(scientificName, 12);
}

export async function searchWikimediaByCommonName(
  commonName: string,
): Promise<WikimediaImageCandidate[]> {
  return searchWikimedia(`${commonName} animal`, 12);
}

export async function searchWikimediaImages(input: {
  scientificName: string;
  commonName?: string;
}): Promise<WikimediaImageCandidate[]> {
  const scientificResults = await searchWikimediaByScientificName(input.scientificName);
  if (scientificResults.length > 0) return scientificResults;

  if (input.commonName) {
    return searchWikimediaByCommonName(input.commonName);
  }

  return [];
}
