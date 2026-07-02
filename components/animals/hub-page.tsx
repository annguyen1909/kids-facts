import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimalCard } from "@/components/animals/animal-card";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { formatFeaturedPageLabel } from "@/lib/content";
import { getAbsoluteUrl, getAnimalPrimaryImage } from "@/lib/images";
import { getHubIndexPath, getHubTypeLabel, isNavigableInternalPath } from "@/lib/routes";
import { buildBreadcrumbSchema, buildHubSchema } from "@/lib/schema";
import type { AnimalRecord, HubRecord } from "@/lib/types";

const hubToneClass: Record<HubRecord["type"], string> = {
  habitats: "hub-page--sky",
  diets: "hub-page--warm",
  families: "hub-page--forest",
  "conservation-status": "hub-page--conservation",
  topics: "hub-page--sky",
};

function getHubCoverImage(hubType: HubRecord["type"], animals: AnimalRecord[]): string | undefined {
  if (!animals.length) return undefined;

  // 1. Try to find an image matching the hub type across all animals
  const targetImageType = 
    hubType === "habitats" ? "habitat" : 
    hubType === "diets" ? "diet" : 
    hubType === "families" ? "family" : null;
  
  if (targetImageType) {
    for (const animal of animals) {
      const match = animal.images.find(img => img.imageType === targetImageType);
      if (match) return match.src;
    }
  }

  // 2. Try to find any secondary image (not the primary one) to avoid visual repetition
  for (const animal of animals) {
    if (animal.images.length > 1) {
      const primarySrc = getAnimalPrimaryImage(animal).src;
      const secondary = animal.images.find(img => img.src !== primarySrc);
      if (secondary) return secondary.src;
    }
  }

  // 3. Fallback to primary image of the first animal
  return getAnimalPrimaryImage(animals[0]).src;
}

export async function HubPage({
  hub,
  animals,
}: {
  hub: HubRecord;
  animals: AnimalRecord[];
}) {
  const hubTypeLabel = getHubTypeLabel(hub.type);
  const hubIndexPath = getHubIndexPath(hub.type);
  const toneClass = hubToneClass[hub.type] ?? "hub-page--forest";
  
  const coverImage = getHubCoverImage(hub.type, animals);

  return (
    <div className={`hub-page ${toneClass}`}>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          ...(hubIndexPath
            ? [{ name: hubTypeLabel, item: getAbsoluteUrl(hubIndexPath) }]
            : []),
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
      
      <PageHeroShell
        compact
        slim
        breadcrumbs={[
          { label: "Home", href: "/" },
          ...(hubIndexPath ? [{ label: hubTypeLabel, href: hubIndexPath }] : []),
          { label: hub.name },
        ]}
        eyebrow={`${hubTypeLabel} hub`}
        title={hub.name}
        intro={hub.description}
        coverImage={coverImage}
      />

      <div className="section-shell py-10">
        {hub.body ? (
          <section className="hub-page__panel mt-8">
            <MdxArticle source={hub.body} />
          </section>
        ) : null}
        <section className="mt-4">
          <h2 className="section-title text-[var(--forest-deep)]">Animals in this cluster</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-3 animate-on-scroll-fast">
            {animals.map((animal) => (
              <AnimalCard key={animal.core.slug} animal={animal} />
            ))}
          </div>
        </section>
        {hub.featuredPagePaths.length > 0 ? (
          <section className="hub-page__panel mt-4">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
              Featured pages
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-on-scroll-fast">
              {hub.featuredPagePaths.map((pagePath) => {
                const label = formatFeaturedPageLabel(pagePath);
                const navigable = isNavigableInternalPath(pagePath);

                if (!navigable) {
                  return (
                    <div key={pagePath} className="hub-page__featured-card hub-page__featured-card--static">
                      <p className="font-semibold text-[var(--forest-deep)]">{label}</p>
                    </div>
                  );
                }

                return (
                  <Link key={pagePath} href={pagePath} className="hub-page__featured-card group">
                    <p className="font-semibold text-[var(--forest-deep)]">{label}</p>
                    <span className="hub-page__featured-cta">
                      Open page
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
