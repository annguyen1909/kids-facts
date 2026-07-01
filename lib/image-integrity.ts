import { MIN_GALLERY_IMAGES } from "@/lib/animal-page-images";
import type { AnimalImage, AnimalRecord } from "@/lib/types";
import { resolveCommonsFileTitle } from "@/lib/wikimedia-image";

export type ImageIntegrityIssue = {
  scope: string;
  message: string;
};

function isMainGallery(gallery: AnimalRecord["galleries"][number]) {
  return gallery.galleryType === "main" || gallery.slug === "gallery";
}

function resolveMainGallerySrcs(animal: AnimalRecord): Set<string> {
  const mainGallery =
    animal.galleries.find((gallery) => isMainGallery(gallery)) ?? animal.galleries[0];

  return new Set(
    (mainGallery?.imageSlugs ?? [])
      .map((imageSlug) => animal.images.find((entry) => entry.slug === imageSlug)?.src)
      .filter((src): src is string => Boolean(src)),
  );
}

export function validateAnimalImageIntegrity(animal: AnimalRecord): ImageIntegrityIssue[] {
  const issues: ImageIntegrityIssue[] = [];
  const scope = `animals/${animal.core.slug}`;
  const gallerySrcs = resolveMainGallerySrcs(animal);
  const mainGallery =
    animal.galleries.find((gallery) => isMainGallery(gallery)) ?? animal.galleries[0];

  const resolvedGalleryImages = (mainGallery?.imageSlugs ?? [])
    .map((imageSlug) => animal.images.find((image) => image.slug === imageSlug))
    .filter((image): image is AnimalImage => Boolean(image));
  const uniqueGallerySrcs = new Set(resolvedGalleryImages.map((image) => image.src));

  if (resolvedGalleryImages.length < MIN_GALLERY_IMAGES) {
    issues.push({
      scope: `${scope}/gallery/${mainGallery?.slug ?? "gallery"}`,
      message: `gallery resolves to ${resolvedGalleryImages.length} images; requires at least ${MIN_GALLERY_IMAGES}`,
    });
  }

  if (uniqueGallerySrcs.size < resolvedGalleryImages.length) {
    issues.push({
      scope: `${scope}/gallery/${mainGallery?.slug ?? "gallery"}`,
      message: "gallery contains duplicate image src values",
    });
  }

  for (const image of animal.images) {
    const imageScope = `${scope}/images/${image.slug}`;

    const sourceName = image.source?.sourceName;
    const requiresCommonsTitle =
      !sourceName || sourceName === "Wikimedia Commons" || sourceName === "Wikipedia";

    if (
      requiresCommonsTitle &&
      !resolveCommonsFileTitle({ sourceUrl: image.source?.sourceUrl, src: image.src })
    ) {
      issues.push({
        scope: imageScope,
        message: "Wikimedia image is missing a resolvable Commons file title",
      });
    }

    if (image.featuredOnPages.includes("core") && gallerySrcs.has(image.src)) {
      issues.push({
        scope: imageScope,
        message: "core image src duplicates a gallery image",
      });
    }
  }

  return issues;
}

export function assertAnimalImageIntegrity(animal: AnimalRecord) {
  const issues = validateAnimalImageIntegrity(animal);
  if (issues.length === 0) return;

  const details = issues.map((issue) => `${issue.scope}: ${issue.message}`).join("\n");
  throw new Error(`Image integrity check failed for ${animal.core.slug}:\n${details}`);
}
