import Link from "next/link";
import type { AnimalRecord } from "@/lib/types";
import { getRelatedAnimals } from "@/lib/content";

type ClusterProps = {
  title: string;
  animals: AnimalRecord[];
  hrefBuilder?: (animal: AnimalRecord) => string;
};

function Cluster({ title, animals, hrefBuilder }: ClusterProps) {
  if (!animals.length) return null;

  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow)]">
      <h3 className="text-lg font-semibold text-[var(--forest-deep)]">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {animals.slice(0, 4).map((animal) => (
          <li key={animal.core.slug}>
            <Link
              href={hrefBuilder ? hrefBuilder(animal) : `/animals/${animal.core.slug}`}
              className="font-semibold text-[var(--forest)] hover:underline"
            >
              {animal.core.name}
            </Link>
            <p className="mt-1 text-[var(--muted)]">{animal.core.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedClusters({ animal }: { animal: AnimalRecord }) {
  const related = getRelatedAnimals(animal);

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">
          Related animals
        </p>
        <h2 className="section-title mt-4 text-[var(--forest-deep)]">
          More animals to explore
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Discover creatures that share habitats, diets, or families with {animal.core.name}.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Cluster title="Editor's picks" animals={related.editorial} />
        <Cluster
          title="Same habitat"
          animals={related.sameHabitat}
          hrefBuilder={(entry) => `/animals/${entry.core.slug}/habitat`}
        />
        <Cluster
          title="Same diet"
          animals={related.sameDiet}
          hrefBuilder={(entry) => `/animals/${entry.core.slug}/diet`}
        />
        <Cluster title="Same family" animals={related.sameFamily} />
        <Cluster
          title="Similar size"
          animals={related.similarSize}
          hrefBuilder={(entry) => `/animals/${entry.core.slug}/life-cycle`}
        />
      </div>
    </section>
  );
}
