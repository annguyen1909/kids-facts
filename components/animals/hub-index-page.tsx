import { HubClusterCard } from "@/components/animals/hub-cluster-card";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { JsonLd } from "@/components/layout/json-ld";
import type { HubCluster } from "@/lib/hub-clusters";
import { getAbsoluteUrl } from "@/lib/images";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";

export function HubIndexPage({
  type,
  title,
  intro,
  clusters,
}: {
  type: "habitats" | "diets";
  title: string;
  intro: string;
  clusters: HubCluster[];
}) {
  const path = `/${type}`;
  const label = type === "habitats" ? "Habitats" : "Diets";

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: label, item: getAbsoluteUrl(path) },
        ])}
      />
      <JsonLd
        data={buildCollectionPageSchema(
          clusters.map((cluster) => ({
            name: cluster.name,
            item: getAbsoluteUrl(`${path}/${cluster.slug}`),
          })),
          intro,
        )}
      />
      <PageHeroShell
        compact
        slim
        breadcrumbs={[{ label: "Home", href: "/" }, { label }]}
        eyebrow={label}
        title={title}
        intro={intro}
      />

      <section className="section-band section-band--flush-top">
        <div className="section-shell">
          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {clusters.map((cluster) => (
              <HubClusterCard key={cluster.slug} cluster={cluster} type={type} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
