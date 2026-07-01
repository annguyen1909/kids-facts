import type { GbifSpeciesMatch, GbifVernacularName, ImportedSpeciesData } from "@/lib/animals/types";

const CLASS_LABELS: Record<string, string[]> = {
  mammalia: ["mammal"],
  aves: ["bird"],
  reptilia: ["reptile"],
  amphibia: ["amphibian"],
  actinopterygii: ["fish"],
  chondrichthyes: ["fish"],
  insecta: ["insect"],
  arachnida: ["arachnid"],
};

const COUNTRY_TO_CONTINENT: Record<string, string> = {
  US: "North America",
  CA: "North America",
  MX: "North America",
  BR: "South America",
  AR: "South America",
  GB: "Europe",
  FR: "Europe",
  DE: "Europe",
  ES: "Europe",
  IT: "Europe",
  IN: "Asia",
  CN: "Asia",
  JP: "Asia",
  AU: "Oceania",
  NZ: "Oceania",
  ZA: "Africa",
  KE: "Africa",
  TZ: "Africa",
};

function cleanTaxonomyValue(value?: string, fallback = "Unknown"): string {
  if (!value?.trim()) return fallback;
  return value.trim();
}

function speciesLabel(genus?: string, species?: string, scientificName?: string): string {
  const cleaned = cleanScientificName(scientificName ?? "");
  const cleanedParts = cleaned.split(" ");

  if (genus && species) {
    const epithet = species.includes(" ")
      ? species.split(" ").at(-1) ?? species
      : species;
    return `${genus.charAt(0)}. ${epithet}`;
  }

  if (cleanedParts.length >= 2) {
    return `${cleanedParts[0].charAt(0)}. ${cleanedParts[1]}`;
  }

  return cleaned || "TBD";
}

function countryCodeToName(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized) || normalized === "ZZ") return null;

  const displayNames = new Intl.DisplayNames("en", { type: "region" });
  return displayNames.of(normalized) ?? null;
}

function normalizeCountries(countryCodes: string[]): string[] {
  const names = countryCodes
    .map(countryCodeToName)
    .filter((name): name is string => Boolean(name));

  return [...new Set(names)].slice(0, 12);
}

export function cleanScientificName(name: string): string {
  const binomial = name
    .trim()
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/\s+[A-Z][^,]+,\s*\d{4}\s*$/, "")
    .trim();
  const parts = binomial.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  return binomial || name.trim();
}

export function slugFromScientificName(scientificName: string): string {
  return cleanScientificName(scientificName).toLowerCase().replace(/\s+/g, "-");
}

export function slugFromCommonName(commonName: string): string {
  return commonName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function pickPrimaryCommonName(
  vernacularNames: GbifVernacularName[],
  fallback?: string,
  wikipediaTitle?: string,
): string {
  if (wikipediaTitle?.trim()) {
    return titleCaseName(wikipediaTitle.trim());
  }

  const englishNames = vernacularNames.filter(
    (entry) => !entry.language || entry.language.toLowerCase().startsWith("en"),
  );

  const preferred = englishNames.find((entry) => entry.preferred)?.vernacularName;
  if (preferred) return preferred;

  const firstEnglish = englishNames.find((entry) => entry.vernacularName)?.vernacularName;
  if (firstEnglish) return firstEnglish;

  const anyPreferred = vernacularNames.find((entry) => entry.preferred)?.vernacularName;
  if (anyPreferred) return anyPreferred;

  const firstAny = vernacularNames.find((entry) => entry.vernacularName)?.vernacularName;
  if (firstAny) return firstAny;

  if (fallback) return fallback;
  return "Unknown animal";
}

export function buildClassificationLabels(gbif: GbifSpeciesMatch): string[] {
  const className = gbif.class?.toLowerCase() ?? "";
  const labels = CLASS_LABELS[className] ?? [];
  if (labels.length > 0) return labels;
  if (className) return [className.toLowerCase()];
  return ["animal"];
}

export function countriesToContinents(countryCodes: string[]): string[] {
  const continents = new Set<string>();
  for (const code of countryCodes) {
    const continent = COUNTRY_TO_CONTINENT[code.toUpperCase()];
    if (continent) continents.add(continent);
  }
  return [...continents];
}

export function buildReferenceSummary(
  commonName: string,
  scientificName: string,
  wikipediaExtract?: string,
): string {
  const binomial = cleanScientificName(scientificName);
  const prefix =
    `[Draft from reference sources — editorial review required] ${commonName} (${binomial})`;

  if (!wikipediaExtract) {
    return `${prefix}. Replace this summary with clear, accessible editorial content.`;
  }

  const trimmed = wikipediaExtract.replace(/\s+/g, " ").trim();
  const excerpt = trimmed.length > 280 ? `${trimmed.slice(0, 277).trim()}...` : trimmed;
  return `${prefix}. ${excerpt}`;
}

export function normalizeGbifSpecies(input: {
  gbif: GbifSpeciesMatch;
  vernacularNames: GbifVernacularName[];
  countries: string[];
  wikipediaExtract?: string;
  wikipediaTitle?: string;
}): ImportedSpeciesData {
  const scientificName = input.gbif.scientificName ?? input.gbif.canonicalName ?? "Unknown species";
  const commonName = pickPrimaryCommonName(
    input.vernacularNames,
    input.gbif.vernacularName,
    input.wikipediaTitle,
  );
  const commonNames = [
    commonName,
    ...input.vernacularNames
      .filter((entry) => !entry.language || entry.language.toLowerCase().startsWith("en"))
      .map((entry) => entry.vernacularName)
      .filter((name) => name && name !== commonName),
  ]
    .filter((name, index, array) => array.indexOf(name) === index)
    .slice(0, 6);

  const countries =
    normalizeCountries(input.countries).length > 0
      ? normalizeCountries(input.countries)
      : ["Location data pending editorial review"];
  const continents = countriesToContinents(input.countries);

  return {
    gbifKey: input.gbif.usageKey ?? 0,
    scientificName,
    commonNames,
    taxonomy: {
      kingdom: cleanTaxonomyValue(input.gbif.kingdom, "Animalia"),
      phylum: cleanTaxonomyValue(input.gbif.phylum),
      class: cleanTaxonomyValue(input.gbif.class),
      order: cleanTaxonomyValue(input.gbif.order),
      family: cleanTaxonomyValue(input.gbif.family),
      genus: cleanTaxonomyValue(input.gbif.genus),
      species: speciesLabel(input.gbif.genus, input.gbif.species, scientificName),
    },
    classificationLabels: buildClassificationLabels(input.gbif),
    countries,
    continents: continents.length > 0 ? continents : ["Global distribution — verify editorially"],
    habitat: "savanna",
    biomes: ["biome-pending-editorial-review"],
    referenceSummary: buildReferenceSummary(commonName, scientificName, input.wikipediaExtract),
    imageByType: {},
  };
}

export function resolveImportSlug(input: {
  preferredSlug?: string;
  commonName: string;
  scientificName: string;
}): string {
  if (input.preferredSlug) return input.preferredSlug;
  const commonSlug = slugFromCommonName(input.commonName);
  if (commonSlug && commonSlug !== "unknown-animal") return commonSlug;
  return slugFromScientificName(input.scientificName);
}
