import fs from "node:fs";
import path from "node:path";
import { REQUIRED_IMAGE_TYPES } from "@/lib/content-validation";
import type { ImportedImage, ImportedSpeciesData } from "@/lib/animals/types";
import type { AnimalImageKind } from "@/lib/types";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/1600x1067/png?text=Replace+Me";

export type AnimalScaffoldOptions = {
  name?: string;
  force?: boolean;
  speciesData?: ImportedSpeciesData;
  imageByType?: Partial<Record<AnimalImageKind, ImportedImage>>;
};

export function isValidAnimalSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isoNow(): string {
  return new Date().toISOString();
}

function writeText(filePath: string, value: string) {
  fs.writeFileSync(filePath, value, "utf8");
}

function galleryTopicsForImageType(imageType: AnimalImageKind): AnimalImageKind[] {
  if (imageType === "hero") return ["hero"];
  if (imageType === "gallery") return ["hero"];
  return [imageType];
}

function featuredPagesForImageType(imageType: AnimalImageKind): Array<"core" | "gallery"> {
  if (imageType === "hero") return ["core", "gallery"];
  return ["gallery"];
}

function buildAnimalJson(
  slug: string,
  name: string,
  timestamp: string,
  speciesData?: ImportedSpeciesData,
) {
  const commonName = speciesData?.commonNames[0] ?? name;

  return {
    id: `animal-${slug}`,
    slug,
    name: commonName,
    commonNames: speciesData?.commonNames ?? [name],
    scientificName: speciesData?.scientificName ?? "Scientific name TBD",
    summary:
      speciesData?.referenceSummary ??
      `${name} summary TBD — replace with a clear, accessible overview.`,
    heroTitle: `${commonName} Facts`,
    metaTitle: `${commonName} Facts | Habitat, Diet, Behavior & Photos`,
    metaDescription: `${commonName} facts with photos, habitat, diet, behavior, and quick facts on one easy-to-read page.`,
    searchIntents: [
      `${commonName.toLowerCase()} facts`,
      `what do ${commonName.toLowerCase()}s eat`,
      `where do ${commonName.toLowerCase()}s live`,
    ],
    taxonomy: speciesData?.taxonomy ?? {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "TBD",
      family: "TBD",
      genus: "TBD",
      species: "TBD",
    },
    classificationLabels: speciesData?.classificationLabels ?? ["mammal"],
    habitat: speciesData?.habitat ?? "savanna",
    continents: speciesData?.continents ?? ["Continent TBD"],
    countries: speciesData?.countries ?? ["Country TBD"],
    biomes: speciesData?.biomes ?? ["biome-tbd"],
    dietType: "Editorial review required",
    dietItems: ["Editorial review required"],
    lifespan: {
      wild: "Editorial review required",
    },
    size: {
      lengthMin: "Editorial review required",
      lengthMax: "Editorial review required",
    },
    weight: {
      min: "Editorial review required",
      max: "Editorial review required",
    },
    conservationStatus: speciesData?.conservationStatus ?? "Editorial review required",
    populationTrend: "Editorial review required",
    behaviors: ["Editorial review required"],
    adaptations: ["Editorial review required"],
    predators: ["Editorial review required"],
    prey: ["Editorial review required"],
    reproduction: {
      offspringName: "Editorial review required",
      gestationOrIncubation: "Editorial review required",
      offspringCount: "Editorial review required",
    },
    funFacts: [
      "Fun fact 1 — editorial review required.",
      "Fun fact 2 — editorial review required.",
      "Fun fact 3 — editorial review required.",
      "Fun fact 4 — editorial review required.",
    ],
    faq: [
      {
        question: `What is a ${commonName.toLowerCase()}?`,
        answer: "Answer TBD — editorial review required.",
      },
      {
        question: `Where do ${commonName.toLowerCase()}s live?`,
        answer: "Answer TBD — editorial review required.",
      },
      {
        question: `What do ${commonName.toLowerCase()}s eat?`,
        answer: "Answer TBD — editorial review required.",
      },
    ],
    relatedAnimals: [],
    comparisonCandidates: [],
    galleryIds: [`${slug}-gallery-main`],
    updatedAt: timestamp,
    publishedAt: timestamp,
  };
}

function buildCoreMdx(name: string, scientificName?: string): string {
  const intro = scientificName
    ? `Intro paragraph TBD. Reference species: *${scientificName}*.`
    : "Intro paragraph TBD.";

  return `## What is a ${name.toLowerCase()}?

${intro}

## Where does it live?

Habitat paragraph TBD — editorial review required.

## What does it eat?

Diet paragraph TBD — editorial review required.

## How does it behave?

Behavior paragraph TBD — editorial review required.

## Life cycle and babies

Life cycle paragraph TBD — editorial review required.

## Why is it at risk?

Conservation paragraph TBD — editorial review required.
`;
}

function buildImageJson(
  slug: string,
  name: string,
  imageType: AnimalImageKind,
  timestamp: string,
  imported?: ImportedImage,
) {
  const imageSlug = `${slug}-${imageType}`;

  if (imported) {
    return {
      id: imageSlug,
      animalSlug: slug,
      slug: imageSlug,
      fileName: `${imageSlug}.jpg`,
      src: imported.imageUrl,
      width: imported.width,
      height: imported.height,
      alt: imported.alt,
      caption: imported.caption,
      attributionText: imported.attribution,
      attributionHtml: imported.attributionHtml,
      source: {
        sourceName: imported.source,
        sourceUrl: imported.sourceUrl,
        creatorName: imported.creatorName,
        creatorUrl: imported.creatorUrl,
        licenseName: imported.licenseName,
        licenseUrl: imported.licenseUrl,
        requiresAttribution: imported.requiresAttribution,
        downloadedAt: timestamp,
        reviewedBy: "importer@wildlifedb.local",
      },
      imageType,
      galleryTopics: galleryTopicsForImageType(imageType),
      featuredOnPages: featuredPagesForImageType(imageType),
      location: "Imported — verify editorially",
      acquisitionNotes: `Imported automatically from ${imported.source}. Editorial review required before publish.`,
      updatedAt: timestamp,
    };
  }

  return {
    id: imageSlug,
    animalSlug: slug,
    slug: imageSlug,
    fileName: `${imageSlug}-1200.webp`,
    src: PLACEHOLDER_IMAGE_URL,
    width: 1200,
    height: 800,
    alt: `${name} ${imageType} image TBD`,
    caption: `${name} ${imageType} caption TBD.`,
    imageType,
    galleryTopics: galleryTopicsForImageType(imageType),
    featuredOnPages: featuredPagesForImageType(imageType),
    location: "Location TBD",
    acquisitionNotes: "Replace placeholder image and metadata before publishing.",
    updatedAt: timestamp,
  };
}

function buildMainGalleryJson(slug: string, name: string, timestamp: string) {
  const imageSlugs = REQUIRED_IMAGE_TYPES.map((imageType) => `${slug}-${imageType}`);

  return {
    id: `${slug}-gallery-main`,
    animalSlug: slug,
    galleryType: "main",
    slug: "gallery",
    title: `${name} Photo Gallery`,
    metaTitle: `${name} Photo Gallery`,
    metaDescription: `Browse a ${name.toLowerCase()} photo gallery with wildlife photos.`,
    intro: `Explore ${name.toLowerCase()} photos organized for learning and classroom observation.`,
    imageSlugs,
    updatedAt: timestamp,
  };
}

export type ScaffoldAnimalResult = {
  slug: string;
  name: string;
  contentDirectory: string;
  assetsDirectory: string;
  createdFiles: string[];
};

export function scaffoldAnimal(
  slug: string,
  options: AnimalScaffoldOptions = {},
): ScaffoldAnimalResult {
  if (!isValidAnimalSlug(slug)) {
    throw new Error(
      `Invalid slug "${slug}". Use lowercase kebab-case, e.g. "african-elephant".`,
    );
  }

  const speciesData = options.speciesData;
  const name = options.name ?? speciesData?.commonNames[0] ?? slugToDisplayName(slug);
  const timestamp = isoNow();
  const contentDirectory = path.join(process.cwd(), "content", "animals", slug);
  const assetsDirectory = path.join(process.cwd(), "assets", "images", "animals", slug);

  if (fs.existsSync(contentDirectory) && !options.force) {
    throw new Error(
      `Animal "${slug}" already exists at content/animals/${slug}. Use --force to overwrite scaffold files.`,
    );
  }

  const createdFiles: string[] = [];
  const imageByType = options.imageByType ?? speciesData?.imageByType ?? {};

  const directories = [
    contentDirectory,
    path.join(contentDirectory, "gallery"),
    path.join(contentDirectory, "images"),
    assetsDirectory,
    path.join(assetsDirectory, "original"),
    path.join(assetsDirectory, "web"),
    path.join(assetsDirectory, "thumbnails"),
    path.join(assetsDirectory, "metadata"),
  ];

  for (const directory of directories) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const filesToWrite: Array<{ filePath: string; contents: string }> = [
    {
      filePath: path.join(contentDirectory, "animal.json"),
      contents: `${JSON.stringify(buildAnimalJson(slug, name, timestamp, speciesData), null, 2)}\n`,
    },
    {
      filePath: path.join(contentDirectory, "core.mdx"),
      contents: buildCoreMdx(name, speciesData?.scientificName),
    },
    {
      filePath: path.join(contentDirectory, "gallery", "main.json"),
      contents: `${JSON.stringify(buildMainGalleryJson(slug, name, timestamp), null, 2)}\n`,
    },
  ];

  for (const imageType of REQUIRED_IMAGE_TYPES) {
    filesToWrite.push({
      filePath: path.join(contentDirectory, "images", `${slug}-${imageType}.json`),
      contents: `${JSON.stringify(
        buildImageJson(slug, name, imageType, timestamp, imageByType[imageType]),
        null,
        2,
      )}\n`,
    });
  }

  for (const { filePath, contents } of filesToWrite) {
    writeText(filePath, contents);
    createdFiles.push(path.relative(process.cwd(), filePath));
  }

  for (const subDirectory of ["original", "web", "thumbnails", "metadata"]) {
    const keepFile = path.join(assetsDirectory, subDirectory, ".gitkeep");
    writeText(keepFile, "");
    createdFiles.push(path.relative(process.cwd(), keepFile));
  }

  return {
    slug,
    name,
    contentDirectory,
    assetsDirectory,
    createdFiles,
  };
}

export function updateAnimalMetadataFiles(input: {
  slug: string;
  speciesData: ImportedSpeciesData;
  imageByType?: Partial<Record<AnimalImageKind, ImportedImage>>;
  updateAnimalJson?: boolean;
}): string[] {
  const contentDirectory = path.join(process.cwd(), "content", "animals", input.slug);
  if (!fs.existsSync(contentDirectory)) {
    throw new Error(`Animal "${input.slug}" does not exist`);
  }

  const timestamp = isoNow();
  const name = input.speciesData.commonNames[0] ?? slugToDisplayName(input.slug);
  const updatedFiles: string[] = [];
  const imageByType = input.imageByType ?? input.speciesData.imageByType ?? {};

  if (input.updateAnimalJson !== false) {
    writeText(
      path.join(contentDirectory, "animal.json"),
      `${JSON.stringify(buildAnimalJson(input.slug, name, timestamp, input.speciesData), null, 2)}\n`,
    );
    updatedFiles.push(`content/animals/${input.slug}/animal.json`);
  }

  for (const imageType of REQUIRED_IMAGE_TYPES) {
    const imported = imageByType[imageType];
    if (!imported) continue;

    const imagePath = path.join(contentDirectory, "images", `${input.slug}-${imageType}.json`);
    writeText(
      imagePath,
      `${JSON.stringify(
        buildImageJson(input.slug, name, imageType, timestamp, imported),
        null,
        2,
      )}\n`,
    );
    updatedFiles.push(`content/animals/${input.slug}/images/${input.slug}-${imageType}.json`);
  }

  return updatedFiles;
}
