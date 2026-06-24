import type { AnimalRecord } from "@/lib/types";

export function animalMatchesSearchQuery(animal: AnimalRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    animal.core.name,
    animal.core.scientificName,
    animal.core.habitat,
    animal.core.dietType,
    animal.core.taxonomy.class,
    animal.core.taxonomy.family,
    animal.core.taxonomy.genus,
    ...animal.core.commonNames,
    ...animal.core.searchIntents,
    ...animal.core.classificationLabels,
  ]
    .join(" ")
    .toLowerCase();

  const tokens = normalized.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function filterAnimalsBySearchQuery(animals: AnimalRecord[], query: string): AnimalRecord[] {
  return animals.filter((animal) => animalMatchesSearchQuery(animal, query));
}
