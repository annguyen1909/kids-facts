import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnimalRecord } from "@/lib/types";
import { getRelatedAnimals } from "@/lib/content";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { getDietSlug, getHabitatSlug, toHubSlug } from "@/lib/hub-clusters";
import { createFeaturedUsage, pickUniqueFeaturedAnimals } from "@/lib/unique-featured-animals";

import { AnimalCard } from "@/components/animals/animal-card";

type ClusterConfig = {
  title: string;
  animals: AnimalRecord[];
  cta?: { href: string; label: string };
};

function ClusterRow({ title, animals, cta }: ClusterConfig) {
  if (!animals.length) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--forest-deep)]">{title}</h3>
        {cta ? (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--forest)] hover:underline"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {animals.map((entry) => (
          <li key={entry.core.slug}>
            <AnimalCard animal={entry} variant="compact" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedClusters({ animal }: { animal: AnimalRecord }) {
  const related = getRelatedAnimals(animal);
  const habitatSlug = getHabitatSlug(animal);
  const dietSlug = getDietSlug(animal);
  const familySlug = toHubSlug(animal.core.taxonomy.family);

  const clusters: ClusterConfig[] = [
    { title: "Featured picks", animals: related.editorial },
    {
      title: "Same habitat",
      animals: related.sameHabitat,
      cta: habitatSlug
        ? { href: `/habitats/${habitatSlug}`, label: "See all in this habitat" }
        : undefined,
    },
    {
      title: "Same diet",
      animals: related.sameDiet,
      cta: dietSlug ? { href: `/diets/${dietSlug}`, label: "See all with this diet" } : undefined,
    },
    {
      title: "Same family",
      animals: related.sameFamily,
      cta: familySlug
        ? { href: `/families/${familySlug}`, label: "See all in this family" }
        : undefined,
    },
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
        <h2 className="section-title mt-4 text-[var(--forest-deep)]">More animals to explore</h2>
      </div>
      <div className="space-y-8">
        {visibleClusters.map((cluster) => (
          <ClusterRow key={cluster.title} {...cluster} />
        ))}
      </div>
    </section>
  );
}
