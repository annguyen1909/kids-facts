import type { AnimalImageKind } from "@/lib/types";
import type { ImportedImage, WikimediaImageCandidate } from "@/lib/animals/types";

const BLOCKED_DESCRIPTION_TERMS = [
  "map",
  "range map",
  "distribution",
  "skull",
  "skeleton",
  "fossil",
  "diagram",
  "illustration",
  "drawing",
  "chart",
  "icon",
  "logo",
  "journal",
  "pdf",
  "djvu",
  "extracted picklist",
];

const WRONG_SPECIES_TERMS = [
  "otter",
  "jackal",
  "dog",
  "ailurus",
  "red panda",
  "lesser panda",
  "giant panda",
  "ailuropoda",
  "dolphin",
  "elephant",
  "penguin",
];

function isRelevantSpecies(
  candidate: WikimediaImageCandidate,
  scientificName: string,
  commonName?: string,
): boolean {
  const mime = (candidate.mime ?? "").toLowerCase();
  if (mime && !mime.startsWith("image/")) return false;
  if (mime.includes("pdf") || mime.includes("djvu")) return false;

  const text = `${candidate.title} ${candidate.description ?? ""}`.toLowerCase();
  const genus = scientificName.split(" ")[0]?.toLowerCase() ?? "";
  const species = scientificName.toLowerCase();
  const common = commonName?.toLowerCase() ?? "";

  if (containsBlockedTerm(text)) return false;

  const hasStrongMatch =
    text.includes(species) ||
    (genus.length > 3 && text.includes(genus)) ||
    (common.length > 2 && text.includes(common));

  if (!hasStrongMatch) return false;

  return !WRONG_SPECIES_TERMS.some((term) => text.includes(term));
}

export const IMAGE_SEARCH_QUERIES: Record<AnimalImageKind, string[]> = {
  hero: ["wildlife", "portrait"],
  habitat: ["habitat", "environment"],
  diet: ["feeding", "eating", "hunting"],
  baby: ["juvenile", "young", "cub", "calf", "chick"],
  family: ["group", "herd", "pride", "pod", "family"],
  range: ["landscape", "wild"],
  size: ["full body", "standing"],
  closeup: ["close-up", "head", "portrait"],
  "fun-fact": ["behavior", "action"],
  gallery: ["wildlife"],
};

function containsBlockedTerm(value: string): boolean {
  const lower = value.toLowerCase();
  return BLOCKED_DESCRIPTION_TERMS.some((term) => lower.includes(term));
}

export function scoreImageCandidate(
  candidate: WikimediaImageCandidate,
  context: {
    preferredTerms?: string[];
    preferLandscape?: boolean;
    minWidth?: number;
    scientificName?: string;
    commonName?: string;
  } = {},
): number {
  if (
    context.scientificName &&
    !isRelevantSpecies(candidate, context.scientificName, context.commonName)
  ) {
    return -1000;
  }

  let score = 0;
  const description = `${candidate.title} ${candidate.description ?? ""}`.toLowerCase();
  const minWidth = context.minWidth ?? 900;

  if (candidate.width >= 1600) score += 40;
  else if (candidate.width >= 1200) score += 25;
  else if (candidate.width >= minWidth) score += 10;
  else score -= 20;

  if (context.preferLandscape !== false && candidate.width > candidate.height) score += 20;
  if (candidate.width > candidate.height * 1.2) score += 10;

  for (const term of context.preferredTerms ?? []) {
    if (description.includes(term.toLowerCase())) score += 12;
  }

  if (containsBlockedTerm(description)) score -= 50;
  if ((candidate.mime ?? "").includes("jpeg") || (candidate.mime ?? "").includes("jpg")) score += 5;

  return score;
}

export function pickBestImage(
  candidates: WikimediaImageCandidate[],
  context: {
    preferredTerms?: string[];
    preferLandscape?: boolean;
    minWidth?: number;
    scientificName?: string;
    commonName?: string;
  } = {},
): WikimediaImageCandidate | null {
  if (candidates.length === 0) return null;

  const ranked = [...candidates].sort(
    (left, right) =>
      scoreImageCandidate(right, context) - scoreImageCandidate(left, context),
  );

  const best = ranked[0];
  if (scoreImageCandidate(best, context) < -10) return null;
  return best;
}

export function toImportedImage(
  candidate: WikimediaImageCandidate,
  source: ImportedImage["source"],
): ImportedImage {
  const creatorName = candidate.artist || "Unknown";
  const licenseName = candidate.licenseName || "See source";
  const licenseUrl = candidate.licenseUrl || candidate.pageUrl;
  const attribution = `${creatorName} via ${source}, ${licenseName}`;

  return {
    imageUrl: candidate.imageUrl,
    thumbnailUrl: candidate.thumbnailUrl,
    width: candidate.width,
    height: candidate.height,
    alt: candidate.description || candidate.title.replace(/^File:/, ""),
    caption: candidate.description || candidate.title.replace(/^File:/, ""),
    attribution,
    attributionHtml: `Photo by <a href="${candidate.pageUrl}">${creatorName}</a> via ${source}, ${licenseName}`,
    source,
    sourceUrl: candidate.pageUrl,
    creatorName,
    licenseName,
    licenseUrl,
    requiresAttribution: true,
  };
}

export function dedupeCandidates(
  candidates: WikimediaImageCandidate[],
): WikimediaImageCandidate[] {
  const seen = new Set<string>();
  const unique: WikimediaImageCandidate[] = [];

  for (const candidate of candidates) {
    const key = candidate.imageUrl;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
  }

  return unique;
}
