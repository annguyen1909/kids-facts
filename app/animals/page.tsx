import type { Metadata } from "next";
import { AnimalCard } from "@/components/animals/animal-card";
import { JsonLd } from "@/components/layout/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getAllAnimals } from "@/lib/content";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/metadata";
import { getAbsoluteUrl } from "@/lib/images";

export const metadata: Metadata = buildPageMetadata({
  title: "Animals",
  description:
    "Browse animal facts for kids by habitat, diet, family, and classroom-friendly topics.",
  path: "/animals",
});

export const revalidate = 86400;

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const animals = getAllAnimals();
  const { query = "" } = await searchParams;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAnimals = normalizedQuery
    ? animals.filter((animal) =>
        [
          animal.core.name,
          animal.core.scientificName,
          animal.core.habitats.join(" "),
          animal.core.dietType,
          animal.core.taxonomy.class,
          animal.core.taxonomy.family,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : animals;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
          "Browse animal facts for kids by habitat, diet, family, and learning theme.",
        )}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Animals" }]} />
      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Animal library
        </p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-slate-950">
          Browse animals by search intent and learning theme
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          This category hub is designed to scale into thousands of pages with
          strong internal linking, clear taxonomy, and search-ready metadata.
        </p>
        <form action="/animals" className="mt-6 max-w-xl">
          <label htmlFor="animal-query" className="sr-only">
            Search animals
          </label>
          <div className="flex gap-3">
            <input
              id="animal-query"
              name="query"
              defaultValue={query}
              placeholder="Search lions, habitats, diets, or families"
              className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-base text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-amber-500"
              type="search"
            />
            <button
              type="submit"
              className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950"
            >
              Search
            </button>
          </div>
        </form>
      </section>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredAnimals.map((animal) => (
          <AnimalCard key={animal.core.slug} animal={animal} />
        ))}
      </div>
      {filteredAnimals.length === 0 ? (
        <p className="mt-8 text-base text-slate-600">
          No animals matched that search.
        </p>
      ) : null}
    </div>
  );
}
