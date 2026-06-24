import type { AnimalImage, AnimalImageKind, AnimalRecord } from "@/lib/types";

type PickImageOptions = {
  imageType?: AnimalImageKind;
  slug?: string;
  slugIncludes?: string;
  excludeImageTypes?: AnimalImageKind[];
  featuredOnPage?: "core" | "gallery";
  excludeSlugs?: string[];
  excludeSrcs?: string[];
};

export function pickAnimalImage(
  animal: AnimalRecord,
  options: PickImageOptions,
): AnimalImage | undefined {
  const {
    imageType,
    slug,
    slugIncludes,
    excludeImageTypes = [],
    featuredOnPage,
    excludeSlugs = [],
    excludeSrcs = [],
  } = options;

  const excludedSlugSet = new Set(excludeSlugs);
  const excludedSrcSet = new Set(excludeSrcs);

  let pool = animal.images.filter(
    (image) =>
      !excludeImageTypes.includes(image.imageType) &&
      !excludedSlugSet.has(image.slug) &&
      !excludedSrcSet.has(image.src),
  );

  if (slug) {
    const exact = pool.find((image) => image.slug === slug);
    if (exact) return exact;
  }

  if (featuredOnPage) {
    const onPage = pool.filter((image) => image.featuredOnPages.includes(featuredOnPage));
    if (onPage.length) pool = onPage;
  }

  if (imageType) {
    pool = pool.filter((image) => image.imageType === imageType);
  }

  if (slugIncludes) {
    const preferred = pool.find((image) => image.slug.includes(slugIncludes));
    if (preferred) return preferred;
  }

  return pool[0];
}

export function getAnimalHeroImage(animal: AnimalRecord): AnimalImage {
  return (
    pickAnimalImage(animal, { imageType: "hero" }) ??
    animal.images[0]
  );
}

/** @deprecated Use planAnimalPageImages from lib/animal-page-images instead. */
export function getAnimalPageGalleryImages(
  animal: AnimalRecord,
  gallerySlug = "gallery",
): AnimalImage[] {
  const hero = getAnimalHeroImage(animal);
  const reserved = new Set([hero.slug, hero.src]);

  const gallery =
    animal.galleries.find((entry) => entry.slug === gallerySlug) ?? animal.galleries[0];
  if (!gallery) return [];

  const images: AnimalImage[] = [];

  for (const slug of gallery.imageSlugs) {
    const image = animal.images.find((entry) => entry.slug === slug);
    if (!image || reserved.has(image.slug) || reserved.has(image.src)) continue;
    images.push(image);
    reserved.add(image.slug);
    reserved.add(image.src);
  }

  return images;
}
