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

/** Pick one canonical habitat when migrating legacy multi-value lists. */
export function pickCanonicalHabitatFromLegacy(values: string[]): CanonicalHabitatSlug | "savanna" {
  const normalized = values.map((value) => value.trim().toLowerCase());

  const rules: Array<{ match: RegExp; slug: CanonicalHabitatSlug }> = [
    { match: /polar|antarctic|arctic/, slug: "polar" },
    { match: /desert|semi-desert/, slug: "desert" },
    { match: /savanna/, slug: "savanna" },
    { match: /grassland|prairie|steppe/, slug: "grassland" },
    { match: /forest|woodland|jungle|bamboo/, slug: "forest" },
    { match: /wetland|marsh|swamp|mangrove/, slug: "wetland" },
    { match: /coast|shore|kelp|bay|rocky shoreline/, slug: "coast" },
    { match: /ocean|sea|marine|deep/, slug: "ocean" },
  ];

  for (const rule of rules) {
    if (normalized.some((value) => rule.match.test(value))) {
      return rule.slug;
    }
  }

  return "savanna";
}
