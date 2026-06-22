import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeInfo,
  Camera,
} from "lucide-react";
import { AdSlot } from "@/components/animals/ad-slot";
import { AnimalGallery } from "@/components/animals/animal-gallery";
import { AnimalSection } from "@/components/animals/animal-section";
import { AnimalFaqSection } from "@/components/animals/animal-faq-section";
import { CoreArticleExplorer } from "@/components/animals/core-article-explorer";
import { FactGrid } from "@/components/animals/fact-grid";
import { FunFactsPanel } from "@/components/animals/fun-facts-panel";
import { RelatedClusters } from "@/components/animals/related-clusters";
import { TaxonomyPanel } from "@/components/animals/taxonomy-panel";
import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { JsonLd } from "@/components/layout/json-ld";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAnimals, getAnimalBySlug, getAllComparisons } from "@/lib/content";
import { getCoreArticleLinkedSlugs } from "@/lib/core-article";
import { getAbsoluteUrl, getAnimalHeroImage } from "@/lib/images";
import { buildAnimalMetadata } from "@/lib/metadata";
import {
  buildAnimalArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildImageGallerySchema,
  buildImageSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return getAllAnimals().map((animal) => ({ animalSlug: animal.core.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ animalSlug: string }>;
}): Promise<Metadata> {
  const { animalSlug } = await params;
  const animal = getAnimalBySlug(animalSlug);
  return animal ? buildAnimalMetadata(animal, `/animals/${animal.core.slug}`) : {};
}

export default async function AnimalCorePage({
  params,
}: {
  params: Promise<{ animalSlug: string }>;
}) {
  const { animalSlug } = await params;
  const animal = getAnimalBySlug(animalSlug);
  if (!animal) notFound();

  const primaryImage = getAnimalHeroImage(animal);
  const mainGallery =
    animal.galleries.find((gallery) => gallery.slug === "gallery") ?? animal.galleries[0];
  const galleryImages = mainGallery.imageSlugs
    .map((slug) => animal.images.find((image) => image.slug === slug))
    .filter((image): image is NonNullable<typeof image> => Boolean(image));
  const availableComparisons = getAllComparisons().filter(({ comparison }) =>
    comparison.animalA === animal.core.slug || comparison.animalB === animal.core.slug,
  );
  const firstComparison = availableComparisons[0]?.comparison;
  const coreLinkedSlugs = getCoreArticleLinkedSlugs(animal.coreBody);
  const morePages = animal.supportingPages.filter(
    (page) => !coreLinkedSlugs.includes(page.slug),
  );

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          { name: animal.core.name, item: getAbsoluteUrl(`/animals/${animal.core.slug}`) },
        ])}
      />
      <JsonLd
        data={buildAnimalArticleSchema(
          animal,
          animal.core.metaTitle,
          `/animals/${animal.core.slug}`,
          animal.core.metaDescription,
        )}
      />
      <JsonLd
        data={buildFaqSchema(
          animal.core.faq.map((item) => ({ question: item.question, answer: item.answer })),
        )}
      />
      <JsonLd data={buildImageSchema(primaryImage)} />
      {galleryImages.length > 0 ? (
        <JsonLd data={buildImageGallerySchema(animal, galleryImages, mainGallery.intro)} />
      ) : null}

      {/* Hero */}
      <AnimalSection variant="hero" className="pb-8 pt-6 sm:pt-10" tight>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Animals", href: "/animals" },
            { label: animal.core.name },
          ]}
        />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1.02fr]">
          <div>
            <div className="eyebrow">{animal.core.taxonomy.class}</div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge>{animal.core.conservationStatus}</Badge>
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                {animal.core.populationTrend} population trend
              </span>
            </div>
            <h1 className="display-title mt-4 font-extrabold text-[var(--forest-deep)]">
              {animal.core.heroTitle}
            </h1>
            <p className="mt-5 body-lead">{animal.core.summary}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#gallery">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(36,83,65,0.22)]">
                  <Camera className="h-4 w-4" />
                  See photos
                </span>
              </a>
              {firstComparison ? (
                <Link href={`/animals/compare/${firstComparison.slug}`}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/90 px-5 py-3 text-sm font-semibold text-[var(--forest)] shadow-[0_10px_20px_rgba(23,49,39,0.06)] backdrop-blur-sm">
                    <BadgeInfo className="h-4 w-4" />
                    Compare animals
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white shadow-[var(--shadow)]">
            <AnimalImageFrame
              src={primaryImage.src}
              alt={primaryImage.alt}
              aspect="hero"
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[var(--forest-deep)] sm:text-base">
                  {primaryImage.caption}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{primaryImage.alt}</p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-[rgba(122,168,196,0.12)] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--sky-deep)] sm:inline-flex">
                Featured
              </span>
            </div>
          </div>
        </div>
      </AnimalSection>

      {/* Quick facts */}
      <AnimalSection variant="sky" tight className="pt-0">
        <FactGrid animal={animal} />
      </AnimalSection>

      {/* Photo gallery — single section, no separate /gallery route */}
      {galleryImages.length > 0 ? (
        <AnimalSection variant="forest" tight>
          <AnimalGallery
            sectionId="gallery"
            title={mainGallery.title}
            intro={mainGallery.intro}
            images={galleryImages}
          />
        </AnimalSection>
      ) : null}

      {/* Core article — bite-sized cards for kids */}
      <AnimalSection variant="cream" tight>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Core article</p>
            <h2 className="section-title mt-3 text-[var(--forest-deep)]">
              {animal.core.name} in a nutshell
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              Short, scannable sections with photos. Tap &ldquo;Learn more&rdquo; on any card for the full guide.
            </p>
          </div>
          <p className="shrink-0 rounded-full bg-[rgba(36,83,65,0.08)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--forest)]">
            {animal.supportingPages.length} deep-dive pages
          </p>
        </div>
        <CoreArticleExplorer animal={animal} source={animal.coreBody} />
      </AnimalSection>

      {/* Taxonomy + fun facts — independent row, natural height */}
      <AnimalSection variant="warm" tight>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <TaxonomyPanel taxonomy={animal.core.taxonomy} />
          <FunFactsPanel facts={animal.core.funFacts} />
        </div>
      </AnimalSection>

      {(morePages.length > 0 || availableComparisons.length > 0) && (
      <AnimalSection variant="default" tight>
        <div
          className={
            morePages.length > 0
              ? "grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]"
              : "grid items-start gap-5 lg:grid-cols-1 lg:max-w-lg"
          }
        >
          {morePages.length > 0 ? (
            <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/95 px-5 py-6 shadow-[var(--shadow)] backdrop-blur-sm sm:px-7 sm:py-7">
              <p className="eyebrow">Go deeper</p>
              <h2 className="section-title mt-3 text-[var(--forest-deep)]">
                More to explore
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Pages not covered in the summary cards above.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {morePages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/animals/${animal.core.slug}/${page.slug}`}
                    className="flex items-start justify-between gap-3 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-snug text-[var(--forest-deep)] sm:text-base">
                        {page.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)] sm:text-sm">
                        {page.intro}
                      </p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className={morePages.length > 0 ? "space-y-4" : ""}>
            {availableComparisons.length > 0 ? (
              <Card className="rounded-[1.75rem] border-[var(--line)] bg-[var(--forest-deep)] text-white shadow-[var(--shadow)]">
                <CardContent className="p-6">
                  <p className="eyebrow bg-white/10 text-[var(--warm-soft)]">Compare animals</p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                    See how {animal.core.name.toLowerCase()} compares
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[rgba(255,255,255,0.76)]">
                    Side-by-side pages for habitat, diet, size, and behavior.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableComparisons.map(({ comparison }) => (
                      <Link
                        key={comparison.slug}
                        href={`/animals/compare/${comparison.slug}`}
                        className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                      >
                        {comparison.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
            <AdSlot label="Ad slot before FAQ" />
          </div>
        </div>
      </AnimalSection>
      )}

      {/* Related animals */}
      <AnimalSection variant="sky" tight>
        <RelatedClusters animal={animal} />
      </AnimalSection>

      {/* FAQ */}
      <AnimalSection variant="cream" tight className="pb-10 sm:pb-14">
        <AnimalFaqSection animalName={animal.core.name} items={animal.core.faq} />
      </AnimalSection>
    </div>
  );
}
