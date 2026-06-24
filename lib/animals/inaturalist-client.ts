import { cleanScientificName } from "@/lib/animals/normalizer";
import { cachedFetch } from "@/lib/animals/cache";
import { fetchJson } from "@/lib/animals/http";
import type { WikimediaImageCandidate } from "@/lib/animals/types";

const INATURALIST_BASE = "https://api.inaturalist.org/v1";

type INatTaxaResponse = {
  results?: Array<{
    id: number;
    name: string;
    preferred_common_name?: string;
  }>;
};

type INatPhoto = {
  url?: string;
  attribution?: string;
  license_code?: string;
  original_dimensions?: {
    width?: number;
    height?: number;
  };
};

type INatObservationResponse = {
  results?: Array<{
    photos?: INatPhoto[];
  }>;
};

function toCandidate(photo: INatPhoto, taxonName: string): WikimediaImageCandidate | null {
  if (!photo.url) return null;

  const imageUrl = photo.url.replace("/square.", "/original.").replace("/medium.", "/original.");
  const width = photo.original_dimensions?.width ?? 1600;
  const height = photo.original_dimensions?.height ?? 1067;

  return {
    title: `${taxonName} iNaturalist photo`,
    pageUrl: imageUrl,
    imageUrl,
    thumbnailUrl: photo.url,
    width,
    height,
    mime: "image/jpeg",
    description: `${taxonName} wildlife photo`,
    artist: photo.attribution ?? "iNaturalist contributor",
    licenseName: photo.license_code ?? "See iNaturalist",
    licenseUrl: "https://www.inaturalist.org/pages/terms",
    credit: photo.attribution ?? "",
  };
}

export async function searchINaturalistImages(scientificName: string): Promise<WikimediaImageCandidate[]> {
  const binomial = cleanScientificName(scientificName);
  const cacheKey = `inaturalist:images:${binomial.toLowerCase()}`;

  return cachedFetch(cacheKey, async () => {
    const taxaUrl =
      `${INATURALIST_BASE}/taxa?q=${encodeURIComponent(binomial)}` +
      "&rank=species&per_page=1";
    const taxaResponse = await fetchJson<INatTaxaResponse>(taxaUrl, {}, `${cacheKey}:taxa`);
    const taxon = taxaResponse.results?.[0];
    if (!taxon) return [];

    const observationsUrl =
      `${INATURALIST_BASE}/observations?` +
      `taxon_id=${taxon.id}&photos=true&quality_grade=research&photo_license=any&per_page=8`;

    const observations = await fetchJson<INatObservationResponse>(
      observationsUrl,
      {},
      `${cacheKey}:observations`,
    );

    return (observations.results ?? [])
      .flatMap((observation) => observation.photos ?? [])
      .map((photo) => toCandidate(photo, taxon.name))
      .filter((candidate): candidate is WikimediaImageCandidate => Boolean(candidate));
  });
}
