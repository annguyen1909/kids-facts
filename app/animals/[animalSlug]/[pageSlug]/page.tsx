import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { AdSlot } from "@/components/animals/ad-slot";
import { AnimalGallery } from "@/components/animals/animal-gallery";
import { JsonLd } from "@/components/layout/json-ld";
import { MdxArticle } from "@/components/mdx/mdx-article";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAnimals, resolveAnimalRoute } from "@/lib/content";
import { getAbsoluteUrl } from "@/lib/images";
import { buildSupportingPageMetadata } from "@/lib/metadata";
import {
  buildAnimalArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return getAllAnimals().flatMap((animal) =>
    animal.supportingPages.map((page) => ({
      animalSlug: animal.core.slug,
      pageSlug: page.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ animalSlug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { animalSlug, pageSlug } = await params;
  const resolved = resolveAnimalRoute(animalSlug, pageSlug);
  return resolved?.type === "supporting"
    ? buildSupportingPageMetadata(resolved.animal, resolved.page)
    : {};
}

export default async function AnimalSupportingPage({
  params,
}: {
  params: Promise<{ animalSlug: string; pageSlug: string }>;
}) {
  const { animalSlug, pageSlug } = await params;
  const resolved = resolveAnimalRoute(animalSlug, pageSlug);
  if (!resolved || resolved.type !== "supporting") notFound();

  const galleryImages = resolved.page.galleryTopics.flatMap((topic) =>
    resolved.animal.images.filter((image) => image.galleryTopics.includes(topic)),
  );

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          {
            name: resolved.animal.core.name,
            item: getAbsoluteUrl(`/animals/${resolved.animal.core.slug}`),
          },
          {
            name: resolved.page.title,
            item: getAbsoluteUrl(
              `/animals/${resolved.animal.core.slug}/${resolved.page.slug}`,
            ),
          },
        ])}
      />
      <JsonLd
        data={buildAnimalArticleSchema(
          resolved.animal,
          resolved.page.title,
          `/animals/${resolved.animal.core.slug}/${resolved.page.slug}`,
          resolved.page.metaDescription,
        )}
      />
      <JsonLd data={buildFaqSchema(resolved.page.faq)} />

      <section className="section-band pb-8 pt-6 sm:pt-10">
        <div className="section-shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Animals", href: "/animals" },
              {
                label: resolved.animal.core.name,
                href: `/animals/${resolved.animal.core.slug}`,
              },
              { label: resolved.page.title },
            ]}
          />
          <div className="mt-6 rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
            <p className="eyebrow">Supporting page</p>
            <h1 className="section-title mt-4 text-[var(--forest-deep)]">
              {resolved.page.title}
            </h1>
            <p className="mt-4 body-lead">{resolved.page.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {resolved.page.relatedPageSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/animals/${resolved.animal.core.slug}/${slug}`}
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--forest)]"
                >
                  {slug.replaceAll("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band pt-0">
        <div className="section-shell">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
              <MdxArticle source={resolved.page.body} />
            </div>
            <div className="space-y-6">
              <Card className="rounded-[2rem] border-[var(--line)] bg-[rgba(122,168,196,0.08)]">
                <CardContent className="p-7">
                  <h2 className="text-2xl font-extrabold tracking-tight text-[var(--forest-deep)]">
                    Quick recap
                  </h2>
                  <p className="mt-3 text-base leading-8 text-[var(--muted)]">
                    {resolved.page.metaDescription}
                  </p>
                </CardContent>
              </Card>
              <AdSlot label="Ad slot mid-article" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <AnimalGallery
            title={`${resolved.animal.core.name} ${resolved.page.slug.replaceAll("-", " ")} gallery`}
            images={galleryImages}
          />
        </div>
      </section>

      <section className="section-band pt-0">
        <div className="section-shell">
          <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[var(--shadow)] sm:px-8">
            <h2 className="section-title text-[var(--forest-deep)]">
              Questions about {resolved.animal.core.name.toLowerCase()}
            </h2>
            <div className="mt-6">
              <Accordion items={resolved.page.faq} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
