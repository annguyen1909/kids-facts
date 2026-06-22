import type { AnimalImage, AnimalImageKind, AnimalRecord } from "@/lib/types";

type PickImageOptions = {
  imageType?: AnimalImageKind;
  slug?: string;
  slugIncludes?: string;
  excludeImageTypes?: AnimalImageKind[];
};

export function pickAnimalImage(
  animal: AnimalRecord,
  options: PickImageOptions,
): AnimalImage | undefined {
  const { imageType, slug, slugIncludes, excludeImageTypes = [] } = options;

  let pool = animal.images.filter(
    (image) => !excludeImageTypes.includes(image.imageType),
  );

  if (slug) {
    const exact = pool.find((image) => image.slug === slug);
    if (exact) return exact;
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
