export type AnimalImageKind =
  | "hero"
  | "habitat"
  | "diet"
  | "baby"
  | "family"
  | "range"
  | "size"
  | "closeup"
  | "fun-fact"
  | "gallery";

export type GalleryTopicSlug =
  | "hero"
  | "habitat"
  | "diet"
  | "baby"
  | "family"
  | "range"
  | "size"
  | "closeup"
  | "fun-fact";

export type ComparisonPageSlug =
  | "overview"
  | "diet"
  | "habitat"
  | "size"
  | "behavior";

export type HubType =
  | "habitats"
  | "diets"
  | "families"
  | "conservation-status"
  | "topics";

export type AnimalImage = {
  id: string;
  animalSlug: string;
  slug: string;
  fileName: string;
  originalFileName?: string;
  src: string;
  srcSet?: {
    original: string;
    web1600: string;
    web1200: string;
    web800: string;
    thumbnail400: string;
  };
  width: number;
  height: number;
  alt: string;
  caption: string;
  attributionText?: string;
  attributionHtml?: string;
  source?: {
    sourceName: "Wikimedia Commons" | "Unsplash" | "Pexels" | "iNaturalist" | "Wikipedia";
    sourceUrl: string;
    creatorName: string;
    creatorUrl?: string;
    licenseName: string;
    licenseUrl: string;
    requiresAttribution: boolean;
    downloadedAt: string;
    reviewedBy: string;
  };
  imageType: AnimalImageKind;
  galleryTopics: GalleryTopicSlug[];
  featuredOnPages: Array<"core" | "gallery">;
  location: string;
  acquisitionNotes?: string;
  updatedAt: string;
};

export type AnimalFaq = {
  question: string;
  answer: string;
};

export type AnimalCoreRecord = {
  id: string;
  slug: string;
  name: string;
  commonNames: string[];
  scientificName: string;
  summary: string;
  heroTitle: string;
  metaTitle: string;
  metaDescription: string;
  searchIntents: string[];
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  classificationLabels: string[];
  habitat: string;
  continents: string[];
  countries: string[];
  biomes: string[];
  dietType: string;
  dietItems: string[];
  lifespan: {
    wild: string;
    captivity?: string;
  };
  size: {
    lengthMin: string;
    lengthMax: string;
    heightMin?: string;
    heightMax?: string;
    wingspanMin?: string;
    wingspanMax?: string;
  };
  weight: {
    min: string;
    max: string;
  };
  speed?: string;
  conservationStatus: string;
  populationTrend: string;
  behaviors: string[];
  adaptations: string[];
  predators: string[];
  prey: string[];
  reproduction: {
    offspringName: string;
    gestationOrIncubation: string;
    offspringCount: string;
  };
  funFacts: string[];
  faq: AnimalFaq[];
  relatedAnimals: string[];
  comparisonCandidates: string[];
  galleryIds: string[];
  updatedAt: string;
  publishedAt: string;
};

export type AnimalGalleryRecord = {
  id: string;
  animalSlug: string;
  galleryType: "main" | "topic";
  slug: "gallery" | GalleryTopicSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  imageSlugs: string[];
  updatedAt: string;
};

export type ComparisonRecord = {
  id: string;
  slug: string;
  animalA: string;
  animalB: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  comparisonCandidates: ComparisonPageSlug[];
  updatedAt: string;
};

export type ComparisonPageRecord = {
  id: string;
  comparisonSlug: string;
  slug: ComparisonPageSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  body: string;
  updatedAt: string;
};

export type HubRecord = {
  id: string;
  type: HubType;
  slug: string;
  name: string;
  description: string;
  animalSlugs: string[];
  featuredPagePaths: string[];
  body: string;
  updatedAt: string;
};

export type AnimalRecord = {
  core: AnimalCoreRecord;
  coreBody: string;
  galleries: AnimalGalleryRecord[];
  images: AnimalImage[];
};

export type ComparisonResolvedRecord = {
  comparison: ComparisonRecord;
  pages: ComparisonPageRecord[];
};

export type ResolvedEntity =
  | { type: "animal"; animal: AnimalRecord }
  | {
      type: "gallery";
      animal: AnimalRecord;
      gallery: AnimalGalleryRecord;
      images: AnimalImage[];
    }
  | {
      type: "image";
      animal: AnimalRecord;
      image: AnimalImage;
    }
  | {
      type: "comparison";
      comparison: ComparisonRecord;
      page: ComparisonPageRecord;
      animalA: AnimalRecord;
      animalB: AnimalRecord;
    }
  | {
      type: "hub";
      hub: HubRecord;
      animals: AnimalRecord[];
    };
