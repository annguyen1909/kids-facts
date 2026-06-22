import type { AnimalImageKind } from "@/lib/types";

export type ImportedTaxonomy = {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
};

export type ImportedImage = {
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  attribution: string;
  attributionHtml?: string;
  source: "Wikimedia Commons" | "iNaturalist" | "Wikipedia";
  sourceUrl: string;
  creatorName: string;
  creatorUrl?: string;
  licenseName: string;
  licenseUrl: string;
  requiresAttribution: boolean;
};

export type ImportedSpeciesData = {
  gbifKey: number;
  scientificName: string;
  commonNames: string[];
  taxonomy: ImportedTaxonomy;
  classificationLabels: string[];
  countries: string[];
  continents: string[];
  habitats: string[];
  biomes: string[];
  conservationStatus?: string;
  referenceSummary?: string;
  heroImage?: ImportedImage;
  imageByType: Partial<Record<AnimalImageKind, ImportedImage>>;
};

export type ImportAnimalInput = {
  query: string;
  slug?: string;
  force?: boolean;
  skipImages?: boolean;
};

export type ImportAnimalResult = {
  slug: string;
  name: string;
  scientificName: string;
  gbifKey: number;
  created: boolean;
  updated: boolean;
  contentDirectory: string;
  imageSources: string[];
  createdFiles: string[];
  warnings: string[];
};

export type UpdateAnimalInput = {
  slug: string;
  refreshImages?: boolean;
  refreshTaxonomy?: boolean;
};

export type GbifSpeciesMatch = {
  usageKey?: number;
  scientificName?: string;
  canonicalName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  rank?: string;
  taxonomicStatus?: string;
  vernacularName?: string;
  matchType?: string;
  confidence?: number;
};

export type GbifVernacularName = {
  vernacularName: string;
  language?: string;
  preferred?: boolean;
};

export type WikimediaImageCandidate = {
  title: string;
  pageUrl: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  mime?: string;
  description?: string;
  artist?: string;
  licenseName?: string;
  licenseUrl?: string;
  credit?: string;
};
