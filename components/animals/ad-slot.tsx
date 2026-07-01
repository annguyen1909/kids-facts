"use client";

import Link from "next/link";
import { AdSenseUnit } from "@/components/ads/adsense-unit";
import { useConsentStatus } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

export function AdSlot({
  label,
  slot = siteConfig.adsenseSlotAnimal,
}: {
  label: string;
  slot?: string;
}) {
  const consent = useConsentStatus();

  if (!siteConfig.adsEnabled) return null;
  if (consent === null) return null;
  if (process.env.NODE_ENV === "production" && consent !== "accepted") return null;

  if (!siteConfig.adsenseClientId || !slot) {
    if (process.env.NODE_ENV === "production") return null;

    return (
      <aside
        aria-label={`${label} ad slot`}
        className="flex min-h-32 items-center justify-center rounded-[1.25rem] border border-dashed border-[var(--line)] bg-[rgba(122,168,196,0.08)] px-4 text-center text-sm font-semibold text-[var(--muted)]"
      >
        Ad slot is enabled but not fully configured.
      </aside>
    );
  }

  if (siteConfig.adsenseClientId && slot && consent === "accepted") {
    return (
      <aside
        aria-label={`${label} advertisement`}
        className="overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-white px-3 py-4 shadow-[var(--shadow)]"
      >
        <AdSenseUnit slot={slot} className="min-h-32" />
      </aside>
    );
  }

  return (
    <aside
      aria-label={`${label} ad slot`}
      className="flex min-h-32 items-center justify-center rounded-[1.25rem] border border-dashed border-[var(--line)] bg-[rgba(122,168,196,0.08)] px-4 text-center text-sm font-semibold text-[var(--muted)]"
    >
      {consent === "declined" ? (
        <span>
          Ads are off for this visit. Change this in{" "}
          <Link href="/privacy#privacy-settings" className="underline underline-offset-4">
            Privacy settings
          </Link>
          .
        </span>
      ) : (
        <span>
          Ads load only after consent. Manage this in{" "}
          <Link href="/privacy#privacy-settings" className="underline underline-offset-4">
            Privacy settings
          </Link>
          .
        </span>
      )}
    </aside>
  );
}
