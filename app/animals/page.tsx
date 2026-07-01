import type { Metadata } from "next";
import Link from "next/link";
import { AnimalCard } from "@/components/animals/animal-card";
import { AnimalCategoryCard } from "@/components/animals/animal-category-card";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { SearchEmptyState } from "@/components/animals/search-empty-state";
import { JsonLd } from "@/components/layout/json-ld";
import {
  getCategoryCardImage,
  getPublishedAnimalCardsGroupedByCategory,
} from "@/lib/animal-categories";
import { cn } from "@/lib/utils";
import { getPublishedAnimalCards } from "@/lib/content";
import { filterAnimalsBySearchQuery } from "@/lib/animal-search";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/metadata";
import { getAbsoluteUrl, getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import type { AnimalCardRecord } from "@/lib/types";

const animalsPageDescription =
  "Browse animal facts by mammals, birds, fish, reptiles, and insects.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = getSingleSearchParam(params.query).trim();
  const page = parsePageNumber(params.page);

  if (query || page > 1) {
    const pageSuffix = page > 1 ? ` - Page ${page}` : "";
    const title = query
      ? `Animal Search Results for "${query}"${pageSuffix}`
      : `Animals - Page ${page}`;
    const description = query
      ? `Search results for "${query}" in the Wildlife Encyclopedia animal library.`
      : `Browse page ${page} of the Wildlife Encyclopedia animal library.`;

    return buildPageMetadata({
      title,
      description,
      path: buildAnimalsHref(query, page),
      canonicalPath: "/animals",
      robots: {
        index: false,
        follow: true,
      },
    });
  }

  return buildPageMetadata({
    title: "Animals",
    description: animalsPageDescription,
    path: "/animals",
  });
}

export const revalidate = 86400;

const ANIMALS_PAGE_SIZE = 24;

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePageNumber(value?: string | string[]) {
  const page = Number.parseInt(getSingleSearchParam(value), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildAnimalsHref(query: string, page: number) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/animals?${search}` : "/animals";
}

function buildCategoryFeaturedMap(
  groupedCategories: ReturnType<typeof getPublishedAnimalCardsGroupedByCategory>,
) {
  const usedAnimalSlugs = new Set<string>();
  const usedImageSrcs = new Set<string>();
  const featuredByCategory = new Map<string, AnimalCardRecord>();

  for (const { category, animals } of groupedCategories) {
    const featuredAnimalSlug =
      "featuredAnimalSlug" in category ? category.featuredAnimalSlug : undefined;

    const prioritizedAnimals = featuredAnimalSlug
      ? [
          ...animals.filter((animal) => animal.core.slug === featuredAnimalSlug),
          ...animals.filter((animal) => animal.core.slug !== featuredAnimalSlug),
        ]
      : animals;

    const featuredAnimal =
      prioritizedAnimals.find((animal) => {
        const primaryImage = getAnimalPrimaryImage(animal);
        return !usedAnimalSlugs.has(animal.core.slug) && !usedImageSrcs.has(primaryImage.src);
      }) ?? prioritizedAnimals[0];

    if (!featuredAnimal) continue;

    featuredByCategory.set(category.slug, featuredAnimal);
    usedAnimalSlugs.add(featuredAnimal.core.slug);
    usedImageSrcs.add(getAnimalPrimaryImage(featuredAnimal).src);
  }

  return featuredByCategory;
}

function buildPaginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function PaginationControls({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
}) {
  if (totalPages <= 1) return null;

  const paginationItems = buildPaginationItems(currentPage, totalPages);
  const navLinkClassName =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--forest)] transition-colors hover:border-[var(--forest)] hover:bg-[var(--surface)]";
  const pageLinkClassName =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center border-t border-[var(--line)] pt-4"
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {currentPage > 1 ? (
          <Link href={buildAnimalsHref(query, currentPage - 1)} className={navLinkClassName}>
            Prev
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[var(--line)] px-3 text-sm font-semibold text-[var(--muted)] opacity-45"
          >
            Prev
          </span>
        )}
        {paginationItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex h-9 w-7 items-center justify-center text-sm font-semibold text-[var(--muted)]"
            >
              ...
            </span>
          ) : (
            <Link
              key={item}
              href={buildAnimalsHref(query, item)}
              aria-current={item === currentPage ? "page" : undefined}
              className={cn(
                pageLinkClassName,
                item === currentPage
                  ? "border-[var(--forest)] bg-[var(--forest)] text-white shadow-[0_10px_20px_rgba(36,83,65,0.18)]"
                  : "border-[var(--line)] bg-white text-[var(--forest)] hover:border-[var(--forest)] hover:bg-[var(--surface)]",
              )}
            >
              {item}
            </Link>
          ),
        )}
        {currentPage < totalPages ? (
          <Link href={buildAnimalsHref(query, currentPage + 1)} className={navLinkClassName}>
            Next
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[var(--line)] px-3 text-sm font-semibold text-[var(--muted)] opacity-45"
          >
            Next
          </span>
        )}
      </div>
    </nav>
  );
}

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}) {
  const animals = getPublishedAnimalCards();
  const params = await searchParams;
  const query = getSingleSearchParam(params.query);
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const requestedPage = parsePageNumber(params.page);
  const filteredAnimals = normalizedQuery
    ? filterAnimalsBySearchQuery(animals, normalizedQuery)
    : animals;
  const groupedCategories = getPublishedAnimalCardsGroupedByCategory();
  const categoryFeatured = buildCategoryFeaturedMap(groupedCategories);
  const totalAnimals = filteredAnimals.length;
  const totalPages = Math.max(1, Math.ceil(totalAnimals / ANIMALS_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * ANIMALS_PAGE_SIZE;
  const visibleAnimals = filteredAnimals.slice(pageStart, pageStart + ANIMALS_PAGE_SIZE);
  const showingFrom = totalAnimals === 0 ? 0 : pageStart + 1;
  const showingTo = Math.min(pageStart + ANIMALS_PAGE_SIZE, totalAnimals);

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
          visibleAnimals.map((animal) => ({
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
        coverImage="/images/animals/tiger/web/tiger-hero-01-1200.webp"
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
            <div className="space-y-8">
              <div className="border-b border-[var(--line)] pb-4">
                <p className="font-serif text-3xl sm:text-4xl text-[var(--forest-deep)]">
                  {totalAnimals} result{totalAnimals === 1 ? "" : "s"} for <span className="italic">&ldquo;{trimmedQuery}&rdquo;</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-on-scroll-fast">
                {visibleAnimals.map((animal) => (
                  <AnimalCard key={animal.core.slug} animal={animal} variant="compact" />
                ))}
              </div>
              {totalAnimals > 0 ? (
                <>
                  <p className="text-sm text-[var(--muted)]">
                    Showing {showingFrom}-{showingTo} of {totalAnimals}
                  </p>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    query={trimmedQuery}
                  />
                </>
              ) : null}
              {totalAnimals === 0 ? (
                <SearchEmptyState query={trimmedQuery} clearHref="/animals" />
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
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5 animate-on-scroll-fast">
                  {groupedCategories.map(({ category, animals: categoryAnimals }) => {
                    const featuredAnimal = categoryFeatured.get(category.slug);
                    const image = featuredAnimal
                      ? getAnimalImageForDisplay(getAnimalPrimaryImage(featuredAnimal))
                      : getCategoryCardImage(category, animals);

                    return (
                      <AnimalCategoryCard
                        key={category.slug}
                        category={category}
                        animalCount={categoryAnimals.length}
                        image={image}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <p className="eyebrow eyebrow--light">Full index</p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--forest-deep)]">
                    All animals ({animals.length})
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Showing {showingFrom}-{showingTo} of {animals.length}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-on-scroll-fast">
                  {visibleAnimals.map((animal) => (
                    <AnimalCard key={animal.core.slug} animal={animal} variant="compact" />
                  ))}
                </div>
                <PaginationControls currentPage={currentPage} totalPages={totalPages} query="" />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
