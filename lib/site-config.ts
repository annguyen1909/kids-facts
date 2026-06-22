const defaultSiteUrl = "https://www.animalfactsforkids.com";

export const siteConfig = {
  name: "Animal Facts for Kids",
  description:
    "A playful wildlife encyclopedia for children, families, and teachers with photos, fun facts, FAQs, and easy-to-read science.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? defaultSiteUrl,
  locale: "en_US",
  organizationName: "Animal Facts for Kids",
  socials: {
    x: "@animalfactskids",
  },
  defaultOgImage: "/opengraph-image",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
};

export const revalidateInterval = 60 * 60 * 24;
