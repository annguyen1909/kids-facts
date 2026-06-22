import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightLeft } from "lucide-react";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { getAllComparisons, resolveComparisonRoute } from "@/lib/content";
import { getAbsoluteUrl, getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import { buildComparisonMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildComparisonSchema } from "@/lib/schema";

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
    ? buildComparisonMetadata(resolved.comparison, resolved.page)
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

      <section className="section-band pb-8 pt-6 sm:pt-10">
        <div className="section-shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Animals", href: "/animals" },
              { label: resolved.comparison.title },
            ]}
          />
          <div className="mt-6 rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
            <div className="eyebrow">Compare animals</div>
            <h1 className="section-title mt-4 text-[var(--forest-deep)]">
              {resolved.comparison.title}
            </h1>
            <p className="mt-4 body-lead">{resolved.comparison.summary}</p>
          </div>
        </div>
      </section>

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
                      <li><strong>Habitat:</strong> {animal.core.habitats.join(", ")}</li>
                      <li><strong>Diet:</strong> {animal.core.dietType}</li>
                      <li><strong>Family:</strong> {animal.core.taxonomy.family}</li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
            <div className="mx-auto hidden h-16 w-16 items-center justify-center rounded-full bg-[var(--forest)] text-white shadow-[0_12px_24px_rgba(36,83,65,0.22)] lg:flex">
              <ArrowRightLeft className="h-6 w-6" />
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
