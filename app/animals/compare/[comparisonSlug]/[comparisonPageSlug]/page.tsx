import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getAllComparisons, resolveComparisonRoute } from "@/lib/content";
import { getAbsoluteUrl } from "@/lib/images";
import { buildComparisonMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildComparisonSchema } from "@/lib/schema";
import { disabledFeatureRobots, siteFeatures } from "@/lib/site-features";

export function generateStaticParams() {
  return getAllComparisons().flatMap(({ comparison, pages }) =>
    pages
      .filter((page) => page.slug !== "overview")
      .map((page) => ({
        comparisonSlug: comparison.slug,
        comparisonPageSlug: page.slug,
      })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparisonSlug: string; comparisonPageSlug: string }>;
}): Promise<Metadata> {
  const { comparisonSlug, comparisonPageSlug } = await params;
  const resolved = resolveComparisonRoute(comparisonSlug, comparisonPageSlug);
  return resolved?.type === "comparison"
    ? {
        ...buildComparisonMetadata(resolved.comparison, resolved.page),
        ...(siteFeatures.compare ? {} : { robots: disabledFeatureRobots }),
      }
    : {};
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ comparisonSlug: string; comparisonPageSlug: string }>;
}) {
  const { comparisonSlug, comparisonPageSlug } = await params;
  const resolved = resolveComparisonRoute(comparisonSlug, comparisonPageSlug);
  if (!resolved || resolved.type !== "comparison") notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          {
            name: resolved.comparison.title,
            item: getAbsoluteUrl(`/animals/compare/${resolved.comparison.slug}`),
          },
          {
            name: resolved.page.title,
            item: getAbsoluteUrl(
              `/animals/compare/${resolved.comparison.slug}/${resolved.page.slug}`,
            ),
          },
        ])}
      />
      <JsonLd
        data={buildComparisonSchema(
          resolved.comparison,
          resolved.animalA,
          resolved.animalB,
          `/animals/compare/${resolved.comparison.slug}/${resolved.page.slug}`,
        )}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Animals", href: "/animals" },
          {
            label: resolved.comparison.title,
            href: `/animals/compare/${resolved.comparison.slug}`,
          },
          { label: resolved.page.title },
        ]}
      />
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-950">
          {resolved.page.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{resolved.page.intro}</p>
      </section>
      <section className="mt-10 rounded-lg border border-slate-200 bg-white p-8">
        <MdxArticle source={resolved.page.body} />
      </section>
    </div>
  );
}
