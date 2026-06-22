import Image from "next/image";
import Link from "next/link";
import type { AnimalRecord } from "@/lib/types";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function AnimalCard({ animal }: { animal: AnimalRecord }) {
  const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));

  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border-[var(--line)] bg-white hover:-translate-y-1">
      <Link href={`/animals/${animal.core.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.unoptimized}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{animal.core.conservationStatus}</Badge>
            <span className="text-sm font-medium text-slate-500">
              {animal.core.taxonomy.class}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
              {animal.core.name}
            </h3>
            <p className="mt-1 text-sm italic text-[var(--muted)]">
              {animal.core.scientificName}
            </p>
          </div>
          <p className="text-base leading-7 text-[var(--muted)]">{animal.core.summary}</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-[var(--muted)]">
            <div>
              <p className="font-semibold text-[var(--forest-deep)]">Habitat</p>
              <p>{animal.core.habitats.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--forest-deep)]">Diet</p>
              <p>{animal.core.dietType}</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
