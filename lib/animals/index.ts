import { getAllAnimals, getAnimalBySlug, getRelatedAnimals } from "@/lib/content";
import { importAnimal, updateAnimal, findAnimalSlugByScientificName } from "@/lib/animals/importer";
import type { ImportAnimalInput, ImportAnimalResult, UpdateAnimalInput } from "@/lib/animals/types";
import type { AnimalImage, AnimalRecord } from "@/lib/types";

export function searchAnimals(query?: string): AnimalRecord[] {
  const animals = getAllAnimals();
  if (!query?.trim()) return animals;

  const normalized = query.trim().toLowerCase();

  return animals.filter((animal) => {
    const haystack = [
      animal.core.name,
      animal.core.scientificName,
      ...animal.core.commonNames,
      ...animal.core.searchIntents,
      animal.core.taxonomy.family,
      animal.core.taxonomy.genus,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function getAnimalByScientificName(scientificName: string): AnimalRecord | null {
  const slug = findAnimalSlugByScientificName(scientificName);
  if (!slug) return null;
  return getAnimalBySlug(slug) ?? null;
}

export function getAnimalImages(slug: string): AnimalImage[] {
  const animal = getAnimalBySlug(slug);
  return animal?.images ?? [];
}

export { getAnimalBySlug, getRelatedAnimals, importAnimal, updateAnimal };
export type { ImportAnimalInput, ImportAnimalResult, UpdateAnimalInput };

export {
  clearAnimalCache,
} from "@/lib/animals/cache";

export {
  validateContent,
  isValidationPassing,
} from "@/lib/content-validation";

export type {
  ImportedSpeciesData,
  ImportedImage,
} from "@/lib/animals/types";
