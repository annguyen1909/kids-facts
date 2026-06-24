import Image from "next/image";
import Link from "next/link";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import type { AnimalRecord } from "@/lib/types";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { Card, CardContent } from "@/components/ui/card";

type AnimalCardProps = {
  animal: AnimalRecord;
  variant?: "default" | "compact";
};

export function AnimalCard({ animal, variant = "default" }: AnimalCardProps) {
  const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));

  if (variant === "compact") {
    return (
      <Card className="group overflow-hidden rounded-lg border-[var(--line)] bg-white shadow-none hover:-translate-y-0.5">
        <Link href={`/animals/${animal.core.slug}`} className="relative block aspect-[4/3] overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.unoptimized}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 160px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,23,42,0.88)] via-[rgba(15,23,42,0.45)] to-transparent px-2.5 pb-2 pt-7">
            <h3 className="truncate text-sm font-semibold leading-tight text-white">
              {animal.core.name}
            </h3>
            <p className="text-slot-1 truncate text-[0.6875rem] leading-tight italic text-white/75">
              {animal.core.scientificName}
            </p>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border-[var(--line)] bg-white hover:-translate-y-1">
      <Link href={`/animals/${animal.core.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.unoptimized}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-2 overflow-hidden">
            <ConservationStatusBadge status={animal.core.conservationStatus} />
            <span className="text-slot-1 min-w-0 flex-1 text-base font-medium text-[var(--muted)]">
              {animal.core.taxonomy.class}
            </span>
          </div>
          <div className="shrink-0">
            <h3 className="truncate text-xl font-bold tracking-tight text-[var(--forest-deep)]">
              {animal.core.name}
            </h3>
            <p className="text-slot-1 text-sm italic text-[var(--muted)]">
              {animal.core.scientificName}
            </p>
          </div>
          <p className="text-slot-3 text-lg text-[var(--foreground)]/85">
            {animal.core.summary}
          </p>
          <div className="card-meta-panel space-y-2">
            <div className="flex min-w-0 items-baseline gap-2 text-base leading-7">
              <span className="shrink-0 font-semibold text-[var(--forest-deep)]">Lives</span>
              <span className="text-slot-1 min-w-0 flex-1 text-[var(--muted)]">
                {getHabitatLabel(animal.core.habitat)}
              </span>
            </div>
            <div className="flex min-w-0 items-baseline gap-2 text-base leading-7">
              <span className="shrink-0 font-semibold text-[var(--forest-deep)]">Eats</span>
              <span className="text-slot-1 min-w-0 flex-1 text-[var(--muted)]">
                {animal.core.dietType}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
