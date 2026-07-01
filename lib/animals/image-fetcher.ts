import { REQUIRED_IMAGE_TYPES } from "@/lib/content-validation";
import { searchINaturalistImages } from "@/lib/animals/inaturalist-client";
import {
  dedupeCandidates,
  IMAGE_SEARCH_QUERIES,
  pickBestImage,
  toImportedImage,
} from "@/lib/animals/image-selector";
import type { ImportedImage, WikimediaImageCandidate } from "@/lib/animals/types";
import { searchWikipediaImages } from "@/lib/animals/wikipedia-client";
import {
  searchWikimediaImages,
  searchWikimediaRaw,
} from "@/lib/animals/wikimedia-client";
import type { AnimalImageKind } from "@/lib/types";

async function searchCandidates(
  scientificName: string,
  commonName: string,
  extraTerms: string[],
): Promise<WikimediaImageCandidate[]> {
  const queries = [
    `${scientificName} ${extraTerms.join(" ")}`.trim(),
    `${commonName} ${extraTerms.join(" ")}`.trim(),
  ];

  const batches = await Promise.all(
    queries.map(async (query) => {
      if (!query.trim()) return [] as WikimediaImageCandidate[];
      return searchWikimediaRaw(query, 10);
    }),
  );

  return dedupeCandidates(batches.flat());
}

async function fallbackCandidates(
  scientificName: string,
  commonName: string,
): Promise<WikimediaImageCandidate[]> {
  const wikimedia = await searchWikimediaImages({ scientificName, commonName });
  if (wikimedia.length > 0) return wikimedia;

  const inaturalist = await searchINaturalistImages(scientificName);
  if (inaturalist.length > 0) return inaturalist;

  return searchWikipediaImages(scientificName);
}

export async function fetchImportedImages(input: {
  scientificName: string;
  commonName: string;
}): Promise<{
  imageByType: Partial<Record<AnimalImageKind, ImportedImage>>;
  sources: string[];
  warnings: string[];
}> {
  const warnings: string[] = [];
  const sources = new Set<string>();
  const imageByType: Partial<Record<AnimalImageKind, ImportedImage>> = {};
  const usedUrls = new Set<string>();

  const scientificName = input.scientificName.replace(/\s*\(.*\)\s*$/, "").split(/\s+/).slice(0, 3).join(" ");

  const baseCandidates = await fallbackCandidates(scientificName, input.commonName);
  if (baseCandidates.length > 0) sources.add("Wikimedia Commons");

  for (const imageType of REQUIRED_IMAGE_TYPES) {
    const terms = IMAGE_SEARCH_QUERIES[imageType];
    let candidates = await searchCandidates(scientificName, input.commonName, terms);

    if (candidates.length === 0) {
      candidates = baseCandidates;
    }

    const best = pickBestImage(
      candidates.filter((candidate) => !usedUrls.has(candidate.imageUrl)),
      {
        preferredTerms: terms,
        preferLandscape: imageType === "hero" || imageType === "habitat" || imageType === "range",
        minWidth: imageType === "hero" ? 1200 : 800,
        scientificName: scientificName,
        commonName: input.commonName,
      },
    );

    if (!best) {
      warnings.push(`No suitable ${imageType} image found`);
      continue;
    }

    usedUrls.add(best.imageUrl);
    const source = best.pageUrl.includes("inaturalist")
      ? "iNaturalist"
      : best.pageUrl.includes("wikipedia.org")
        ? "Wikipedia"
        : "Wikimedia Commons";

    sources.add(source);
    imageByType[imageType] = toImportedImage(best, source);
  }

  if (!imageByType.hero && baseCandidates.length > 0) {
    const hero = pickBestImage(baseCandidates, {
      preferredTerms: ["wildlife", "animal"],
      preferLandscape: true,
      minWidth: 1200,
      scientificName: scientificName,
      commonName: input.commonName,
    });

    if (hero) {
      imageByType.hero = toImportedImage(hero, "Wikimedia Commons");
      sources.add("Wikimedia Commons");
    }
  }

  if (!imageByType.hero) {
    const inaturalist = await searchINaturalistImages(scientificName);
    const wiki = await searchWikipediaImages(scientificName);
    const rescue = pickBestImage([...inaturalist, ...wiki], {
      preferLandscape: true,
      scientificName: scientificName,
      commonName: input.commonName,
    });

    if (rescue) {
      const source = rescue.pageUrl.includes("inaturalist")
        ? "iNaturalist"
        : "Wikipedia";
      imageByType.hero = toImportedImage(rescue, source);
      sources.add(source);
    } else {
      warnings.push("No hero image found from Wikimedia, iNaturalist, or Wikipedia");
    }
  }

  return {
    imageByType,
    sources: [...sources],
    warnings,
  };
}

export async function fetchHeroImage(input: {
  scientificName: string;
  commonName: string;
}): Promise<{ hero?: ImportedImage; source?: string; warnings: string[] }> {
  const scientificName = input.scientificName.replace(/\s*\(.*\)\s*$/, "").split(/\s+/).slice(0, 3).join(" ");
  const scientific = await searchWikimediaRaw(`${scientificName} animal`, 12);
  const common =
    input.commonName.trim().length > 0
      ? await searchWikimediaRaw(`${input.commonName} animal`, 12)
      : [];

  const best = pickBestImage(dedupeCandidates([...scientific, ...common]), {
    preferredTerms: ["wildlife", "animal"],
    preferLandscape: true,
    minWidth: 1200,
    scientificName: scientificName,
    commonName: input.commonName,
  });

  if (best) {
    return {
      hero: toImportedImage(best, "Wikimedia Commons"),
      source: "Wikimedia Commons",
      warnings: [],
    };
  }

  const fallback = await fallbackCandidates(scientificName, input.commonName);
  const rescued = pickBestImage(fallback, {
    preferLandscape: true,
    minWidth: 900,
    scientificName: scientificName,
    commonName: input.commonName,
  });

  if (rescued) {
    const source = rescued.pageUrl.includes("inaturalist")
      ? "iNaturalist"
      : rescued.pageUrl.includes("wikipedia.org")
        ? "Wikipedia"
        : "Wikimedia Commons";

    return {
      hero: toImportedImage(rescued, source),
      source,
      warnings: [],
    };
  }

  return {
    warnings: ["No hero image found from Wikimedia, iNaturalist, or Wikipedia"],
  };
}
