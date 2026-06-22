import type { AnimalCoreRecord } from "@/lib/types";

const taxonomyLabels: Record<string, string> = {
  kingdom: "Kingdom",
  phylum: "Phylum",
  class: "Class",
  order: "Order",
  family: "Family",
  genus: "Genus",
  species: "Species",
};

export function TaxonomyPanel({ taxonomy }: { taxonomy: AnimalCoreRecord["taxonomy"] }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/95 p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
      <p className="eyebrow">Scientific classification</p>
      <dl className="mt-4 divide-y divide-[var(--line)]">
        {Object.entries(taxonomy).map(([key, value]) => (
          <div key={key} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
              {taxonomyLabels[key] ?? key}
            </dt>
            <dd className="text-right text-sm font-bold text-[var(--forest-deep)] sm:text-base">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
