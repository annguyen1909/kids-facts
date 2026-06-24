import Link from "next/link";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import { getDietSlug, getHabitatSlug } from "@/lib/hub-clusters";
import type { AnimalRecord } from "@/lib/types";
import {
  Clock3,
  Leaf,
  MapPin,
  PawPrint,
  Ruler,
  Scale,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type FactItem = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

function FactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="fact-item">
      <div className="fact-item__icon-wrap">
        <Icon className="fact-item__icon" size={20} strokeWidth={2} fill="none" aria-hidden />
      </div>
      <div className="fact-item__content">
        <p className="fact-item__label">{label}</p>
        <div className="fact-item__value">{children}</div>
      </div>
    </div>
  );
}

function FactGroup({ title, facts }: { title: string; facts: FactItem[] }) {
  return (
    <section className="fact-group">
      <h3 className="fact-group__title">{title}</h3>
      <div className="fact-group__list">
        {facts.map((fact) => (
          <FactItem key={fact.label} icon={fact.icon} label={fact.label}>
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

  const homeFacts: FactItem[] = [
    { icon: PawPrint, label: "Kind of animal", value: animal.core.taxonomy.class },
    {
      icon: MapPin,
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
      icon: Leaf,
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
      icon: Shield,
      label: "How safe are they?",
      value: <ConservationStatusBadge status={animal.core.conservationStatus} />,
    },
  ];

  const sizeFacts: FactItem[] = [
    {
      icon: Scale,
      label: "How heavy",
      value: `${animal.core.weight.min} – ${animal.core.weight.max}`,
    },
    {
      icon: Ruler,
      label: "How long",
      value: `${animal.core.size.lengthMin} – ${animal.core.size.lengthMax}`,
    },
    { icon: Zap, label: "How fast", value: animal.core.speed ?? "—" },
    { icon: Clock3, label: "How long they live", value: animal.core.lifespan.wild },
  ];

  return (
    <section className="fact-grid overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white shadow-[var(--shadow)]">
      <div className="border-b border-[var(--line)] px-5 py-5 sm:px-7 sm:py-6">
        <p className="eyebrow eyebrow--light">Quick facts</p>
        <h2 className="section-title mt-3 text-[var(--forest-deep)]">
          {animal.core.name} at a glance
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          <span className="font-semibold italic text-[var(--forest-deep)]">
            {animal.core.scientificName}
          </span>
          <span aria-hidden> · </span>
          {animal.core.taxonomy.order}
          <span aria-hidden> · </span>
          {animal.core.taxonomy.family}
        </p>
      </div>

      <div className="fact-grid__body">
        <FactGroup title="About their home" facts={homeFacts} />
        <FactGroup title="Size and speed" facts={sizeFacts} />
      </div>
    </section>
  );
}
