import fs from "node:fs";
import path from "node:path";
import { ZodError } from "zod";
import {
  readAnimalDirectory,
  readComparisonDirectory,
  readHubFile,
} from "@/lib/content";
import type {
  AnimalImageKind,
  AnimalRecord,
  ComparisonResolvedRecord,
  HubRecord,
  HubType,
  SupportingPageSlug,
} from "@/lib/types";

const rootDirectory = path.join(process.cwd(), "content");
const animalsDirectory = path.join(rootDirectory, "animals");
const comparisonsDirectory = path.join(rootDirectory, "comparisons");
const hubsDirectory = path.join(rootDirectory, "hubs");

const hubTypes: HubType[] = [
  "habitats",
  "diets",
  "families",
  "conservation-status",
  "topics",
];

export const REQUIRED_IMAGE_TYPES: AnimalImageKind[] = [
  "hero",
  "habitat",
  "diet",
  "baby",
  "family",
  "range",
  "size",
  "closeup",
  "fun-fact",
];

export const DEFAULT_SUPPORTING_PAGE_SLUGS: SupportingPageSlug[] = [
  "diet",
  "habitat",
  "behavior",
];

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  severity: ValidationSeverity;
  scope: string;
  message: string;
};

export type AnimalCompleteness = {
  slug: string;
  name: string;
  images: { present: number; required: number; missing: string[] };
  supportingPages: { present: number; expected: number; missing: string[] };
  hasCoreBody: boolean;
  hasHeroImage: boolean;
};

export type ContentValidationResult = {
  issues: ValidationIssue[];
  animals: AnimalRecord[];
  comparisons: ComparisonResolvedRecord[];
  hubs: HubRecord[];
  completeness: AnimalCompleteness[];
};

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${fieldPath}: ${issue.message}`;
    })
    .join("; ");
}

function pushIssue(
  issues: ValidationIssue[],
  severity: ValidationSeverity,
  scope: string,
  message: string,
) {
  issues.push({ severity, scope, message });
}

function listAnimalSlugs(): string[] {
  if (!fs.existsSync(animalsDirectory)) return [];

  return fs
    .readdirSync(animalsDirectory)
    .filter((entry) => fs.statSync(path.join(animalsDirectory, entry)).isDirectory())
    .sort();
}

function listComparisonSlugs(): string[] {
  if (!fs.existsSync(comparisonsDirectory)) return [];

  return fs
    .readdirSync(comparisonsDirectory)
    .filter((entry) => fs.statSync(path.join(comparisonsDirectory, entry)).isDirectory())
    .sort();
}

function listHubFiles(): Array<{ hubType: HubType; fileName: string }> {
  return hubTypes.flatMap((hubType) => {
    const directory = path.join(hubsDirectory, hubType);
    if (!fs.existsSync(directory)) return [];

    return fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".mdx"))
      .map((fileName) => ({ hubType, fileName }));
  });
}

function loadAnimals(issues: ValidationIssue[]): AnimalRecord[] {
  const animals: AnimalRecord[] = [];

  for (const animalSlug of listAnimalSlugs()) {
    try {
      const animal = readAnimalDirectory(animalSlug);
      if (animal.core.slug !== animalSlug) {
        pushIssue(
          issues,
          "error",
          `animals/${animalSlug}`,
          `core.slug "${animal.core.slug}" does not match directory "${animalSlug}"`,
        );
      }
      animals.push(animal);
    } catch (error) {
      pushIssue(
        issues,
        "error",
        `animals/${animalSlug}`,
        error instanceof ZodError
          ? formatZodError(error)
          : error instanceof Error
            ? error.message
            : "Unknown schema error",
      );
    }
  }

  return animals;
}

function loadComparisons(issues: ValidationIssue[]): ComparisonResolvedRecord[] {
  const comparisons: ComparisonResolvedRecord[] = [];

  for (const comparisonSlug of listComparisonSlugs()) {
    try {
      comparisons.push(readComparisonDirectory(comparisonSlug));
    } catch (error) {
      pushIssue(
        issues,
        "error",
        `comparisons/${comparisonSlug}`,
        error instanceof ZodError
          ? formatZodError(error)
          : error instanceof Error
            ? error.message
            : "Unknown schema error",
      );
    }
  }

  return comparisons;
}

function loadHubs(issues: ValidationIssue[]): HubRecord[] {
  const hubs: HubRecord[] = [];

  for (const { hubType, fileName } of listHubFiles()) {
    try {
      hubs.push(readHubFile(hubType, fileName));
    } catch (error) {
      pushIssue(
        issues,
        "error",
        `hubs/${hubType}/${fileName}`,
        error instanceof ZodError
          ? formatZodError(error)
          : error instanceof Error
            ? error.message
            : "Unknown schema error",
      );
    }
  }

  return hubs;
}

function validateAnimalCrossReferences(
  animal: AnimalRecord,
  animalSlugs: Set<string>,
  issues: ValidationIssue[],
) {
  const scope = `animals/${animal.core.slug}`;
  const supportingSlugs = new Set(animal.supportingPages.map((page) => page.slug));
  const galleryIds = new Set(animal.galleries.map((gallery) => gallery.id));
  const pageIds = new Set(animal.supportingPages.map((page) => page.id));
  const imageSlugs = new Set(animal.images.map((image) => image.slug));

  for (const relatedSlug of animal.core.relatedAnimals) {
    if (!animalSlugs.has(relatedSlug)) {
      pushIssue(
        issues,
        "error",
        scope,
        `relatedAnimals references missing animal "${relatedSlug}"`,
      );
    }
  }

  for (const candidateSlug of animal.core.comparisonCandidates) {
    if (!animalSlugs.has(candidateSlug)) {
      pushIssue(
        issues,
        "warning",
        scope,
        `comparisonCandidates references missing animal "${candidateSlug}"`,
      );
    }
  }

  for (const galleryId of animal.core.galleryIds) {
    if (!galleryIds.has(galleryId)) {
      pushIssue(
        issues,
        "error",
        scope,
        `galleryIds references missing gallery "${galleryId}"`,
      );
    }
  }

  for (const pageId of animal.core.supportingPageIds) {
    if (!pageIds.has(pageId)) {
      pushIssue(
        issues,
        "error",
        scope,
        `supportingPageIds references missing page "${pageId}"`,
      );
    }
  }

  for (const page of animal.supportingPages) {
    if (page.animalSlug !== animal.core.slug) {
      pushIssue(
        issues,
        "error",
        `${scope}/pages/${page.slug}`,
        `animalSlug "${page.animalSlug}" does not match "${animal.core.slug}"`,
      );
    }

    for (const relatedPageSlug of page.relatedPageSlugs) {
      if (!supportingSlugs.has(relatedPageSlug)) {
        pushIssue(
          issues,
          "warning",
          `${scope}/pages/${page.slug}`,
          `relatedPageSlugs references missing page "${relatedPageSlug}"`,
        );
      }
    }
  }

  for (const gallery of animal.galleries) {
    if (gallery.animalSlug !== animal.core.slug) {
      pushIssue(
        issues,
        "error",
        `${scope}/gallery/${gallery.slug}`,
        `animalSlug "${gallery.animalSlug}" does not match "${animal.core.slug}"`,
      );
    }

    for (const imageSlug of gallery.imageSlugs) {
      if (!imageSlugs.has(imageSlug)) {
        pushIssue(
          issues,
          "error",
          `${scope}/gallery/${gallery.slug}`,
          `imageSlugs references missing image "${imageSlug}"`,
        );
      }
    }
  }

  for (const image of animal.images) {
    if (image.animalSlug !== animal.core.slug) {
      pushIssue(
        issues,
        "error",
        `${scope}/images/${image.slug}`,
        `animalSlug "${image.animalSlug}" does not match "${animal.core.slug}"`,
      );
    }

    for (const featuredPage of image.featuredOnPages) {
      if (featuredPage === "core" || featuredPage === "gallery") continue;
      if (!supportingSlugs.has(featuredPage)) {
        pushIssue(
          issues,
          "warning",
          `${scope}/images/${image.slug}`,
          `featuredOnPages references missing page "${featuredPage}"`,
        );
      }
    }
  }

  for (const faq of animal.core.faq) {
    if (faq.targetPage === "core") continue;
    if (!supportingSlugs.has(faq.targetPage)) {
      pushIssue(
        issues,
        "error",
        scope,
        `FAQ "${faq.question}" targetPage "${faq.targetPage}" does not exist`,
      );
    }
  }
}

function validateComparisons(
  comparisons: ComparisonResolvedRecord[],
  animalSlugs: Set<string>,
  issues: ValidationIssue[],
) {
  for (const { comparison, pages } of comparisons) {
    const scope = `comparisons/${comparison.slug}`;

    if (!animalSlugs.has(comparison.animalA)) {
      pushIssue(
        issues,
        "error",
        scope,
        `animalA "${comparison.animalA}" does not exist`,
      );
    }

    if (!animalSlugs.has(comparison.animalB)) {
      pushIssue(
        issues,
        "error",
        scope,
        `animalB "${comparison.animalB}" does not exist`,
      );
    }

    for (const candidate of comparison.comparisonCandidates) {
      if (!pages.some((page) => page.slug === candidate)) {
        pushIssue(
          issues,
          "error",
          scope,
          `comparisonCandidates references missing page "${candidate}"`,
        );
      }
    }
  }
}

function validateHubs(hubs: HubRecord[], animalSlugs: Set<string>, issues: ValidationIssue[]) {
  for (const hub of hubs) {
    const scope = `hubs/${hub.type}/${hub.slug}`;

    for (const animalSlug of hub.animalSlugs) {
      if (!animalSlugs.has(animalSlug)) {
        pushIssue(
          issues,
          "error",
          scope,
          `animalSlugs references missing animal "${animalSlug}"`,
        );
      }
    }
  }
}

function buildCompleteness(animals: AnimalRecord[]): AnimalCompleteness[] {
  return animals.map((animal) => {
    const presentImageTypes = new Set(animal.images.map((image) => image.imageType));
    const missingImages = REQUIRED_IMAGE_TYPES.filter((type) => !presentImageTypes.has(type));
    const missingPages = DEFAULT_SUPPORTING_PAGE_SLUGS.filter(
      (slug) => !animal.supportingPages.some((page) => page.slug === slug),
    );

    return {
      slug: animal.core.slug,
      name: animal.core.name,
      images: {
        present: REQUIRED_IMAGE_TYPES.length - missingImages.length,
        required: REQUIRED_IMAGE_TYPES.length,
        missing: missingImages,
      },
      supportingPages: {
        present: DEFAULT_SUPPORTING_PAGE_SLUGS.length - missingPages.length,
        expected: DEFAULT_SUPPORTING_PAGE_SLUGS.length,
        missing: missingPages,
      },
      hasCoreBody: animal.coreBody.trim().length > 0,
      hasHeroImage: animal.images.some((image) => image.imageType === "hero"),
    };
  });
}

export function validateContent(): ContentValidationResult {
  const issues: ValidationIssue[] = [];
  const animals = loadAnimals(issues);
  const comparisons = loadComparisons(issues);
  const hubs = loadHubs(issues);
  const animalSlugs = new Set(animals.map((animal) => animal.core.slug));

  for (const animal of animals) {
    validateAnimalCrossReferences(animal, animalSlugs, issues);
  }

  validateComparisons(comparisons, animalSlugs, issues);
  validateHubs(hubs, animalSlugs, issues);

  return {
    issues,
    animals,
    comparisons,
    hubs,
    completeness: buildCompleteness(animals),
  };
}

export function isValidationPassing(result: ContentValidationResult): boolean {
  return result.issues.every((issue) => issue.severity !== "error");
}
