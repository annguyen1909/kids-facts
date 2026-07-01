import type { AnimalImage, AnimalRecord } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";
import { getAnimalPrimaryImage as resolvePrimaryImage } from "@/lib/animal-images";

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/**
 * Wikimedia full-size URLs often rate-limit hotlinking. Use a stable thumb URL for display.
 *
 * Original: /wikipedia/commons/c/ca/Ailurus_fulgens_eating.JPG
 * Thumb:    /wikipedia/commons/thumb/c/ca/Ailurus_fulgens_eating.JPG/1600px-Ailurus_fulgens_eating.JPG
 */
export function getDisplayImageSrc(src: string, maxWidth = 1280): string {
  if (!src.includes("upload.wikimedia.org/wikipedia/commons/")) {
    return src;
  }

  if (src.includes("/thumb/")) {
    return src;
  }

  return toWikimediaThumbUrl(src, maxWidth);
}

export function toWikimediaThumbUrl(src: string, maxWidth = 1280): string {
  try {
    const url = new URL(src);
    const parts = url.pathname.split("/").filter(Boolean);
    const commonsIndex = parts.indexOf("commons");

    if (commonsIndex === -1 || parts.length < commonsIndex + 3) {
      return src;
    }

    const pathAfterCommons = parts.slice(commonsIndex + 1);
    const encodedFilename = pathAfterCommons[pathAfterCommons.length - 1];
    const hashPath = pathAfterCommons.slice(0, -1);

    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hashPath.join("/")}/${encodedFilename}/${maxWidth}px-${encodedFilename}`;
  } catch {
    return src;
  }
}

export function isLocalImagePath(src: string): boolean {
  return src.startsWith("/images/");
}

export function isWikimediaCommonsUrl(src: string): boolean {
  return src.includes("upload.wikimedia.org/wikipedia/commons/");
}

type AnimalWithImages = Pick<AnimalRecord, "images">;

export function getAnimalHeroImage(animal: AnimalWithImages): AnimalImage {
  return resolvePrimaryImage(animal);
}

export function getAnimalPrimaryImage(animal: AnimalWithImages): AnimalImage {
  return resolvePrimaryImage(animal);
}

/** Landscape cluster cards (5:3). Portrait images need top anchoring under object-cover. */
export const HUB_CLUSTER_CARD_ASPECT = 5 / 3;

/** Compact animal cards (4:3). */
export const ANIMAL_CARD_ASPECT = 4 / 3;

export function getCoverObjectPosition(
  image: Pick<AnimalImage, "width" | "height" | "objectPosition">,
  frameAspect = HUB_CLUSTER_CARD_ASPECT,
): string | undefined {
  if (image.objectPosition) return image.objectPosition;

  if (image.width > 0 && image.height > 0) {
    const imageAspect = image.width / image.height;
    if (imageAspect < frameAspect) {
      return "top center";
    }
  }

  return undefined;
}

/** Props for next/image — local WebP is pre-optimized; skip /_next/image cache so replacements show immediately. */
export function getAnimalImageForDisplay(
  image: Pick<AnimalImage, "src" | "alt"> &
    Partial<Pick<AnimalImage, "objectPosition" | "updatedAt">>,
) {
  const baseSrc = getDisplayImageSrc(image.src);
  const src =
    isLocalImagePath(baseSrc) && image.updatedAt
      ? `${baseSrc}?v=${encodeURIComponent(image.updatedAt)}`
      : baseSrc;

  return {
    src,
    alt: image.alt,
    unoptimized: isLocalImagePath(image.src) || isWikimediaCommonsUrl(image.src),
    objectPosition: image.objectPosition,
  };
}

export function getImageSitemapEntries(animals: AnimalRecord[]) {
  return animals.flatMap((animal) =>
    animal.images.map((image) => ({
      pageUrl: getAbsoluteUrl(`/animals/${animal.core.slug}`),
      loc: isLocalImagePath(image.src) ? getAbsoluteUrl(image.src) : image.src,
      title: `${animal.core.name} photo`,
      caption: image.caption,
    })),
  );
}
