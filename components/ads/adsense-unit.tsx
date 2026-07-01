"use client";

import { useEffect } from "react";
import { useConsentStatus } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSenseUnit({
  slot,
  format = "auto",
  className,
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}) {
  const consent = useConsentStatus();
  const canShowAds =
    consent === "accepted" && siteConfig.adsEnabled && Boolean(siteConfig.adsenseClientId);

  useEffect(() => {
    if (!canShowAds) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or script load failures — ignore.
    }
  }, [canShowAds]);

  if (!canShowAds || !siteConfig.adsenseClientId) return null;

  return (
    <ins
      className={`adsbygoogle block overflow-hidden ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={siteConfig.adsenseClientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
