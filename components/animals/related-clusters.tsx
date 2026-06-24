import Image from "next/image";
import Link from "next/link";
import type { AnimalRecord } from "@/lib/types";
import { getRelatedAnimals } from "@/lib/content";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { createFeaturedUsage, pickUniqueFeaturedAnimals } from "@/lib/unique-featured-animals";

type ClusterConfig = {
  title: string;
  animals: AnimalRecord[];
};

function RelatedAnimalTile({
  animal,
}: {
  animal: AnimalRecord;
}) {
  const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));

  return (
    <Link
      href={`/animals/${animal.core.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized={image.unoptimized}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-base font-semibold text-[var(--forest-deep)]">
          {animal.core.name}
        </p>
        <p className="mt-0.5 truncate text-sm text-[var(--muted)]">
          {animal.core.dietType}
        </p>
      </div>
    </Link>
  );
}

function ClusterRow({ title, animals }: ClusterConfig) {
  if (!animals.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--forest-deep)]">{title}</h3>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {animals.map((entry) => (
          <li key={entry.core.slug}>
            <RelatedAnimalTile animal={entry} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedClusters({ animal }: { animal: AnimalRecord }) {
  const related = getRelatedAnimals(animal);

  const clusters: ClusterConfig[] = [
    { title: "Featured picks", animals: related.editorial },
    { title: "Same habitat", animals: related.sameHabitat },
    { title: "Same diet", animals: related.sameDiet },
    { title: "Same family", animals: related.sameFamily },
    { title: "Similar size", animals: related.similarSize },
  ];

  const usage = createFeaturedUsage();
  const visibleClusters = clusters
    .filter((cluster) => cluster.animals.length > 0)
    .slice(0, 3)
    .map((cluster) => ({
      ...cluster,
      animals: pickUniqueFeaturedAnimals(cluster.animals, 3, usage),
    }))
    .filter((cluster) => cluster.animals.length > 0);

  if (!visibleClusters.length) return null;

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow eyebrow--light">Related animals</p>
        <h2 className="section-title mt-4 text-[var(--forest-deep)]">
          More animals to explore
        </h2>
      </div>
      <div className="space-y-8">
        {visibleClusters.map((cluster) => (
          <ClusterRow key={cluster.title} {...cluster} />
        ))}
      </div>
    </section>
  );
}
