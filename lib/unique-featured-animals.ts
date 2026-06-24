import type { AnimalCategory } from "@/lib/animal-categories";
import { getAnimalsForCategory } from "@/lib/animal-categories";
import type { HubCluster } from "@/lib/hub-clusters";
import { getAnimalPrimaryImage } from "@/lib/images";
import type { AnimalRecord } from "@/lib/types";

export type FeaturedUsage = {
  animalSlugs: Set<string>;
  imageSrcs: Set<string>;
};

export function createFeaturedUsage(): FeaturedUsage {
  return {
    animalSlugs: new Set<string>(),
    imageSrcs: new Set<string>(),
  };
}

function isAnimalAvailable(animal: AnimalRecord, usage: FeaturedUsage): boolean {
  if (usage.animalSlugs.has(animal.core.slug)) return false;
  if (usage.imageSrcs.has(getAnimalPrimaryImage(animal).src)) return false;
  return true;
}

function markAnimalUsed(animal: AnimalRecord, usage: FeaturedUsage) {
  usage.animalSlugs.add(animal.core.slug);
  usage.imageSrcs.add(getAnimalPrimaryImage(animal).src);
}

export function pickUniqueFeaturedAnimal(
  candidates: AnimalRecord[],
  usage: FeaturedUsage,
): AnimalRecord | undefined {
  if (!candidates.length) return undefined;

  const available = candidates.find((animal) => isAnimalAvailable(animal, usage));
  const picked = available ?? candidates[0];
  markAnimalUsed(picked, usage);
  return picked;
}

export function pickUniqueFeaturedAnimals(
  candidates: AnimalRecord[],
  limit: number,
  usage: FeaturedUsage,
): AnimalRecord[] {
  const picked: AnimalRecord[] = [];

  for (const animal of candidates) {
    if (picked.length >= limit) break;
    if (!isAnimalAvailable(animal, usage)) continue;
    picked.push(animal);
    markAnimalUsed(animal, usage);
  }

  return picked;
}

export function buildUniqueHubFeaturedMap(clusters: HubCluster[]): Map<string, AnimalRecord> {
  const usage = createFeaturedUsage();
  const map = new Map<string, AnimalRecord>();

  for (const cluster of clusters) {
    const animal = pickUniqueFeaturedAnimal(cluster.animals, usage);
    if (animal) map.set(cluster.slug, animal);
  }

  return map;
}

export function getCategoryAnimalCandidates(category: AnimalCategory): AnimalRecord[] {
  const categoryAnimals = getAnimalsForCategory(category);
  const ordered: AnimalRecord[] = [];
  const seen = new Set<string>();

  if ("featuredAnimalSlug" in category && category.featuredAnimalSlug) {
    const featured = categoryAnimals.find((animal) => animal.core.slug === category.featuredAnimalSlug);
    if (featured) {
      ordered.push(featured);
      seen.add(featured.core.slug);
    }
  }

  for (const animal of categoryAnimals) {
    if (seen.has(animal.core.slug)) continue;
    ordered.push(animal);
    seen.add(animal.core.slug);
  }

  return ordered;
}

export function buildUniqueCategoryFeaturedMap(
  categories: readonly AnimalCategory[],
): Map<string, AnimalRecord> {
  const usage = createFeaturedUsage();
  const map = new Map<string, AnimalRecord>();

  for (const category of categories) {
    const animal = pickUniqueFeaturedAnimal(getCategoryAnimalCandidates(category), usage);
    if (animal) map.set(category.slug, animal);
  }

  return map;
}
