import { getPublishedAnimals } from "@/lib/content";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import type { AnimalRecord } from "@/lib/types";

type AnimalCategoryDefinition = {
  slug: string;
  title: string;
  description: string;
  examples: string;
  featuredAnimalSlug?: string;
  labels: string[];
};

const TAXONOMY_CLASS_LABELS: Record<string, string[]> = {
  mammalia: ["mammal"],
  aves: ["bird"],
  reptilia: ["reptile"],
  amphibia: ["amphibian"],
  actinopterygii: ["fish"],
  chondrichthyes: ["fish"],
  insecta: ["insect"],
  arachnida: ["arachnid"],
};

export const ANIMAL_CATEGORIES = [
  {
    slug: "mammals",
    title: "Mammals",
    description:
      "Warm-blooded animals with fur or hair that often feed milk to their young. Explore lions, elephants, dolphins, and more.",
    examples: "Lions, elephants, pandas",
    featuredAnimalSlug: "lion",
    labels: ["mammal"],
  },
  {
    slug: "birds",
    title: "Birds",
    description:
      "Feathered animals with wings and beaks. Many fly, but some swim or run instead — like penguins on ice.",
    examples: "Eagles, penguins, owls",
    featuredAnimalSlug: "penguin",
    labels: ["bird"],
  },
  {
    slug: "reptiles",
    title: "Reptiles",
    description:
      "Scaly animals such as snakes, turtles, and lizards. Most lay eggs and love sunny places to warm up.",
    examples: "Snakes, turtles, lizards",
    labels: ["reptile"],
  },
  {
    slug: "fish",
    title: "Fish",
    description:
      "Animals that live in water and breathe with gills. From tiny reef fish to huge sharks in the open ocean.",
    examples: "Sharks, tuna, clownfish",
    featuredAnimalSlug: "great-white-shark",
    labels: ["fish"],
  },
  {
    slug: "insects",
    title: "Insects",
    description:
      "Small animals with six legs and often wings. Bees, butterflies, beetles, and ants belong to this huge group.",
    examples: "Bees, butterflies, beetles",
    labels: ["insect"],
  },
] as const satisfies readonly AnimalCategoryDefinition[];

export type AnimalCategory = (typeof ANIMAL_CATEGORIES)[number];

export type AnimalCategorySlug = (typeof ANIMAL_CATEGORIES)[number]["slug"];

const categoryBySlug = new Map<string, AnimalCategory>(
  ANIMAL_CATEGORIES.map((category) => [category.slug, category]),
);

const categoryLabelSet = new Set<string>(ANIMAL_CATEGORIES.flatMap((category) => category.labels));

export function getAnimalCategoryBySlug(slug: string): AnimalCategory | undefined {
  return categoryBySlug.get(slug);
}

export function getAnimalCategorySlugs(): AnimalCategorySlug[] {
  return ANIMAL_CATEGORIES.map((category) => category.slug);
}

export function getCategoryHref(slug: AnimalCategorySlug): string {
  return `/animals/${slug}`;
}

function taxonomyLabelsForAnimal(animal: AnimalRecord): string[] {
  const className = animal.core.taxonomy.class.toLowerCase();
  return TAXONOMY_CLASS_LABELS[className] ?? [];
}

export function getAnimalCategoryLabels(animal: AnimalRecord): string[] {
  const fromContent = animal.core.classificationLabels.filter((label) => categoryLabelSet.has(label));
  if (fromContent.length > 0) return fromContent;

  return taxonomyLabelsForAnimal(animal);
}

export function getPrimaryCategoryForAnimal(animal: AnimalRecord): AnimalCategory | undefined {
  const labels = getAnimalCategoryLabels(animal);

  for (const category of ANIMAL_CATEGORIES) {
    if (category.labels.some((label) => labels.includes(label))) {
      return category;
    }
  }

  return undefined;
}

export function animalMatchesCategory(animal: AnimalRecord, category: AnimalCategory): boolean {
  const labels = getAnimalCategoryLabels(animal);
  return category.labels.some((label) => labels.includes(label));
}

function sortAnimalsByName(animals: AnimalRecord[]): AnimalRecord[] {
  return [...animals].sort((left, right) => left.core.name.localeCompare(right.core.name));
}

export function getAnimalsForCategory(category: AnimalCategory): AnimalRecord[] {
  return sortAnimalsByName(
    getPublishedAnimals().filter((animal) => animalMatchesCategory(animal, category)),
  );
}

export function getPublishedAnimalsGroupedByCategory(options?: { includeEmpty?: boolean }) {
  const animals = getPublishedAnimals();
  const grouped = new Map<AnimalCategorySlug, AnimalRecord[]>(
    ANIMAL_CATEGORIES.map((category) => [category.slug, []]),
  );

  for (const animal of animals) {
    const category = getPrimaryCategoryForAnimal(animal);
    if (!category) continue;
    grouped.get(category.slug)?.push(animal);
  }

  return ANIMAL_CATEGORIES.flatMap((category) => {
    const categoryAnimals = grouped.get(category.slug) ?? [];
    if (!options?.includeEmpty && categoryAnimals.length === 0) return [];

    return [{ category, animals: sortAnimalsByName(categoryAnimals) }];
  });
}

export function getCategoryTitleForAnimal(animal: AnimalRecord): string | undefined {
  return getPrimaryCategoryForAnimal(animal)?.title;
}

export function getCategoryCardImage(
  category: AnimalCategory,
  animals: AnimalRecord[] = getPublishedAnimals(),
) {
  if ("featuredAnimalSlug" in category && category.featuredAnimalSlug) {
    const animal = animals.find((entry) => entry.core.slug === category.featuredAnimalSlug);
    if (animal) {
      return getAnimalImageForDisplay(getAnimalPrimaryImage(animal));
    }
  }

  const categoryAnimals = getAnimalsForCategory(category);
  const featured = categoryAnimals[0] ?? animals[0];
  return getAnimalImageForDisplay(getAnimalPrimaryImage(featured));
}
