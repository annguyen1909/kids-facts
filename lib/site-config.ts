const defaultSiteUrl = "https://www.animalfacts.com";
const defaultContactEmail = "hello@animalfacts.com";

function readEnv(key: string) {
  return process.env[key]?.trim() || undefined;
}

export const siteConfig = {
  name: "Animal Facts",
  tagline: "Wildlife encyclopedia for every reader",
  description:
    "A photo-led wildlife encyclopedia for readers of every age — with habitat guides, diet trails, quick facts, FAQs, and clear science.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? defaultSiteUrl,
  locale: "en_US",
  organizationName: "Animal Facts",
  contactEmail: readEnv("NEXT_PUBLIC_CONTACT_EMAIL") || defaultContactEmail,
  socials: {
    x: "@animalfacts",
  },
  defaultOgImage: "/opengraph-image",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  adsenseClientId: readEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID"),
  adsenseSlotAnimal: readEnv("NEXT_PUBLIC_ADSENSE_SLOT_ANIMAL"),
  gaMeasurementId: readEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
  googleSiteVerification: readEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  legalLastUpdated: "2026-06-23",
};

export const revalidateInterval = 60 * 60 * 24;

export function hasThirdPartyScripts() {
  return Boolean(
    siteConfig.gaMeasurementId ||
      (siteConfig.adsEnabled && siteConfig.adsenseClientId),
  );
}
