import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type {
  AnimalCardRecord,
  AnimalImage,
  AnimalRecord,
  GalleryTopicSlug,
  HubRecord,
  HubType,
  ResolvedEntity,
} from "@/lib/types";
import { cleanScientificName } from "@/lib/animals/normalizer";
import { formatDisplayLabel } from "@/lib/format-display";
import {
  buildDietClusters,
  buildHabitatClusters,
  clusterToHubRecord,
  mergeHubWithCluster,
  type HubCluster,
} from "@/lib/hub-clusters";

const isoDateString = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string(),
);

const rootDirectory = path.join(process.cwd(), "content");
const animalsDirectory = path.join(rootDirectory, "animals");

/** Scaffold/template folders — excluded from the public site and sitemap. */
export const UNPUBLISHED_ANIMAL_SLUGS = new Set(["animal"]);

export function isPublishedAnimal(slug: string) {
  return !UNPUBLISHED_ANIMAL_SLUGS.has(slug);
}
const comparisonsDirectory = path.join(rootDirectory, "comparisons");
const hubsDirectory = path.join(rootDirectory, "hubs");

const imageSrc = z.union([
  z.string().url(),
  z.string().regex(/^\/images\//, "Local image paths must start with /images/"),
]);

const imageSchema = z.object({
  id: z.string(),
  animalSlug: z.string(),
  slug: z.string(),
  fileName: z.string(),
  originalFileName: z.string().optional(),
  src: imageSrc,
  srcSet: z
    .object({
      original: z.string(),
      web1200: z.string(),
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
  featuredOnPages: z.array(z.enum(["core", "gallery"])),
  location: z.string(),
  acquisitionNotes: z.string().optional(),
  objectPosition: z.string().optional(),
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
  habitat: z.string(),
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
    }),
  ),
  relatedAnimals: z.array(z.string()),
  comparisonCandidates: z.array(z.string()),
  galleryIds: z.array(z.string()),
  updatedAt: isoDateString,
  publishedAt: isoDateString,
});

type AnimalCore = z.infer<typeof animalCoreSchema>;

function normalizeDisplayList(values: string[]): string[] {
  return values.map(formatDisplayLabel);
}

function normalizeAnimalCore(core: AnimalCore): AnimalCore {
  const habitat = core.habitat.trim().toLowerCase();

  return {
    ...core,
    scientificName: cleanScientificName(core.scientificName),
    habitat,
    biomes: normalizeDisplayList(core.biomes),
    classificationLabels: normalizeDisplayList(core.classificationLabels),
    dietType: formatDisplayLabel(core.dietType),
    conservationStatus: formatDisplayLabel(core.conservationStatus),
    populationTrend: formatDisplayLabel(core.populationTrend),
    taxonomy: {
      ...core.taxonomy,
      class: formatDisplayLabel(core.taxonomy.class),
    },
  };
}

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
  const core = normalizeAnimalCore(readJson(path.join(directory, "animal.json"), animalCoreSchema));
  const coreBody = fs.readFileSync(path.join(directory, "core.mdx"), "utf8").trim();
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
    galleries,
    images,
  };
}

function readAnimalPrimaryImages(directory: string): AnimalImage[] {
  const imageDirectory = path.join(directory, "images");
  const imageFiles = fs
    .readdirSync(imageDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort();

  let fallbackImage: AnimalImage | undefined;

  for (const file of imageFiles) {
    const image = readJson(path.join(imageDirectory, file), imageSchema);
    fallbackImage ??= image;

    if (image.imageType === "hero") {
      return [image];
    }
  }

  return fallbackImage ? [fallbackImage] : [];
}

export function readAnimalCardDirectory(animalSlug: string): AnimalCardRecord {
  const directory = path.join(animalsDirectory, animalSlug);
  const core = normalizeAnimalCore(readJson(path.join(directory, "animal.json"), animalCoreSchema));

  return {
    core,
    images: readAnimalPrimaryImages(directory),
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

const getAllAnimalCardsCached = cache((): AnimalCardRecord[] => {
  return fs
    .readdirSync(animalsDirectory)
    .filter((entry) => fs.statSync(path.join(animalsDirectory, entry)).isDirectory())
    .map(readAnimalCardDirectory)
    .sort((a, b) => a.core.name.localeCompare(b.core.name));
});

export function getAllAnimalCards() {
  return getAllAnimalCardsCached();
}

export function getPublishedAnimals() {
  return getAllAnimals().filter((animal) => isPublishedAnimal(animal.core.slug));
}

export function getPublishedAnimalCards() {
  return getAllAnimalCards().filter((animal) => isPublishedAnimal(animal.core.slug));
}

export function getAnimalBySlug(slug: string) {
  return getAllAnimals().find((animal) => animal.core.slug === slug);
}

export function getPublishedAnimalBySlug(slug: string) {
  const animal = getAnimalBySlug(slug);
  return animal && isPublishedAnimal(slug) ? animal : undefined;
}

export function formatFeaturedPageLabel(pagePath: string): string {
  const animalMatch = pagePath.match(/^\/animals\/([^/]+)$/);
  if (animalMatch) {
    const animal = getAnimalBySlug(animalMatch[1]);
    if (animal) return animal.core.name;
  }

  const segments = pagePath.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);
  if (!lastSegment) return pagePath;

  return formatDisplayLabel(lastSegment.replace(/-/g, " "));
}

export function getAnimalCorePagePath(slug: string) {
  return `/animals/${slug}`;
}

export function getAnimalPrimaryImage(animal: AnimalRecord) {
  return animal.images.find((image) => image.imageType === "hero") ?? animal.images[0];
}

export function getGallery(animal: AnimalRecord, slug: "gallery" | GalleryTopicSlug) {
  return animal.galleries.find((gallery) => gallery.slug === slug);
}

export function getImage(animal: AnimalRecord, slug: string) {
  return animal.images.find((image) => image.slug === slug);
}

export function getRelatedAnimals(animal: AnimalRecord) {
  const others = getPublishedAnimals().filter((entry) => entry.core.slug !== animal.core.slug);

  return {
    editorial: others.filter((entry) =>
      animal.core.relatedAnimals.includes(entry.core.slug),
    ),
    sameHabitat: others.filter((entry) => entry.core.habitat === animal.core.habitat),
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
  const animal = getPublishedAnimalBySlug(animalSlug);
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

  const animalA = getPublishedAnimalBySlug(resolved.comparison.animalA);
  const animalB = getPublishedAnimalBySlug(resolved.comparison.animalB);
  if (!animalA || !animalB) return null;

  const page =
    resolved.pages.find((entry) => entry.slug === (pageSlug ?? "overview")) ?? null;

  return page
    ? { type: "comparison", comparison: resolved.comparison, page, animalA, animalB }
    : null;
}

function getClusterHubs(type: "habitats" | "diets"): HubCluster[] {
  const animals = getPublishedAnimals();
  return type === "habitats" ? buildHabitatClusters(animals) : buildDietClusters(animals);
}

export function getHabitatClusters() {
  return getClusterHubs("habitats");
}

export function getDietClusters() {
  return getClusterHubs("diets");
}

function resolveClusterHubRoute(type: "habitats" | "diets", hubSlug: string): ResolvedEntity | null {
  const cluster = getClusterHubs(type).find((entry) => entry.slug === hubSlug);
  if (!cluster) return null;

  const editorial = getHub(type, hubSlug);
  const hub = editorial
    ? mergeHubWithCluster(editorial, cluster)
    : clusterToHubRecord(cluster, type);

  return { type: "hub", hub, animals: cluster.animals };
}

export function resolveHubRoute(type: HubType, hubSlug: string): ResolvedEntity | null {
  if (type === "habitats" || type === "diets") {
    return resolveClusterHubRoute(type, hubSlug);
  }

  const hub = getHub(type, hubSlug);
  if (!hub) return null;

  const animals = hub.animalSlugs
    .map((slug) => getPublishedAnimalBySlug(slug))
    .filter((animal): animal is AnimalRecord => Boolean(animal));

  return { type: "hub", hub, animals };
}

export function getStaticAnimalRoutes() {
  return getPublishedAnimals().map((animal) => ({ animalSlug: animal.core.slug }));
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

export function getStaticHabitatHubRoutes() {
  return getHabitatClusters().map((cluster) => ({ hubSlug: cluster.slug }));
}

export function getStaticDietHubRoutes() {
  return getDietClusters().map((cluster) => ({ hubSlug: cluster.slug }));
}
