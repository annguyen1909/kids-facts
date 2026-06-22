import { siteConfig } from "@/lib/site-config";

export function AdSlot({ label }: { label: string }) {
  if (!siteConfig.adsEnabled) return null;

  return (
    <aside
      aria-label={`${label} ad slot`}
      className="flex min-h-32 items-center justify-center rounded-[1.25rem] border border-dashed border-[var(--line)] bg-[rgba(122,168,196,0.08)] text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]"
    >
      {label}
    </aside>
  );
}
