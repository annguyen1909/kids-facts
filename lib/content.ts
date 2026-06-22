import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type {
  AnimalImage,
  AnimalRecord,
  GalleryTopicSlug,
  HubRecord,
  HubType,
  ResolvedEntity,
  SupportingPageSlug,
} from "@/lib/types";

const isoDateString = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string(),
);

const rootDirectory = path.join(process.cwd(), "content");
const animalsDirectory = path.join(rootDirectory, "animals");
const comparisonsDirectory = path.join(rootDirectory, "comparisons");
const hubsDirectory = path.join(rootDirectory, "hubs");

const imageSchema = z.object({
  id: z.string(),
  animalSlug: z.string(),
  slug: z.string(),
  fileName: z.string(),
  originalFileName: z.string().optional(),
  src: z.string().url(),
  srcSet: z
    .object({
      original: z.string(),
      web1600: z.string(),
      web1200: z.string(),
      web800: z.string(),
      thumbnail400: z.string(),
    })
    .optional(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  caption: z.string(),
  attributionText: z.string().optional(),
  attributionHtml: z.string().optional(),
  source: z
    .object({
      sourceName: z.enum([
        "Wikimedia Commons",
        "Unsplash",
        "Pexels",
        "iNaturalist",
        "Wikipedia",
      ]),
      sourceUrl: z.string().url(),
      creatorName: z.string(),
      creatorUrl: z.string().url().optional(),
      licenseName: z.string(),
      licenseUrl: z.string().url(),
      requiresAttribution: z.boolean(),
      downloadedAt: isoDateString,
      reviewedBy: z.string(),
    })
    .optional(),
  imageType: z.enum([
    "hero",
    "habitat",
    "diet",
    "baby",
    "family",
    "range",
    "size",
    "closeup",
    "fun-fact",
    "gallery",
  ]),
  galleryTopics: z.array(
    z.enum([
      "hero",
      "habitat",
      "diet",
      "baby",
      "family",
      "range",
      "size",
      "closeup",
      "fun-fact",
    ]),
  ),
  featuredOnPages: z.array(
    z.union([
      z.literal("core"),
      z.literal("gallery"),
      z.enum([
        "diet",
        "habitat",
        "lifespan",
        "size",
        "behavior",
        "life-cycle",
        "babies",
        "predators-and-threats",
        "adaptations",
        "conservation-status",
        "where-does-it-live",
        "what-does-it-eat",
      ]),
    ]),
  ),
  location: z.string(),
  acquisitionNotes: z.string().optional(),
  updatedAt: isoDateString,
});

const animalCoreSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  commonNames: z.array(z.string()),
  scientificName: z.string(),
  summary: z.string(),
  heroTitle: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  searchIntents: z.array(z.string()),
  taxonomy: z.object({
    kingdom: z.string(),
    phylum: z.string(),
    class: z.string(),
    order: z.string(),
    family: z.string(),
    genus: z.string(),
    species: z.string(),
  }),
  classificationLabels: z.array(z.string()),
  habitats: z.array(z.string()),
  continents: z.array(z.string()),
  countries: z.array(z.string()),
  biomes: z.array(z.string()),
  dietType: z.string(),
  dietItems: z.array(z.string()),
  lifespan: z.object({
    wild: z.string(),
    captivity: z.string().optional(),
  }),
  size: z.object({
    lengthMin: z.string(),
    lengthMax: z.string(),
    heightMin: z.string().optional(),
    heightMax: z.string().optional(),
    wingspanMin: z.string().optional(),
    wingspanMax: z.string().optional(),
  }),
  weight: z.object({
    min: z.string(),
    max: z.string(),
  }),
  speed: z.string().optional(),
  conservationStatus: z.string(),
  populationTrend: z.string(),
  behaviors: z.array(z.string()),
  adaptations: z.array(z.string()),
  predators: z.array(z.string()),
  prey: z.array(z.string()),
  reproduction: z.object({
    offspringName: z.string(),
    gestationOrIncubation: z.string(),
    offspringCount: z.string(),
  }),
  funFacts: z.array(z.string()).min(4),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      targetPage: z.union([
        z.literal("core"),
        z.enum([
          "diet",
          "habitat",
          "lifespan",
          "size",
          "behavior",
          "life-cycle",
          "babies",
          "predators-and-threats",
          "adaptations",
          "conservation-status",
          "where-does-it-live",
          "what-does-it-eat",
        ]),
      ]),
    }),
  ),
  relatedAnimals: z.array(z.string()),
  comparisonCandidates: z.array(z.string()),
  galleryIds: z.array(z.string()),
  supportingPageIds: z.array(z.string()),
  updatedAt: isoDateString,
  publishedAt: isoDateString,
});

const supportingPageFrontmatterSchema = z.object({
  id: z.string(),
  animalSlug: z.string(),
  pageType: z.literal("supporting"),
  slug: z.enum([
    "diet",
    "habitat",
    "lifespan",
    "size",
    "behavior",
    "life-cycle",
    "babies",
    "predators-and-threats",
    "adaptations",
    "conservation-status",
    "where-does-it-live",
    "what-does-it-eat",
  ]),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  intro: z.string(),
  intentKeywords: z.array(z.string()),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  galleryTopics: z.array(
    z.enum([
      "hero",
      "habitat",
      "diet",
      "baby",
      "family",
      "range",
      "size",
      "closeup",
      "fun-fact",
    ]),
  ),
  relatedPageSlugs: z.array(
    z.enum([
      "diet",
      "habitat",
      "lifespan",
      "size",
      "behavior",
      "life-cycle",
      "babies",
      "predators-and-threats",
      "adaptations",
      "conservation-status",
      "where-does-it-live",
      "what-does-it-eat",
    ]),
  ),
  updatedAt: isoDateString,
});

const gallerySchema = z.object({
  id: z.string(),
  animalSlug: z.string(),
  galleryType: z.enum(["main", "topic"]),
  slug: z.union([
    z.literal("gallery"),
    z.enum([
      "hero",
      "habitat",
      "diet",
      "baby",
      "family",
      "range",
      "size",
      "closeup",
      "fun-fact",
    ]),
  ]),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  intro: z.string(),
  imageSlugs: z.array(z.string()),
  updatedAt: isoDateString,
});

const comparisonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  animalA: z.string(),
  animalB: z.string(),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  summary: z.string(),
  comparisonCandidates: z.array(
    z.enum(["overview", "diet", "habitat", "size", "behavior"]),
  ),
  updatedAt: isoDateString,
});

const comparisonPageFrontmatterSchema = z.object({
  id: z.string(),
  comparisonSlug: z.string(),
  slug: z.enum(["overview", "diet", "habitat", "size", "behavior"]),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  intro: z.string(),
  updatedAt: isoDateString,
});

const hubFrontmatterSchema = z.object({
  id: z.string(),
  type: z.enum([
    "habitats",
    "diets",
    "families",
    "conservation-status",
    "topics",
  ]),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  animalSlugs: z.array(z.string()),
  featuredPagePaths: z.array(z.string()),
  updatedAt: isoDateString,
});

function readJson<T>(filePath: string, schema: z.ZodType<T>): T {
  return schema.parse(JSON.parse(fs.readFileSync(filePath, "utf8")));
}

function readMdx<T>(filePath: string, schema: z.ZodType<T>): T & { body: string } {
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return {
    ...schema.parse(data),
    body: content.trim(),
  };
}

export function readAnimalDirectory(animalSlug: string): AnimalRecord {
  const directory = path.join(animalsDirectory, animalSlug);
  const core = readJson(path.join(directory, "animal.json"), animalCoreSchema);
  const coreBody = fs.readFileSync(path.join(directory, "core.mdx"), "utf8").trim();
  const supportingPages = fs
    .readdirSync(path.join(directory, "pages"))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) =>
      readMdx(
        path.join(directory, "pages", file),
        supportingPageFrontmatterSchema,
      ),
    )
    .sort((a, b) => a.title.localeCompare(b.title));
  const galleries = fs
    .readdirSync(path.join(directory, "gallery"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(path.join(directory, "gallery", file), gallerySchema))
    .sort((a, b) => a.title.localeCompare(b.title));
  const images = fs
    .readdirSync(path.join(directory, "images"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(path.join(directory, "images", file), imageSchema));

  return {
    core,
    coreBody,
    supportingPages,
    galleries,
    images,
  };
}

const getAllAnimalsCached = cache((): AnimalRecord[] => {
  return fs
    .readdirSync(animalsDirectory)
    .filter((entry) => fs.statSync(path.join(animalsDirectory, entry)).isDirectory())
    .map(readAnimalDirectory)
    .sort((a, b) => a.core.name.localeCompare(b.core.name));
});

export function getAllAnimals() {
  return getAllAnimalsCached();
}

export function getAnimalBySlug(slug: string) {
  return getAllAnimals().find((animal) => animal.core.slug === slug);
}

export function getAnimalCorePagePath(slug: string) {
  return `/animals/${slug}`;
}

export function getAnimalPrimaryImage(animal: AnimalRecord) {
  return animal.images.find((image) => image.imageType === "hero") ?? animal.images[0];
}

export function getSupportingPage(animal: AnimalRecord, slug: SupportingPageSlug) {
  return animal.supportingPages.find((page) => page.slug === slug);
}

export function getGallery(animal: AnimalRecord, slug: "gallery" | GalleryTopicSlug) {
  return animal.galleries.find((gallery) => gallery.slug === slug);
}

export function getImage(animal: AnimalRecord, slug: string) {
  return animal.images.find((image) => image.slug === slug);
}

export function getRelatedAnimals(animal: AnimalRecord) {
  const others = getAllAnimals().filter((entry) => entry.core.slug !== animal.core.slug);

  return {
    editorial: others.filter((entry) =>
      animal.core.relatedAnimals.includes(entry.core.slug),
    ),
    sameHabitat: others.filter((entry) =>
      entry.core.habitats.some((habitat) => animal.core.habitats.includes(habitat)),
    ),
    sameDiet: others.filter((entry) => entry.core.dietType === animal.core.dietType),
    sameFamily: others.filter(
      (entry) => entry.core.taxonomy.family === animal.core.taxonomy.family,
    ),
    similarSize: others.filter(
      (entry) =>
        entry.core.classificationLabels.includes("large") ===
        animal.core.classificationLabels.includes("large"),
    ),
  };
}

export function readComparisonDirectory(comparisonSlug: string) {
  const directory = path.join(comparisonsDirectory, comparisonSlug);
  const comparison = readJson(path.join(directory, "comparison.json"), comparisonSchema);
  const pages = fs
    .readdirSync(path.join(directory, "pages"))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) =>
      readMdx(path.join(directory, "pages", file), comparisonPageFrontmatterSchema),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return { comparison, pages };
}

const getAllComparisonsCached = cache(() => {
  return fs
    .readdirSync(comparisonsDirectory)
    .filter((entry) => fs.statSync(path.join(comparisonsDirectory, entry)).isDirectory())
    .map((slug) => readComparisonDirectory(slug));
});

export function getAllComparisons() {
  return getAllComparisonsCached();
}

export function getComparisonBySlug(slug: string) {
  return getAllComparisons().find((entry) => entry.comparison.slug === slug);
}

export function readHubFile(hubType: HubType, fileName: string): HubRecord {
  const entry = readMdx(path.join(hubsDirectory, hubType, fileName), hubFrontmatterSchema);

  return {
    id: entry.id,
    type: entry.type,
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    animalSlugs: entry.animalSlugs,
    featuredPagePaths: entry.featuredPagePaths,
    body: entry.body,
    updatedAt: entry.updatedAt,
  };
}

const getAllHubsCached = cache((): HubRecord[] => {
  const hubTypes: HubType[] = [
    "habitats",
    "diets",
    "families",
    "conservation-status",
    "topics",
  ];

  return hubTypes.flatMap((hubType) => {
    const directory = path.join(hubsDirectory, hubType);
    if (!fs.existsSync(directory)) return [];

    return fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => readHubFile(hubType, file));
  });
});

export function getAllHubs() {
  return getAllHubsCached();
}

export function getHub(type: HubType, slug: string) {
  return getAllHubs().find((hub) => hub.type === type && hub.slug === slug);
}

export function resolveAnimalRoute(
  animalSlug: string,
  pageSlug?: string,
): ResolvedEntity | null {
  const animal = getAnimalBySlug(animalSlug);
  if (!animal) return null;

  if (!pageSlug) return { type: "animal", animal };

  const page = getSupportingPage(animal, pageSlug as SupportingPageSlug);
  return page ? { type: "supporting", animal, page } : null;
}

export function resolveGalleryRoute(
  animalSlug: string,
  gallerySlug?: string,
): ResolvedEntity | null {
  const animal = getAnimalBySlug(animalSlug);
  if (!animal) return null;

  const gallery = getGallery(animal, (gallerySlug ?? "gallery") as "gallery" | GalleryTopicSlug);
  if (!gallery) return null;

  const images = gallery.imageSlugs
    .map((slug) => getImage(animal, slug))
    .filter((image): image is AnimalImage => Boolean(image));

  return { type: "gallery", animal, gallery, images };
}

export function resolveImageRoute(animalSlug: string, imageSlug: string): ResolvedEntity | null {
  const animal = getAnimalBySlug(animalSlug);
  if (!animal) return null;

  const image = getImage(animal, imageSlug);
  return image ? { type: "image", animal, image } : null;
}

export function resolveComparisonRoute(
  comparisonSlug: string,
  pageSlug?: string,
): ResolvedEntity | null {
  const resolved = getComparisonBySlug(comparisonSlug);
  if (!resolved) return null;

  const animalA = getAnimalBySlug(resolved.comparison.animalA);
  const animalB = getAnimalBySlug(resolved.comparison.animalB);
  if (!animalA || !animalB) return null;

  const page =
    resolved.pages.find((entry) => entry.slug === (pageSlug ?? "overview")) ?? null;

  return page
    ? { type: "comparison", comparison: resolved.comparison, page, animalA, animalB }
    : null;
}

export function resolveHubRoute(type: HubType, hubSlug: string): ResolvedEntity | null {
  const hub = getHub(type, hubSlug);
  if (!hub) return null;

  const animals = hub.animalSlugs
    .map((slug) => getAnimalBySlug(slug))
    .filter((animal): animal is AnimalRecord => Boolean(animal));

  return { type: "hub", hub, animals };
}

export function getStaticAnimalRoutes() {
  return getAllAnimals().flatMap((animal) => [
    { animalSlug: animal.core.slug },
    ...animal.supportingPages.map((page) => ({
      animalSlug: animal.core.slug,
      pageSlug: page.slug,
    })),
  ]);
}


export function getStaticImageRoutes() {
  return getAllAnimals().flatMap((animal) =>
    animal.images.map((image) => ({
      animalSlug: animal.core.slug,
      imageSlug: image.slug,
    })),
  );
}

export function getStaticComparisonRoutes() {
  return getAllComparisons().flatMap(({ comparison, pages }) => [
    { comparisonSlug: comparison.slug },
    ...pages
      .filter((page) => page.slug !== "overview")
      .map((page) => ({
        comparisonSlug: comparison.slug,
        comparisonPageSlug: page.slug,
      })),
  ]);
}

export function getStaticHubRoutes() {
  return getAllHubs().map((hub) => ({
    type: hub.type,
    hubSlug: hub.slug,
  }));
}
