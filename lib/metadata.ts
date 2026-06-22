import type { Metadata } from "next";
import type {
  AnimalRecord,
  AnimalSupportingPageRecord,
  ComparisonPageRecord,
  ComparisonRecord,
  HubRecord,
} from "@/lib/types";
import { getAbsoluteUrl, getAnimalPrimaryImage } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";

export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      images: [
        {
          url: getAbsoluteUrl(siteConfig.defaultOgImage),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [getAbsoluteUrl(siteConfig.defaultOgImage)],
    },
  };
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const imageUrl = getAbsoluteUrl(input.image ?? siteConfig.defaultOgImage);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
    },
    openGraph: {
      type: "website",
      title: input.title,
      description: input.description,
      url: getAbsoluteUrl(input.path),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
  };
}

export function buildAnimalMetadata(
  animal: AnimalRecord,
  path: string,
  override?: {
    title?: string;
    description?: string;
  },
): Metadata {
  const image = getAnimalPrimaryImage(animal);
  const title = override?.title ?? animal.core.metaTitle;
  const description = override?.description ?? animal.core.metaDescription;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: getAbsoluteUrl(path),
      publishedTime: animal.core.publishedAt,
      modifiedTime: animal.core.updatedAt,
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.src],
    },
  };
}

export function buildSupportingPageMetadata(
  animal: AnimalRecord,
  page: AnimalSupportingPageRecord,
): Metadata {
  return buildAnimalMetadata(animal, `/animals/${animal.core.slug}/${page.slug}`, {
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export function buildComparisonMetadata(
  comparison: ComparisonRecord,
  page: ComparisonPageRecord,
): Metadata {
  return buildPageMetadata({
    title: page.metaTitle || comparison.metaTitle,
    description: page.metaDescription || comparison.metaDescription,
    path:
      page.slug === "overview"
        ? `/animals/compare/${comparison.slug}`
        : `/animals/compare/${comparison.slug}/${page.slug}`,
  });
}

export function buildHubMetadata(hub: HubRecord): Metadata {
  return buildPageMetadata({
    title: hub.name,
    description: hub.description,
    path: `/${hub.type}/${hub.slug}`,
  });
}
