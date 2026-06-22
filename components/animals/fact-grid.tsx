import type { AnimalRecord } from "@/lib/types";

export function FactGrid({ animal }: { animal: AnimalRecord }) {
  const facts = [
    { label: "Class", value: animal.core.taxonomy.class },
    { label: "Habitats", value: animal.core.habitats.join(", ") },
    { label: "Diet", value: animal.core.dietType },
    { label: "Lifespan", value: animal.core.lifespan.wild },
    {
      label: "Weight",
      value: `${animal.core.weight.min} – ${animal.core.weight.max}`,
    },
    {
      label: "Size",
      value: `${animal.core.size.lengthMin} – ${animal.core.size.lengthMax}`,
    },
    { label: "Speed", value: animal.core.speed ?? "—" },
    { label: "Status", value: animal.core.conservationStatus },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-[1.1rem] border border-[var(--line)] bg-white/90 px-4 py-3.5 shadow-[0_8px_20px_rgba(23,49,39,0.05)] backdrop-blur-sm"
        >
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
            {fact.label}
          </p>
          <p className="mt-1.5 text-base font-bold leading-snug text-[var(--forest-deep)]">
            {fact.value}
          </p>
        </div>
      ))}
      <div className="rounded-[1.1rem] border border-dashed border-[rgba(199,122,56,0.45)] bg-[rgba(239,214,187,0.35)] px-4 py-3.5 sm:col-span-2 lg:col-span-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--warm)]">
          Scientific name
        </p>
        <p className="mt-1.5 text-base font-bold italic text-[var(--forest-deep)]">
          {animal.core.scientificName}
        </p>
      </div>
    </div>
  );
}
