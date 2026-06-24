"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!siteConfig.adsEnabled || !siteConfig.adsenseClientId) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or script load failures — ignore.
    }
  }, []);

  if (!siteConfig.adsEnabled || !siteConfig.adsenseClientId) return null;

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
