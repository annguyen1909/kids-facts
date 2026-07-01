import Link from "next/link";
import { AnimalCard } from "@/components/animals/animal-card";
import { getCategoryHref, type AnimalCategory } from "@/lib/animal-categories";
import type { AnimalRecord } from "@/lib/types";

type AnimalCategorySectionProps = {
  category: AnimalCategory;
  animals: AnimalRecord[];
  showSeeAll?: boolean;
  previewLimit?: number;
  compact?: boolean;
  showDescription?: boolean;
  hideHeader?: boolean;
};

export function AnimalCategorySection({
  category,
  animals,
  showSeeAll = true,
  previewLimit,
  compact = false,
  showDescription = true,
  hideHeader = false,
}: AnimalCategorySectionProps) {
  if (animals.length === 0) return null;

  const visibleAnimals = previewLimit ? animals.slice(0, previewLimit) : animals;
  const hasMore = previewLimit ? animals.length > previewLimit : false;

  return (
    <section id={category.slug} className="scroll-mt-24 space-y-3">
      {hideHeader ? null : (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            {compact ? (
              <h2 className="text-lg font-bold tracking-tight text-[var(--forest-deep)]">
                {category.title}
              </h2>
            ) : (
              <>
                <p className="eyebrow eyebrow--light">Category</p>
                <h2 className="section-title mt-2 text-[var(--forest-deep)]">{category.title}</h2>
              </>
            )}
            {showDescription ? (
              <p className="mt-1 text-sm text-[var(--muted)]">{category.description}</p>
            ) : null}
          </div>
          {showSeeAll ? (
            <Link
              href={getCategoryHref(category.slug)}
              className="shrink-0 text-sm font-semibold text-[var(--forest)]"
            >
              {hasMore ? `All ${animals.length} ${category.title.toLowerCase()}` : `See all →`}
            </Link>
          ) : null}
        </div>
      )}
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            : "grid gap-5 lg:grid-cols-3"
        }
      >
        {visibleAnimals.map((animal) => (
          <AnimalCard key={animal.core.slug} animal={animal} variant={compact ? "compact" : "default"} />
        ))}
      </div>
    </section>
  );
}
