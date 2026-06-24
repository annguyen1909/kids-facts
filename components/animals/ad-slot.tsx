import { AdSenseUnit } from "@/components/ads/adsense-unit";
import { siteConfig } from "@/lib/site-config";

export function AdSlot({
  label,
  slot = siteConfig.adsenseSlotAnimal,
}: {
  label: string;
  slot?: string;
}) {
  if (!siteConfig.adsEnabled) return null;

  if (siteConfig.adsenseClientId && slot) {
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
      className="flex min-h-32 items-center justify-center rounded-[1.25rem] border border-dashed border-[var(--line)] bg-[rgba(122,168,196,0.08)] text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]"
    >
      {label}
    </aside>
  );
}
