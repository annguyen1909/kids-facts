import { pickAnimalImage, getAnimalHeroImage } from "@/lib/animal-images";
import {
  coreImageSlug,
  matchSectionConfig,
  splitMdxSections,
} from "@/lib/core-article";
import type { AnimalImage, AnimalRecord } from "@/lib/types";

export const MIN_GALLERY_IMAGES = 9;

/** Hero is listed in gallery JSON but rendered separately; minimum unique gallery photos on the page. */
export const MIN_GALLERY_PAGE_IMAGES = MIN_GALLERY_IMAGES - 1;

export type AnimalPageImagePlan = {
  hero: AnimalImage;
  galleryImages: AnimalImage[];
  sectionImages: Record<string, AnimalImage>;
};

function resolveGalleryImages(
  animal: AnimalRecord,
  gallerySlug: string,
  hero: AnimalImage,
): AnimalImage[] {
  const gallery =
    animal.galleries.find((entry) => entry.slug === gallerySlug) ?? animal.galleries[0];
  const images: AnimalImage[] = [];
  const seenSrc = new Set<string>();

  for (const slug of gallery?.imageSlugs ?? []) {
    const image = animal.images.find((entry) => entry.slug === slug);
    if (
      !image ||
      seenSrc.has(image.src) ||
      image.slug === hero.slug ||
      image.src === hero.src
    ) {
      continue;
    }
    images.push(image);
    seenSrc.add(image.src);
  }

  return images;
}

function pickCoreSectionImage(
  animal: AnimalRecord,
  title: string,
  gallerySrcs: Set<string>,
  reservedCoreSrcs: Set<string>,
): AnimalImage | undefined {
  const config = matchSectionConfig(title);
  if (!config.imageType || config.imageType === "hero" || !config.coreRole) return undefined;

  const slug = coreImageSlug(animal.core.slug, config.coreRole);
  const exact = animal.images.find(
    (image) =>
      image.slug === slug &&
      image.featuredOnPages.includes("core") &&
      !gallerySrcs.has(image.src) &&
      !reservedCoreSrcs.has(image.src) &&
      !reservedCoreSrcs.has(image.slug),
  );
  if (exact) return exact;

  return pickAnimalImage(animal, {
    imageType: config.imageType,
    featuredOnPage: "core",
    excludeSlugs: [...reservedCoreSrcs],
    excludeSrcs: [...gallerySrcs, ...reservedCoreSrcs],
  });
}

export function planAnimalPageImages(
  animal: AnimalRecord,
  coreBody: string,
  gallerySlug = "gallery",
): AnimalPageImagePlan {
  const hero = getAnimalHeroImage(animal);
  const galleryImages = resolveGalleryImages(animal, gallerySlug, hero);
  const gallerySrcs = new Set(galleryImages.map((image) => image.src));
  gallerySrcs.add(hero.src);

  const sectionImages: Record<string, AnimalImage> = {};
  const reservedCoreSrcs = new Set<string>();

  const sections = splitMdxSections(coreBody);
  const [, ...topicSections] = sections;

  for (const section of topicSections) {
    const image = pickCoreSectionImage(animal, section.title, gallerySrcs, reservedCoreSrcs);
    if (!image) continue;
    sectionImages[section.title] = image;
    reservedCoreSrcs.add(image.slug);
    reservedCoreSrcs.add(image.src);
  }

  return { hero, galleryImages, sectionImages };
}

export function getGallerySrcSet(animal: AnimalRecord, gallerySlug = "gallery"): Set<string> {
  const hero = getAnimalHeroImage(animal);
  return new Set(resolveGalleryImages(animal, gallerySlug, hero).map((image) => image.src));
}
