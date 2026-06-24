import { formatDisplayLabel } from "@/lib/format-display";
import { getHabitatLabel, isCanonicalHabitatSlug } from "@/lib/canonical-habitats";
import type { AnimalRecord, HubRecord, HubType } from "@/lib/types";

export function toHubSlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isPublishableHabitatSlug(label: string): boolean {
  return isCanonicalHabitatSlug(label.trim().toLowerCase());
}

export function isPublishableDietLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  if (!normalized) return false;

  const blocked = ["pending", "tbd", "editorial", "required", "review"];
  return !blocked.some((term) => normalized.includes(term));
}

export type HubCluster = {
  slug: string;
  label: string;
  name: string;
  description: string;
  animals: AnimalRecord[];
  updatedAt: string;
};

function latestUpdatedAt(animals: AnimalRecord[]) {
  return animals
    .map((animal) => animal.core.updatedAt)
    .sort()
    .at(-1) ?? new Date().toISOString();
}

function buildCluster(
  slug: string,
  label: string,
  animals: AnimalRecord[],
  type: "habitats" | "diets",
): HubCluster {
  const displayLabel = formatDisplayLabel(label);
  const name = `${displayLabel} Animals`;
  const description =
    type === "diets"
      ? `Explore ${displayLabel.toLowerCase()} animals with wildlife photos, quick facts, and full animal pages.`
      : `Discover animals that live in ${displayLabel.toLowerCase()} habitats — photos and facts for curious readers.`;

  return {
    slug,
    label: displayLabel,
    name,
    description,
    animals,
    updatedAt: latestUpdatedAt(animals),
  };
}

function sortClusters(clusters: HubCluster[]) {
  return clusters.sort(
    (a, b) => b.animals.length - a.animals.length || a.name.localeCompare(b.name),
  );
}

export function buildHabitatClusters(animals: AnimalRecord[]): HubCluster[] {
  const bySlug = new Map<string, { label: string; animals: AnimalRecord[] }>();

  for (const animal of animals) {
    const habitat = animal.core.habitat.trim().toLowerCase();
    if (!isPublishableHabitatSlug(habitat)) continue;

    const slug = toHubSlug(habitat);
    if (!slug) continue;

    const entry = bySlug.get(slug) ?? { label: getHabitatLabel(habitat), animals: [] };
    entry.animals.push(animal);
    bySlug.set(slug, entry);
  }

  return sortClusters(
    [...bySlug.entries()].map(([slug, { label, animals: clusterAnimals }]) =>
      buildCluster(
        slug,
        label,
        clusterAnimals.sort((a, b) => a.core.name.localeCompare(b.core.name)),
        "habitats",
      ),
    ),
  );
}

export function buildDietClusters(animals: AnimalRecord[]): HubCluster[] {
  const bySlug = new Map<string, { label: string; animals: AnimalRecord[] }>();

  for (const animal of animals) {
    const dietType = animal.core.dietType;
    if (!isPublishableDietLabel(dietType)) continue;

    const slug = toHubSlug(dietType);
    if (!slug) continue;

    const entry = bySlug.get(slug) ?? { label: dietType, animals: [] };
    if (!entry.animals.some((item) => item.core.slug === animal.core.slug)) {
      entry.animals.push(animal);
    }
    bySlug.set(slug, entry);
  }

  return sortClusters(
    [...bySlug.entries()].map(([slug, { label, animals: clusterAnimals }]) =>
      buildCluster(
        slug,
        label,
        clusterAnimals.sort((a, b) => a.core.name.localeCompare(b.core.name)),
        "diets",
      ),
    ),
  );
}

export function clusterToHubRecord(cluster: HubCluster, type: HubType): HubRecord {
  return {
    id: `cluster-${type}-${cluster.slug}`,
    type,
    slug: cluster.slug,
    name: cluster.name,
    description: cluster.description,
    animalSlugs: cluster.animals.map((animal) => animal.core.slug),
    featuredPagePaths: cluster.animals.slice(0, 3).map((animal) => `/animals/${animal.core.slug}`),
    body: "",
    updatedAt: cluster.updatedAt,
  };
}

export function mergeHubWithCluster(editorial: HubRecord, cluster: HubCluster): HubRecord {
  return {
    ...editorial,
    animalSlugs: cluster.animals.map((animal) => animal.core.slug),
    featuredPagePaths:
      editorial.featuredPagePaths.length > 0
        ? editorial.featuredPagePaths
        : cluster.animals.slice(0, 3).map((animal) => `/animals/${animal.core.slug}`),
    updatedAt: cluster.updatedAt,
  };
}

export function getHabitatSlug(animal: AnimalRecord): string | undefined {
  const habitat = animal.core.habitat.trim().toLowerCase();
  return isPublishableHabitatSlug(habitat) ? toHubSlug(habitat) : undefined;
}

/** @deprecated Use getHabitatSlug */
export const getPrimaryHabitatSlug = getHabitatSlug;

export function getDietSlug(animal: AnimalRecord): string | undefined {
  return isPublishableDietLabel(animal.core.dietType)
    ? toHubSlug(animal.core.dietType)
    : undefined;
}
