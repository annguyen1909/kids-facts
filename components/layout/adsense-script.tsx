"use client";

import Script from "next/script";
import { useConsentStatus } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

export function AdSenseScript() {
  const consent = useConsentStatus();

  if (!siteConfig.adsEnabled || !siteConfig.adsenseClientId || consent !== "accepted") {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`}
      strategy="afterInteractive"
    />
  );
}
