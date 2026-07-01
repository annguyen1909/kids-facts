import { formatDisplayLabel } from "@/lib/format-display";

/** Fixed habitat buckets — each published animal belongs to exactly one. */
export const CANONICAL_HABITAT_SLUGS = [
  "savanna",
  "grassland",
  "forest",
  "ocean",
  "coast",
  "wetland",
  "polar",
  "desert",
] as const;

export type CanonicalHabitatSlug = (typeof CANONICAL_HABITAT_SLUGS)[number];

export function isCanonicalHabitatSlug(value: string): value is CanonicalHabitatSlug {
  return (CANONICAL_HABITAT_SLUGS as readonly string[]).includes(value);
}

export function getHabitatLabel(slug: string): string {
  return formatDisplayLabel(slug);
}

export function getHabitatHubSlug(habitat: string): string {
  return habitat.trim().toLowerCase();
}

const LEGACY_HABITAT_RULES: Array<{ match: RegExp; slug: CanonicalHabitatSlug }> = [
  { match: /polar|antarctic|arctic|tundra/, slug: "polar" },
  { match: /desert|semi-desert/, slug: "desert" },
  { match: /savanna/, slug: "savanna" },
  { match: /grassland|prairie|steppe|meadow|mountain|alpine|highland/, slug: "grassland" },
  { match: /forest|woodland|jungle|bamboo|rainforest/, slug: "forest" },
  { match: /wetland|marsh|swamp|mangrove|river|lake|freshwater|stream/, slug: "wetland" },
  { match: /coast|shore|kelp|bay|rocky shoreline|coastal/, slug: "coast" },
  { match: /ocean|sea|marine|deep|coral|reef/, slug: "ocean" },
];

/** Pick one canonical habitat when migrating legacy multi-value lists. */
export function pickCanonicalHabitatFromLegacy(values: string[]): CanonicalHabitatSlug | undefined {
  const normalized = values.map((value) => value.trim().toLowerCase());

  for (const rule of LEGACY_HABITAT_RULES) {
    if (normalized.some((value) => rule.match.test(value))) {
      return rule.slug;
    }
  }

  return undefined;
}

/** Resolve a stored habitat string to one canonical hub slug. */
export function resolvePublishableHabitatSlug(habitat: string): CanonicalHabitatSlug | undefined {
  const normalized = habitat.trim().toLowerCase();
  if (!normalized) return undefined;
  if (isCanonicalHabitatSlug(normalized)) return normalized;
  return pickCanonicalHabitatFromLegacy([habitat]);
}
