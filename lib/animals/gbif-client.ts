import { cachedFetch } from "@/lib/animals/cache";
import { fetchJson } from "@/lib/animals/http";
import type { GbifSpeciesMatch, GbifVernacularName } from "@/lib/animals/types";

const GBIF_BASE = "https://api.gbif.org/v1";

type GbifSearchResponse = {
  results?: GbifSpeciesMatch[];
};

type GbifOccurrenceFacets = {
  facets?: Array<{
    field?: string;
    counts?: Array<{ name: string; count: number }>;
  }>;
};

function encodeQuery(value: string): string {
  return encodeURIComponent(value.trim());
}

export async function matchGbifSpecies(name: string): Promise<GbifSpeciesMatch | null> {
  const cacheKey = `gbif:match:${name.toLowerCase()}`;

  return cachedFetch(cacheKey, async () => {
    const url =
      `${GBIF_BASE}/species/match?` +
      `name=${encodeQuery(name)}&kingdom=Animalia&verbose=true`;

    const result = await fetchJson<GbifSpeciesMatch>(url, {}, cacheKey);
    if (!result.usageKey || result.matchType === "NONE") return null;
    return result;
  });
}

export async function searchGbifSpecies(name: string, limit = 5): Promise<GbifSpeciesMatch[]> {
  const cacheKey = `gbif:search:${name.toLowerCase()}:${limit}`;

  return cachedFetch(cacheKey, async () => {
    const url =
      `${GBIF_BASE}/species/search?` +
      `q=${encodeQuery(name)}&rank=SPECIES&status=ACCEPTED&limit=${limit}`;

    const response = await fetchJson<GbifSearchResponse>(url, {}, cacheKey);
    return response.results ?? [];
  });
}

export async function getGbifVernacularNames(key: number): Promise<GbifVernacularName[]> {
  const cacheKey = `gbif:vernacular:${key}`;

  return cachedFetch(cacheKey, async () => {
    const url = `${GBIF_BASE}/species/${key}/vernacularNames?language=en&limit=20`;
    const response = await fetchJson<{ results?: GbifVernacularName[] }>(url, {}, cacheKey);
    return response.results ?? [];
  });
}

export async function getGbifCountryFacets(key: number): Promise<string[]> {
  const cacheKey = `gbif:countries:${key}`;

  return cachedFetch(cacheKey, async () => {
    const url =
      `${GBIF_BASE}/occurrence/search?` +
      `taxonKey=${key}&limit=0&facet=COUNTRY&facetLimit=20`;

    const response = await fetchJson<GbifOccurrenceFacets>(url, {}, cacheKey);
    const countryFacet = response.facets?.find(
      (facet) => facet.field?.toUpperCase() === "COUNTRY",
    );

    return (countryFacet?.counts ?? [])
      .map((entry) => entry.name)
      .filter(Boolean)
      .slice(0, 12);
  });
}

export async function resolveGbifSpecies(query: string): Promise<GbifSpeciesMatch | null> {
  const directMatch = await matchGbifSpecies(query);
  if (directMatch?.usageKey) return directMatch;

  const searchResults = await searchGbifSpecies(query, 5);
  return searchResults.find((entry) => entry.usageKey) ?? null;
}
