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
    <div className="group overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)] p-6 sm:p-8 shadow-xl ring-1 ring-[var(--line)] transition-all hover:shadow-2xl relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--forest)]/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forest-deep)] drop-shadow-sm">
          Classification
        </h3>
        <span className="inline-flex rounded-full bg-[var(--forest)]/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--line)] backdrop-blur-md">
          Scientific Taxonomy
        </span>
      </div>

      <dl className="relative z-10 divide-y divide-[var(--line)]">
        {Object.entries(taxonomy).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-[var(--foreground)]/[0.02]">
            <dt className="shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
              {taxonomyLabels[key] ?? key}
            </dt>
            <dd className="text-right font-serif text-lg font-bold text-[var(--foreground)] tracking-wide group-hover:text-[var(--sky-deep)] transition-colors">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
