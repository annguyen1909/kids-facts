import { AnimalCategoryBrowser } from "@/components/animals/animal-category-browser";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { JsonLd } from "@/components/layout/json-ld";
import { getAnimalsForCategory, type AnimalCategory } from "@/lib/animal-categories";
import { getAbsoluteUrl } from "@/lib/images";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";

export function AnimalCategoryPage({ category }: { category: AnimalCategory }) {
  const animals = getAnimalsForCategory(category);
  const path = `/animals/${category.slug}`;

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          { name: category.title, item: getAbsoluteUrl(path) },
        ])}
      />
      <JsonLd
        data={buildCollectionPageSchema(
          animals.map((animal) => ({
            name: animal.core.name,
            item: getAbsoluteUrl(`/animals/${animal.core.slug}`),
          })),
          category.description,
        )}
      />
      <PageHeroShell
        compact
        slim
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Animals", href: "/animals" },
          { label: category.title },
        ]}
        eyebrow="Animal category"
        title={category.title}
        intro={`${animals.length} animals · ${category.examples}`}
      />

      <section className="section-band section-band--flush-top">
        <div className="section-shell">
          <AnimalCategoryBrowser animals={animals} categoryTitle={category.title} />
        </div>
      </section>
    </div>
  );
}
