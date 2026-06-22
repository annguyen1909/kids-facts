import type {
  AnimalImage,
  AnimalRecord,
  ComparisonRecord,
  HubRecord,
} from "@/lib/types";
import { getAbsoluteUrl, getAnimalPrimaryImage } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";

type ListItem = { name: string; item: string };

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organizationName,
    url: siteConfig.url,
    logo: getAbsoluteUrl("/brand/logo-mark.svg"),
    sameAs: [`https://x.com/${siteConfig.socials.x.replace("@", "")}`],
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
  };
}

export function buildImageSchema(image: AnimalImage) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: image.src,
    url: image.src,
    caption: image.caption,
    description: image.alt,
    width: image.width,
    height: image.height,
  };
}

export function buildImageGallerySchema(
  animal: AnimalRecord,
  images: AnimalImage[],
  intro?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${animal.core.name} Photo Gallery`,
    description: intro ?? `Wildlife photos of ${animal.core.name} for kids.`,
    about: {
      "@type": "Thing",
      name: animal.core.name,
    },
    associatedMedia: images.map((image) => ({
      "@type": "ImageObject",
      contentUrl: image.src,
      caption: image.caption,
      description: image.alt,
      width: image.width,
      height: image.height,
    })),
  };
}

export function buildBreadcrumbSchema(items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildAnimalArticleSchema(
  animal: AnimalRecord,
  headline: string,
  path: string,
  description: string,
) {
  const primaryImage = getAnimalPrimaryImage(animal);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    about: animal.core.name,
    mainEntityOfPage: getAbsoluteUrl(path),
    author: {
      "@type": "Organization",
      name: siteConfig.organizationName,
    },
    datePublished: animal.core.publishedAt,
    dateModified: animal.core.updatedAt,
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/brand/logo-mark.svg"),
      },
    },
    image: animal.images.map((image) => image.src),
    thumbnailUrl: primaryImage.src,
    keywords: [
      animal.core.name,
      animal.core.scientificName,
      ...animal.core.searchIntents,
    ],
  };
}

export function buildCollectionPageSchema(items: ListItem[], description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Animals",
    description,
    url: getAbsoluteUrl("/animals"),
    hasPart: items.map((item) => ({
      "@type": "ListItem",
      name: item.name,
      url: item.item,
    })),
  };
}

export function buildComparisonSchema(
  comparison: ComparisonRecord,
  animalA: AnimalRecord,
  animalB: AnimalRecord,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.summary,
    mainEntityOfPage: getAbsoluteUrl(path),
    about: [
      { "@type": "Thing", name: animalA.core.name },
      { "@type": "Thing", name: animalB.core.name },
    ],
    dateModified: comparison.updatedAt,
    image: [getAnimalPrimaryImage(animalA).src, getAnimalPrimaryImage(animalB).src],
  };
}

export function buildFaqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHubSchema(hub: HubRecord, items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.name,
    description: hub.description,
    url: getAbsoluteUrl(`/${hub.type}/${hub.slug}`),
    hasPart: items.map((item) => ({
      "@type": "ListItem",
      name: item.name,
      url: item.item,
    })),
  };
}
