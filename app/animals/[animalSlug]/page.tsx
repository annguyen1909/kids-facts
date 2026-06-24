import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/animals/ad-slot";
import { AnimalCategoryPage } from "@/components/animals/animal-category-page";
import { AnimalGallery } from "@/components/animals/animal-gallery";
import { AnimalPageHero } from "@/components/animals/animal-page-hero";
import { AnimalPageBackdrop, AnimalSection } from "@/components/animals/animal-section";
import { AnimalFaqSection } from "@/components/animals/animal-faq-section";
import { CoreArticleExplorer } from "@/components/animals/core-article-explorer";
import { FactGrid } from "@/components/animals/fact-grid";
import { FunFactsPanel } from "@/components/animals/fun-facts-panel";
import { RelatedClusters } from "@/components/animals/related-clusters";
import { TaxonomyPanel } from "@/components/animals/taxonomy-panel";
import { JsonLd } from "@/components/layout/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getPublishedAnimalBySlug, getStaticAnimalRoutes } from "@/lib/content";
import { getDietSlug, getHabitatSlug } from "@/lib/hub-clusters";
import { getAnimalCategoryBySlug, getAnimalCategorySlugs } from "@/lib/animal-categories";
import { planAnimalPageImages, MIN_GALLERY_IMAGES } from "@/lib/animal-page-images";
import { getAbsoluteUrl } from "@/lib/images";
import { buildAnimalMetadata, buildPageMetadata } from "@/lib/metadata";
import {
  buildAnimalArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildImageGallerySchema,
  buildImageSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return [
    ...getStaticAnimalRoutes(),
    ...getAnimalCategorySlugs().map((slug) => ({ animalSlug: slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ animalSlug: string }>;
}): Promise<Metadata> {
  const { animalSlug } = await params;
  const category = getAnimalCategoryBySlug(animalSlug);
  if (category) {
    return buildPageMetadata({
      title: category.title,
      description: category.description,
      path: `/animals/${category.slug}`,
    });
  }

  const animal = getPublishedAnimalBySlug(animalSlug);
  return animal ? buildAnimalMetadata(animal, `/animals/${animal.core.slug}`) : {};
}

export default async function AnimalCorePage({
  params,
}: {
  params: Promise<{ animalSlug: string }>;
}) {
  const { animalSlug } = await params;
  const category = getAnimalCategoryBySlug(animalSlug);
  if (category) {
    return <AnimalCategoryPage category={category} />;
  }

  const animal = getPublishedAnimalBySlug(animalSlug);
  if (!animal) notFound();

  const mainGallery =
    animal.galleries.find((gallery) => gallery.slug === "gallery") ?? animal.galleries[0];
  const { hero: primaryImage, galleryImages, sectionImages } = planAnimalPageImages(
    animal,
    animal.coreBody,
    mainGallery?.slug,
  );
  const habitatSlug = getHabitatSlug(animal);
  const dietSlug = getDietSlug(animal);
  const hasGallery = galleryImages.length >= MIN_GALLERY_IMAGES;

  return (
    <div className="animal-page">
      <AnimalPageBackdrop />
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
        <JsonLd data={buildImageGallerySchema(animal, galleryImages, mainGallery?.intro)} />
      ) : null}

      {/* Hero */}
      <AnimalSection className="pb-5 pt-4 sm:pt-5" tight>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Animals", href: "/animals" },
            { label: animal.core.name },
          ]}
        />

        <div className="mt-3">
          <AnimalPageHero
            eyebrow={animal.core.taxonomy.class}
            conservationStatus={animal.core.conservationStatus}
            title={animal.core.heroTitle}
            summary={animal.core.summary}
            teaser={animal.core.funFacts[0]}
            image={primaryImage}
            actions={
              <>
                <a href="#gallery" className="animal-hero__action animal-hero__action--primary">
                  See photos
                </a>
                {habitatSlug ? (
                  <Link
                    href={`/habitats/${habitatSlug}`}
                    className="animal-hero__action animal-hero__action--secondary"
                  >
                    Same habitat
                  </Link>
                ) : null}
                {dietSlug ? (
                  <Link
                    href={`/diets/${dietSlug}`}
                    className="animal-hero__action animal-hero__action--secondary"
                  >
                    Same diet
                  </Link>
                ) : null}
              </>
            }
          />
        </div>
      </AnimalSection>

      {/* Quick facts */}
      <AnimalSection tight>
        <FactGrid animal={animal} />
      </AnimalSection>

      {/* Photo gallery — single section, no separate /gallery route */}
      {hasGallery ? (
        <AnimalSection tight>
          <AnimalGallery
            sectionId="gallery"
            title={mainGallery.title}
            intro={mainGallery.intro}
            images={galleryImages}
          />
        </AnimalSection>
      ) : null}

      {/* Core article */}
      <AnimalSection tight>
        <div className="mb-5 max-w-3xl">
          <p className="eyebrow eyebrow--light">Core article</p>
          <h2 className="section-title mt-3 text-[var(--forest-deep)]">
            {animal.core.name} in a nutshell
          </h2>
          <p className="mt-2 text-base leading-7 text-[var(--muted)] sm:text-lg">
            Habitat, diet, behavior, and more — everything on one page.
          </p>
        </div>
        <CoreArticleExplorer source={animal.coreBody} sectionImages={sectionImages} />
      </AnimalSection>

      {/* Taxonomy + fun facts — independent row, natural height */}
      <AnimalSection tight>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <TaxonomyPanel taxonomy={animal.core.taxonomy} />
          <FunFactsPanel facts={animal.core.funFacts} />
        </div>
      </AnimalSection>

      {/* FAQ */}
      <AnimalSection tight>
        <AnimalFaqSection animalName={animal.core.name} items={animal.core.faq} />
      </AnimalSection>

      <AnimalSection tight>
        <AdSlot label="Ad slot after FAQ" />
      </AnimalSection>

      {/* Related animals */}
      <AnimalSection tight className="pb-10 sm:pb-14">
        <RelatedClusters animal={animal} />
      </AnimalSection>
    </div>
  );
}
