import type { WikimediaImageCandidate } from "@/lib/animals/types";
import { cachedFetch } from "@/lib/animals/cache";
import { fetchJsonOptional } from "@/lib/animals/http";
import { cleanScientificName } from "@/lib/animals/normalizer";

type WikipediaSummary = {
  title?: string;
  description?: string;
  extract?: string;
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
  thumbnail?: {
    source?: string;
    width?: number;
    height?: number;
  };
  originalimage?: {
    source?: string;
    width?: number;
    height?: number;
  };
};

function titleFromScientificName(scientificName: string): string {
  return cleanScientificName(scientificName).replace(/\s+/g, "_");
}

export async function getWikipediaSummary(
  scientificName: string,
): Promise<{ title?: string; summary?: string; description?: string; pageUrl?: string } | null> {
  const title = titleFromScientificName(scientificName);
  const cacheKey = `wikipedia:summary:${title.toLowerCase()}`;

  return cachedFetch(cacheKey, async () => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await fetchJsonOptional<WikipediaSummary>(url, {}, cacheKey);
    if (!response) return null;

    return {
      title: response.title,
      summary: response.extract,
      description: response.description,
      pageUrl: response.content_urls?.desktop?.page,
    };
  });
}

export async function searchWikipediaImages(
  scientificName: string,
): Promise<WikimediaImageCandidate[]> {
  const title = titleFromScientificName(scientificName);
  const cacheKey = `wikipedia:image:${title.toLowerCase()}`;

  const summary = await cachedFetch(cacheKey, async () => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    return fetchJsonOptional<WikipediaSummary>(url, {}, cacheKey);
  });

  if (!summary) return [];

  const imageUrl = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (!imageUrl) return [];

  const width = summary.originalimage?.width ?? summary.thumbnail?.width ?? 1200;
  const height = summary.originalimage?.height ?? summary.thumbnail?.height ?? 800;

  return [
    {
      title: summary.title ?? scientificName,
      pageUrl: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
      imageUrl,
      thumbnailUrl: summary.thumbnail?.source ?? imageUrl,
      width,
      height,
      mime: "image/jpeg",
      description: summary.description ?? `${scientificName} photo`,
      artist: "Wikipedia",
      licenseName: "See Wikipedia",
      licenseUrl: summary.content_urls?.desktop?.page ?? "https://en.wikipedia.org/",
      credit: summary.description ?? "",
    },
  ];
}
