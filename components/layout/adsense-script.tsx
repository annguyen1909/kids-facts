import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

export function AdSenseScript() {
  if (!siteConfig.adsEnabled || !siteConfig.adsenseClientId) return null;

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
