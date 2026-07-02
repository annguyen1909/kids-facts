import Image from "next/image";
import Link from "next/link";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import type { AnimalCardRecord, AnimalRecord } from "@/lib/types";
import {
  ANIMAL_CARD_ASPECT,
  getAnimalImageForDisplay,
  getAnimalPrimaryImage,
  getCoverObjectPosition,
} from "@/lib/images";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { Card } from "@/components/ui/card";

type AnimalCardProps = {
  animal: AnimalCardRecord | AnimalRecord;
  variant?: "default" | "compact" | "featured";
};

export function AnimalCard({ animal, variant = "default" }: AnimalCardProps) {
  const primaryImage = getAnimalPrimaryImage(animal);
  const image = getAnimalImageForDisplay(primaryImage);
  const objectPosition = getCoverObjectPosition(primaryImage, ANIMAL_CARD_ASPECT);

  if (variant === "compact") {
    return (
      <Card className="animal-card animal-card--compact group overflow-hidden rounded-lg border-[var(--line)] bg-black shadow-none hover:-translate-y-0.5">
        <Link href={`/animals/${animal.core.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-zinc-900 rounded-[1.25rem]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.unoptimized}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            style={{
              ...(objectPosition ? { objectPosition } : {}),
              viewTransitionName: `animal-image-${animal.core.slug}`,
            } as React.CSSProperties}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,23,42,0.95)] via-[rgba(15,23,42,0.6)] to-transparent px-2.5 pb-2 pt-10">
            <h3 className="truncate text-sm font-semibold leading-tight text-white drop-shadow-md">
              {animal.core.name}
            </h3>
            <p className="text-slot-1 truncate text-[0.6875rem] leading-tight italic text-white/80 drop-shadow-md">
              {animal.core.scientificName}
            </p>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="animal-card--featured group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all duration-700 aspect-[4/3] sm:aspect-auto sm:min-h-[500px]">
        <Link href={`/animals/${animal.core.slug}`} className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-12">
          <div className="absolute inset-0 z-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              unoptimized={image.unoptimized}
              className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{
                ...(objectPosition ? { objectPosition } : {}),
                viewTransitionName: `animal-image-${animal.core.slug}`,
              } as React.CSSProperties}
            />
            {/* Deep rich gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
          </div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Featured profile</p>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-serif group-hover:text-[var(--sky-light)] transition-colors duration-500">
              {animal.core.name}
            </h3>
            <p className="text-lg italic text-white/70 mt-2">{animal.core.scientificName}</p>
            <p className="mt-4 text-base leading-relaxed text-white/85 max-w-xl line-clamp-2">
              {animal.core.summary}
            </p>
            <div className="flex gap-4 mt-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md ring-1 ring-inset ring-white/20">
                {getHabitatLabel(animal.core.habitat)}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md ring-1 ring-inset ring-white/20">
                {animal.core.dietType}
              </span>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <div className="group flex h-full flex-col cursor-pointer min-w-0">
      <Link href={`/animals/${animal.core.slug}`} className="flex h-full flex-col min-w-0">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)] ring-1 ring-black/5 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.unoptimized}
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            style={{
              ...(objectPosition ? { objectPosition } : {}),
              viewTransitionName: `animal-image-${animal.core.slug}`,
            } as React.CSSProperties}
          />
          <div className="absolute top-4 left-4">
            <ConservationStatusBadge status={animal.core.conservationStatus} />
          </div>
        </div>
        <div className="flex flex-col mt-6 px-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
            <span>{animal.core.taxonomy.class}</span>
            <span>&middot;</span>
            <span>{getHabitatLabel(animal.core.habitat)}</span>
          </div>
          <h3 className="truncate text-3xl font-bold tracking-tight text-[var(--foreground)] font-serif group-hover:text-[var(--forest)] transition-colors duration-500">
            {animal.core.name}
          </h3>
          <p className="text-sm italic text-[var(--muted)] mt-1">
            {animal.core.scientificName}
          </p>
        </div>
      </Link>
    </div>
  );
}
