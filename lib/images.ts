import type { AnimalImage, AnimalRecord } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";
import { getAnimalHeroImage as resolveHeroImage } from "@/lib/animal-images";

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
    const filename = decodeURIComponent(encodedFilename);
    const hashPath = pathAfterCommons.slice(0, -1);

    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hashPath.join("/")}/${encodedFilename}/${maxWidth}px-${filename}`;
  } catch {
    return src;
  }
}

export function isWikimediaCommonsUrl(src: string): boolean {
  return src.includes("upload.wikimedia.org/wikipedia/commons/");
}

export function getAnimalHeroImage(animal: AnimalRecord): AnimalImage {
  return resolveHeroImage(animal);
}

export function getAnimalPrimaryImage(animal: AnimalRecord): AnimalImage {
  return getAnimalHeroImage(animal);
}

/** Props for next/image — thumb URL + bypass optimizer for Wikimedia hotlinks. */
export function getAnimalImageForDisplay(image: Pick<AnimalImage, "src" | "alt">) {
  return {
    src: getDisplayImageSrc(image.src),
    alt: image.alt,
    unoptimized: isWikimediaCommonsUrl(image.src),
  };
}

export function getImageSitemapEntries(animals: AnimalRecord[]) {
  return animals.flatMap((animal) =>
    animal.images.map((image) => ({
      pageUrl: getAbsoluteUrl(`/animals/${animal.core.slug}`),
      loc: image.src,
      title: `${animal.core.name} photo`,
      caption: image.caption,
    })),
  );
}
