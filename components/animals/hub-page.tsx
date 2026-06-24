import Link from "next/link";
import { AnimalCard } from "@/components/animals/animal-card";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { formatFeaturedPageLabel } from "@/lib/content";
import { formatDisplayLabel } from "@/lib/format-display";
import { getAbsoluteUrl } from "@/lib/images";
import { buildBreadcrumbSchema, buildHubSchema } from "@/lib/schema";
import type { AnimalRecord, HubRecord } from "@/lib/types";

export async function HubPage({
  hub,
  animals,
}: {
  hub: HubRecord;
  animals: AnimalRecord[];
}) {
  return (
    <div className="section-shell py-10">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: formatDisplayLabel(hub.type.replace(/-/g, " ")), item: getAbsoluteUrl(`/${hub.type}/${hub.slug}`) },
          { name: hub.name, item: getAbsoluteUrl(`/${hub.type}/${hub.slug}`) },
        ])}
      />
      <JsonLd
        data={buildHubSchema(
          hub,
          animals.map((animal) => ({
            name: animal.core.name,
            item: getAbsoluteUrl(`/animals/${animal.core.slug}`),
          })),
        )}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: formatDisplayLabel(hub.type.replace(/-/g, " ")), href: `/${hub.type}` },
          { label: hub.name },
        ]}
      />
      <section className="mt-6 rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
        <p className="eyebrow eyebrow--light">
          {formatDisplayLabel(hub.type.replace(/-/g, " "))} hub
        </p>
        <h1 className="section-title mt-4 text-[var(--forest-deep)]">
          {hub.name}
        </h1>
        <p className="mt-4 body-lead">
          {hub.description}
        </p>
      </section>
      {hub.body ? (
        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-[var(--shadow)]">
          <MdxArticle source={hub.body} />
        </section>
      ) : null}
      <section className="mt-10">
        <h2 className="section-title text-[var(--forest-deep)]">
          Animals in this cluster
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {animals.map((animal) => (
            <AnimalCard key={animal.core.slug} animal={animal} />
          ))}
        </div>
      </section>
      {hub.featuredPagePaths.length > 0 ? (
        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-[var(--shadow)]">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
            Featured pages
          </h2>
          <ul className="mt-4 space-y-3">
            {hub.featuredPagePaths.map((pagePath) => (
              <li key={pagePath}>
                <Link href={pagePath} className="font-semibold text-[var(--forest)] hover:underline">
                  {formatFeaturedPageLabel(pagePath)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
