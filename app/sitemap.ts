import type { MetadataRoute } from "next";
import { getAllAnimals, getAllComparisons, getAllHubs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const animals = getAllAnimals();
  const comparisons = getAllComparisons();
  const hubs = getAllHubs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/animals`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
  ];

  const animalPages: MetadataRoute.Sitemap = animals.flatMap((animal) => [
    {
      url: `${siteConfig.url}/animals/${animal.core.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: animal.core.updatedAt,
      images: animal.images.map((image) => image.src),
    },
    ...animal.supportingPages.map((page) => ({
      url: `${siteConfig.url}/animals/${animal.core.slug}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: page.updatedAt,
    })),
    ...animal.images.map((image) => ({
      url: `${siteConfig.url}/animals/${animal.core.slug}/images/${image.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.45,
      lastModified: image.updatedAt,
    })),
  ]);

  const comparisonPages: MetadataRoute.Sitemap = comparisons.flatMap(
    ({ comparison, pages }) => [
      {
        url: `${siteConfig.url}/animals/compare/${comparison.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        lastModified: comparison.updatedAt,
      },
      ...pages
        .filter((page) => page.slug !== "overview")
        .map((page) => ({
          url: `${siteConfig.url}/animals/compare/${comparison.slug}/${page.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.55,
          lastModified: page.updatedAt,
        })),
    ],
  );

  const hubPages: MetadataRoute.Sitemap = hubs.map((hub) => ({
    url: `${siteConfig.url}/${hub.type}/${hub.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: hub.updatedAt,
  }));

  return [...staticPages, ...animalPages, ...comparisonPages, ...hubPages];
}
