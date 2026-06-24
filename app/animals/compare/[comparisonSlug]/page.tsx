import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import { getAllComparisons, resolveComparisonRoute } from "@/lib/content";
import { getAbsoluteUrl, getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { buildComparisonMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildComparisonSchema } from "@/lib/schema";
import { disabledFeatureRobots, siteFeatures } from "@/lib/site-features";

export function generateStaticParams() {
  return getAllComparisons().map(({ comparison }) => ({
    comparisonSlug: comparison.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparisonSlug: string }>;
}): Promise<Metadata> {
  const { comparisonSlug } = await params;
  const resolved = resolveComparisonRoute(comparisonSlug);
  return resolved?.type === "comparison"
    ? {
        ...buildComparisonMetadata(resolved.comparison, resolved.page),
        ...(siteFeatures.compare ? {} : { robots: disabledFeatureRobots }),
      }
    : {};
}

export default async function ComparisonOverviewPage({
  params,
}: {
  params: Promise<{ comparisonSlug: string }>;
}) {
  const { comparisonSlug } = await params;
  const resolved = resolveComparisonRoute(comparisonSlug);
  if (!resolved || resolved.type !== "comparison") notFound();

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          {
            name: resolved.comparison.title,
            item: getAbsoluteUrl(`/animals/compare/${resolved.comparison.slug}`),
          },
        ])}
      />
      <JsonLd
        data={buildComparisonSchema(
          resolved.comparison,
          resolved.animalA,
          resolved.animalB,
          `/animals/compare/${resolved.comparison.slug}`,
        )}
      />

      <PageHeroShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Animals", href: "/animals" },
          { label: resolved.comparison.title },
        ]}
        eyebrow="Compare animals"
        title={resolved.comparison.title}
        intro={resolved.comparison.summary}
      />

      <section className="section-band pt-0">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            {[resolved.animalA, resolved.animalB].map((animal) => {
              const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));
              return (
                <Card key={animal.core.slug} className="rounded-[2rem] border-[var(--line)] bg-white overflow-hidden">
                  <div className="relative aspect-[5/4]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      unoptimized={image.unoptimized}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-[var(--forest-deep)]">
                      {animal.core.name}
                    </h2>
                    <ul className="mt-4 space-y-2 text-base leading-7 text-[var(--muted)]">
                      <li><strong>Habitat:</strong> {getHabitatLabel(animal.core.habitat)}</li>
                      <li><strong>Diet:</strong> {animal.core.dietType}</li>
                      <li><strong>Family:</strong> {animal.core.taxonomy.family}</li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
            <div className="mx-auto hidden items-center justify-center px-3 lg:flex">
              <span className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--forest-deep)]">
                vs
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
            <MdxArticle source={resolved.page.body} />
          </div>
        </div>
      </section>

      <section className="section-band pt-0">
        <div className="section-shell">
          <div className="rounded-[2rem] bg-[rgba(122,168,196,0.08)] px-6 py-8 shadow-[var(--shadow)] sm:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--forest-deep)]">
              Compare by topic
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {resolved.comparison.comparisonCandidates.map((slug) => (
                <Link
                  key={slug}
                  href={
                    slug === "overview"
                      ? `/animals/compare/${resolved.comparison.slug}`
                      : `/animals/compare/${resolved.comparison.slug}/${slug}`
                  }
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]"
                >
                  {slug.replaceAll("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
