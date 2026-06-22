import fs from "node:fs";
import path from "node:path";
import {
  getGbifCountryFacets,
  getGbifVernacularNames,
  resolveGbifSpecies,
} from "@/lib/animals/gbif-client";
import { fetchImportedImages } from "@/lib/animals/image-fetcher";
import { cleanScientificName, normalizeGbifSpecies, resolveImportSlug } from "@/lib/animals/normalizer";
import type { ImportAnimalInput, ImportAnimalResult, UpdateAnimalInput } from "@/lib/animals/types";
import { getWikipediaSummary } from "@/lib/animals/wikipedia-client";
import { getAllAnimals } from "@/lib/content";
import {
  isValidAnimalSlug,
  scaffoldAnimal,
  updateAnimalMetadataFiles,
} from "@/lib/scaffold-animal";

function listExistingScientificNames(): Map<string, string> {
  const animalsDirectory = path.join(process.cwd(), "content", "animals");
  if (!fs.existsSync(animalsDirectory)) return new Map();

  const map = new Map<string, string>();

  for (const entry of fs.readdirSync(animalsDirectory)) {
    const animalJsonPath = path.join(animalsDirectory, entry, "animal.json");
    if (!fs.existsSync(animalJsonPath)) continue;

    try {
      const animal = JSON.parse(fs.readFileSync(animalJsonPath, "utf8")) as {
        slug?: string;
        scientificName?: string;
      };
      if (animal.scientificName && animal.slug) {
        map.set(animal.scientificName.toLowerCase(), animal.slug);
      }
    } catch {
      // Ignore invalid files during duplicate detection.
    }
  }

  return map;
}

async function buildSpeciesData(query: string, skipImages: boolean) {
  const gbif = await resolveGbifSpecies(query);
  if (!gbif?.usageKey) {
    throw new Error(`Could not resolve species in GBIF for "${query}"`);
  }

  const [vernacularNames, countries, wikipedia] = await Promise.all([
    getGbifVernacularNames(gbif.usageKey),
    getGbifCountryFacets(gbif.usageKey),
    getWikipediaSummary(cleanScientificName(gbif.scientificName ?? query)),
  ]);

  const speciesData = normalizeGbifSpecies({
    gbif,
    vernacularNames,
    countries,
    wikipediaExtract: wikipedia?.summary,
    wikipediaTitle: wikipedia?.title,
  });
  speciesData.scientificName = cleanScientificName(
    speciesData.scientificName || gbif.scientificName || query,
  );

  const warnings: string[] = [];
  let imageSources: string[] = [];

  if (!skipImages) {
    const images = await fetchImportedImages({
      scientificName: speciesData.scientificName,
      commonName: speciesData.commonNames[0] ?? query,
    });
    speciesData.imageByType = images.imageByType;
    speciesData.heroImage = images.imageByType.hero;
    imageSources = images.sources;
    warnings.push(...images.warnings);
  } else {
    warnings.push("Image import skipped");
  }

  return { speciesData, warnings, imageSources };
}

export async function importAnimal(input: ImportAnimalInput): Promise<ImportAnimalResult> {
  const { speciesData, warnings, imageSources } = await buildSpeciesData(
    input.query,
    input.skipImages ?? false,
  );

  const slug = resolveImportSlug({
    preferredSlug: input.slug,
    commonName: speciesData.commonNames[0] ?? input.query,
    scientificName: speciesData.scientificName,
  });

  if (!isValidAnimalSlug(slug)) {
    throw new Error(`Resolved slug "${slug}" is invalid`);
  }

  const existingByScientific = listExistingScientificNames();
  const duplicateSlug = existingByScientific.get(speciesData.scientificName.toLowerCase());
  if (duplicateSlug && duplicateSlug !== slug && !input.force) {
    throw new Error(
      `Species already imported as "${duplicateSlug}" (${speciesData.scientificName})`,
    );
  }

  const contentDirectory = path.join(process.cwd(), "content", "animals", slug);
  const exists = fs.existsSync(contentDirectory);
  if (exists && !input.force) {
    throw new Error(
      `Animal "${slug}" already exists. Pass force=true or use --force to overwrite scaffold files.`,
    );
  }

  const result = scaffoldAnimal(slug, {
    name: speciesData.commonNames[0],
    force: input.force,
    speciesData,
    imageByType: speciesData.imageByType,
  });

  return {
    slug,
    name: result.name,
    scientificName: speciesData.scientificName,
    gbifKey: speciesData.gbifKey,
    created: !exists,
    updated: exists,
    contentDirectory: result.contentDirectory,
    imageSources,
    createdFiles: result.createdFiles,
    warnings,
  };
}

export async function updateAnimal(input: UpdateAnimalInput): Promise<ImportAnimalResult> {
  const contentDirectory = path.join(process.cwd(), "content", "animals", input.slug);
  if (!fs.existsSync(contentDirectory)) {
    throw new Error(`Animal "${input.slug}" does not exist`);
  }

  const animalJsonPath = path.join(contentDirectory, "animal.json");
  const existing = JSON.parse(fs.readFileSync(animalJsonPath, "utf8")) as {
    scientificName?: string;
    name?: string;
  };

  const query = existing.scientificName ?? existing.name;
  if (!query) {
    throw new Error(`Animal "${input.slug}" is missing scientificName`);
  }

  const refreshTaxonomy = input.refreshTaxonomy ?? true;
  const refreshImages = input.refreshImages ?? true;
  const warnings: string[] = [];
  const imageSources: string[] = [];
  const updatedFiles: string[] = [];

  let speciesData = normalizeGbifSpecies({
    gbif: (await resolveGbifSpecies(query)) ?? { scientificName: query },
    vernacularNames: [],
    countries: [],
  });

  if (refreshTaxonomy) {
    const gbif = await resolveGbifSpecies(query);
    if (!gbif?.usageKey) {
      throw new Error(`Could not resolve species in GBIF for "${query}"`);
    }

    const [vernacularNames, countries, wikipedia] = await Promise.all([
      getGbifVernacularNames(gbif.usageKey),
      getGbifCountryFacets(gbif.usageKey),
      getWikipediaSummary(cleanScientificName(gbif.scientificName ?? query)),
    ]);

    speciesData = normalizeGbifSpecies({
      gbif,
      vernacularNames,
      countries,
      wikipediaExtract: wikipedia?.summary,
      wikipediaTitle: wikipedia?.title,
    });
  } else {
    warnings.push("Taxonomy refresh skipped");
  }

  let imageByType = speciesData.imageByType;

  if (refreshImages) {
    const images = await fetchImportedImages({
      scientificName: existing.scientificName ?? speciesData.scientificName,
      commonName: existing.name ?? speciesData.commonNames[0] ?? query,
    });
    imageByType = images.imageByType;
    imageSources.push(...images.sources);
    warnings.push(...images.warnings);
  } else {
    warnings.push("Image refresh skipped");
  }

  if (refreshTaxonomy) {
    updatedFiles.push(
      ...updateAnimalMetadataFiles({
        slug: input.slug,
        speciesData,
        imageByType: refreshImages ? imageByType : undefined,
        updateAnimalJson: true,
      }),
    );
  } else if (refreshImages) {
    updatedFiles.push(
      ...updateAnimalMetadataFiles({
        slug: input.slug,
        speciesData: {
          ...speciesData,
          commonNames: [existing.name ?? input.slug],
          scientificName: existing.scientificName ?? speciesData.scientificName,
        },
        imageByType,
        updateAnimalJson: false,
      }),
    );
  }

  return {
    slug: input.slug,
    name: existing.name ?? speciesData.commonNames[0] ?? input.slug,
    scientificName: existing.scientificName ?? speciesData.scientificName,
    gbifKey: speciesData.gbifKey,
    created: false,
    updated: true,
    contentDirectory,
    imageSources,
    createdFiles: updatedFiles,
    warnings,
  };
}

export function findAnimalSlugByScientificName(scientificName: string): string | null {
  const existing = listExistingScientificNames();
  return existing.get(scientificName.toLowerCase()) ?? null;
}

export function listImportedAnimalSlugs(): string[] {
  try {
    return getAllAnimals().map((animal) => animal.core.slug);
  } catch {
    return [...listExistingScientificNames().values()];
  }
}
