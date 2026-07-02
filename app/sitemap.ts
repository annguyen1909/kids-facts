import type { MetadataRoute } from "next";
import { getAnimalCategorySlugs } from "@/lib/animal-categories";
import {
  getAllHubs,
  getPublishedAnimals,
  getHabitatClusters,
  getDietClusters,
  getFamilyClusters,
} from "@/lib/content";
import { getAbsoluteUrl } from "@/lib/images";
import { isIndexablePath } from "@/lib/routes";
import { siteFeatures } from "@/lib/site-features";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const animals = getPublishedAnimals();

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
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/privacy`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: new Date(siteConfig.legalLastUpdated),
    },
    {
      url: `${siteConfig.url}/terms`,
      changeFrequency: "monthly",
      priority: 0.35,
      lastModified: new Date(siteConfig.legalLastUpdated),
    },
  ];

  const trailIndexPages: MetadataRoute.Sitemap = siteFeatures.habitats
    ? [
        {
          url: `${siteConfig.url}/habitats`,
          changeFrequency: "weekly",
          priority: 0.85,
          lastModified: new Date(),
        },
      ]
    : [];

  const dietIndexPages: MetadataRoute.Sitemap = siteFeatures.diets
    ? [
        {
          url: `${siteConfig.url}/diets`,
          changeFrequency: "weekly",
          priority: 0.85,
          lastModified: new Date(),
        },
      ]
    : [];

  const animalPages: MetadataRoute.Sitemap = animals.flatMap((animal) => [
    {
      url: `${siteConfig.url}/animals/${animal.core.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: animal.core.updatedAt,
      images: animal.images.map((image) => getAbsoluteUrl(image.src)),
    },
  ]);

  const habitatHubPages: MetadataRoute.Sitemap = siteFeatures.habitats
    ? getHabitatClusters().map((cluster) => ({
        url: `${siteConfig.url}/habitats/${cluster.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.72,
        lastModified: cluster.updatedAt,
      }))
    : [];

  const dietHubPages: MetadataRoute.Sitemap = siteFeatures.diets
    ? getDietClusters().map((cluster) => ({
        url: `${siteConfig.url}/diets/${cluster.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.72,
        lastModified: cluster.updatedAt,
      }))
    : [];

  const familyHubPages: MetadataRoute.Sitemap = getFamilyClusters().map((cluster) => ({
    url: `${siteConfig.url}/families/${cluster.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    lastModified: cluster.updatedAt,
  }));

  const editorialHubPages: MetadataRoute.Sitemap = getAllHubs()
    .filter((hub) => {
      if (hub.type === "habitats" || hub.type === "diets" || hub.type === "families") {
        return false;
      }
      return isIndexablePath(`/${hub.type}/${hub.slug}`);
    })
    .map((hub) => ({
      url: `${siteConfig.url}/${hub.type}/${hub.slug}`,
      changeFrequency: "weekly" as const,
      priority: hub.type === "families" ? 0.7 : 0.68,
      lastModified: hub.updatedAt,
    }));

  const categoryPages: MetadataRoute.Sitemap = getAnimalCategorySlugs().map((slug) => ({
    url: `${siteConfig.url}/animals/${slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...trailIndexPages,
    ...dietIndexPages,
    ...categoryPages,
    ...animalPages,
    ...habitatHubPages,
    ...dietHubPages,
    ...familyHubPages,
    ...editorialHubPages,
  ];
}
