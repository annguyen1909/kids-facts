import { HubClusterCard } from "@/components/animals/hub-cluster-card";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { JsonLd } from "@/components/layout/json-ld";
import type { HubCluster } from "@/lib/hub-clusters";
import { getAbsoluteUrl } from "@/lib/images";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/schema";
import { buildUniqueHubFeaturedMap } from "@/lib/unique-featured-animals";

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
  const featuredByCluster = buildUniqueHubFeaturedMap(clusters);

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
        coverImage={
          type === "habitats" 
            ? "/images/animals/african-elephant/web/elephant-habitat-01-1200.webp"
            : "/images/animals/snake/web/snake-diet-01-1200.webp"
        }
      />

      <section className="section-band section-band--flush-top">
        <div className="section-shell max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 animate-on-scroll-fast mt-8">
            {clusters.map((cluster) => (
              <HubClusterCard
                key={cluster.slug}
                cluster={cluster}
                type={type}
                featuredAnimal={featuredByCluster.get(cluster.slug)}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
