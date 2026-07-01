import Link from "next/link";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import { getDietSlug, getHabitatSlug } from "@/lib/hub-clusters";
import type { AnimalRecord } from "@/lib/types";
import type { ReactNode } from "react";

type FactItemType = {
  label: string;
  value: ReactNode;
};

function FactItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="group flex flex-col justify-center py-8 px-6 sm:px-10 transition-colors hover:bg-[var(--foreground)]/[0.02]">
      <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
        {label}
      </h4>
      <div className="font-serif text-3xl sm:text-4xl italic leading-tight text-[var(--forest-deep)] break-words w-full transition-colors group-hover:text-[var(--sky-deep)]">
        {children}
      </div>
    </div>
  );
}

function FactGroup({ title, facts }: { title: string; facts: FactItemType[] }) {
  return (
    <section className="flex flex-col h-full bg-[var(--surface-strong)]">
      <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-[var(--forest-deep)] px-6 sm:px-10 py-5 border-b border-[var(--line)] bg-[var(--foreground)]/5">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] flex-1 [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-[var(--line)]">
        {facts.map((fact) => (
          <FactItem key={fact.label} label={fact.label}>
            {fact.value}
          </FactItem>
        ))}
      </div>
    </section>
  );
}

export function FactGrid({ animal }: { animal: AnimalRecord }) {
  const habitatSlug = getHabitatSlug(animal);
  const dietSlug = getDietSlug(animal);

  const homeFacts: FactItemType[] = [
    { label: "Kind of animal", value: animal.core.taxonomy.class },
    {
      label: "Where they live",
      value: habitatSlug ? (
        <Link href={`/habitats/${habitatSlug}`} className="text-[var(--forest)] hover:underline">
          {getHabitatLabel(animal.core.habitat)}
        </Link>
      ) : (
        getHabitatLabel(animal.core.habitat)
      ),
    },
    {
      label: "What they eat",
      value: dietSlug ? (
        <Link href={`/diets/${dietSlug}`} className="text-[var(--forest)] hover:underline">
          {animal.core.dietType}
        </Link>
      ) : (
        animal.core.dietType
      ),
    },
    {
      label: "How safe?",
      value: <div className="-ml-1"><ConservationStatusBadge status={animal.core.conservationStatus} /></div>,
    },
  ];

  const sizeFacts: FactItemType[] = [
    {
      label: "How heavy",
      value: `${animal.core.weight.min} – ${animal.core.weight.max}`,
    },
    {
      label: "How long",
      value: `${animal.core.size.lengthMin} – ${animal.core.size.lengthMax}`,
    },
    { label: "How fast", value: animal.core.speed ?? "—" },
    { label: "Lifespan", value: animal.core.lifespan.wild },
  ];

  return (
    <section className="group overflow-hidden rounded-[2rem] bg-[var(--surface-strong)] shadow-xl ring-1 ring-[var(--line)] transition-all hover:shadow-2xl">
      <div className="border-b border-[var(--line)] bg-[var(--surface-strong)] px-6 py-8 sm:px-10">
        <span className="inline-flex rounded-full bg-[var(--foreground)]/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--line)] mb-5 backdrop-blur-md">
          Quick Facts
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--forest-deep)]">
          {animal.core.name} at a glance
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[var(--muted)]">
          <span className="font-serif italic font-semibold text-[var(--forest-deep)] text-lg sm:text-xl">
            {animal.core.scientificName}
          </span>
          <span aria-hidden className="px-3 opacity-50">·</span>
          {animal.core.taxonomy.order}
          <span aria-hidden className="px-3 opacity-50">·</span>
          {animal.core.taxonomy.family}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--line)]">
        <FactGroup title="About their home" facts={homeFacts} />
        <FactGroup title="Size and speed" facts={sizeFacts} />
      </div>
    </section>
  );
}
