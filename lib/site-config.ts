const defaultSiteUrl = "https://www.wildlifedb.com";
const defaultContactEmail = "nguyentruongan0919@gmail.com";

function readEnv(key: string) {
  return process.env[key]?.trim() || undefined;
}

function normalizeAdsensePublisherId(clientId?: string) {
  if (!clientId) return undefined;

  return clientId.startsWith("ca-") ? clientId.slice(3) : clientId;
}

export const siteConfig = {
  name: "Wildlife Encyclopedia",
  tagline: "Wildlife encyclopedia for every reader",
  description:
    "A photo-led wildlife encyclopedia for readers of every age — with habitat guides, diet trails, quick facts, FAQs, and clear science.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? defaultSiteUrl,
  locale: "en_US",
  organizationName: "Wildlife Encyclopedia",
  contactEmail: readEnv("NEXT_PUBLIC_CONTACT_EMAIL") || defaultContactEmail,
  socials: {
    x: "@wildlifedb",
  },
  defaultOgImage: "/opengraph-image",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  adsenseClientId: readEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID"),
  adsensePublisherId: normalizeAdsensePublisherId(
    readEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID"),
  ),
  adsenseSlotAnimal: readEnv("NEXT_PUBLIC_ADSENSE_SLOT_ANIMAL"),
  gaMeasurementId: "G-6LMM8685GF",
  googleSiteVerification: "kOQHlVHKaVzwQicjwvBl1Pe7X6KHyRT85nwkMw-AhJk",
  legalLastUpdated: "2026-06-23",
};

export const revalidateInterval = 60 * 60 * 24;

export function hasThirdPartyScripts() {
  return Boolean(
    siteConfig.gaMeasurementId ||
      (siteConfig.adsEnabled && siteConfig.adsenseClientId),
  );
}
