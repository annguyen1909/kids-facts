import type { Metadata } from "next";
import Link from "next/link";
import { AnimalCard } from "@/components/animals/animal-card";
import { AnimalCategoryCard } from "@/components/animals/animal-category-card";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { JsonLd } from "@/components/layout/json-ld";
import {
  getCategoryCardImage,
  getPublishedAnimalsGroupedByCategory,
} from "@/lib/animal-categories";
import { getPublishedAnimals } from "@/lib/content";
import { filterAnimalsBySearchQuery } from "@/lib/animal-search";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/metadata";
import { getAbsoluteUrl } from "@/lib/images";

export const metadata: Metadata = buildPageMetadata({
  title: "Animals",
  description:
    "Browse animal facts by mammals, birds, fish, reptiles, and insects.",
  path: "/animals",
});

export const revalidate = 86400;

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const animals = getPublishedAnimals();
  const { query = "" } = await searchParams;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAnimals = normalizedQuery
    ? filterAnimalsBySearchQuery(animals, normalizedQuery)
    : animals;
  const groupedCategories = getPublishedAnimalsGroupedByCategory();

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
        ])}
      />
      <JsonLd
        data={buildCollectionPageSchema(
          filteredAnimals.map((animal) => ({
            name: animal.core.name,
            item: getAbsoluteUrl(`/animals/${animal.core.slug}`),
          })),
          "Browse animal facts by mammals, birds, fish, reptiles, and insects.",
        )}
      />
      <PageHeroShell
        compact
        slim
        split
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Animals" }]}
        eyebrow="Animal library"
        title="Browse the animal library"
        intro={`${animals.length} animals across ${groupedCategories.length} groups — mammals, birds, fish, reptiles, and insects.`}
      >
        <form action="/animals" className="page-hero__search-form">
          <label htmlFor="animal-query" className="sr-only">
            Search animals
          </label>
          <input
            id="animal-query"
            name="query"
            type="search"
            defaultValue={query}
            placeholder="Search by name, habitat, or diet…"
            className="page-hero__search-input"
          />
        </form>
      </PageHeroShell>

      <section className="section-band section-band--flush-top">
        <div className="section-shell space-y-8">
          {normalizedQuery ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                {filteredAnimals.length} result{filteredAnimals.length === 1 ? "" : "s"} for &ldquo;
                {query.trim()}&rdquo;
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredAnimals.map((animal) => (
                  <AnimalCard key={animal.core.slug} animal={animal} variant="compact" />
                ))}
              </div>
              {filteredAnimals.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No animals matched that search.</p>
              ) : null}
            </div>
          ) : (
            <>
              <div>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="eyebrow eyebrow--light">Categories</p>
                    <h2 className="mt-1 text-lg font-bold text-[var(--forest-deep)]">
                      Browse by group
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[var(--forest)]">
                    <Link href="/habitats">By habitat</Link>
                    <Link href="/diets">By diet</Link>
                  </div>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {groupedCategories.map(({ category, animals: categoryAnimals }) => (
                    <AnimalCategoryCard
                      key={category.slug}
                      category={category}
                      animalCount={categoryAnimals.length}
                      image={getCategoryCardImage(category, animals)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <p className="eyebrow eyebrow--light">Full index</p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--forest-deep)]">
                    All animals ({animals.length})
                  </h2>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {animals.map((animal) => (
                    <AnimalCard key={animal.core.slug} animal={animal} variant="compact" />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
