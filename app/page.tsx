import Image from "next/image";
import Link from "next/link";
import { AnimalCard } from "@/components/animals/animal-card";
import { AnimalCategoryCard } from "@/components/animals/animal-category-card";
import { DiscoveryStrip } from "@/components/landing/discovery-strip";
import { ExploreTrailsSection } from "@/components/landing/explore-trails-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPageCanvas, LandingSection } from "@/components/ui/landing-section";
import { JsonLd } from "@/components/layout/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { getAnimalOfTheDay } from "@/lib/animal-of-the-day";
import { getHabitatLabel } from "@/lib/canonical-habitats";
import { getPublishedAnimals, getHabitatClusters, getDietClusters } from "@/lib/content";
import {
  ANIMAL_CATEGORIES,
  getAnimalsForCategory,
  getCategoryCardImage,
} from "@/lib/animal-categories";
import { getAnimalImageForDisplay, getAnimalPrimaryImage, getAbsoluteUrl } from "@/lib/images";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { buildUniqueCategoryFeaturedMap } from "@/lib/unique-featured-animals";

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: "Animal Facts",
  description:
    "Explore a photo-led wildlife encyclopedia with popular animals, categories, quick facts, and discovery paths for readers of every age.",
  path: "/",
});

export default function HomePage() {
  const animals = getPublishedAnimals();
  const featured = animals.slice(0, 3);
  const animalOfTheDay = getAnimalOfTheDay(animals);
  const recentAnimals = [...animals].reverse().slice(0, 3);
  const heroAnimal = featured[0];
  const heroAnimalImage = getAnimalPrimaryImage(heroAnimal);
  const heroImage = getAnimalImageForDisplay(heroAnimalImage);
  const heroPanelAnimal = featured[1] ?? heroAnimal;
  const heroPanelImage = getAnimalImageForDisplay(getAnimalPrimaryImage(heroPanelAnimal));
  const animalOfTheDayImage = getAnimalImageForDisplay(getAnimalPrimaryImage(animalOfTheDay));
  const habitatClusters = getHabitatClusters();
  const dietClusters = getDietClusters();
  const categoryFeatured = buildUniqueCategoryFeaturedMap(ANIMAL_CATEGORIES);

  return (
    <div className="landing-page">
      <LandingPageCanvas />
      <JsonLd
        data={buildBreadcrumbSchema([{ name: "Home", item: getAbsoluteUrl("/") }])}
      />

      <LandingHero
        animalCount={animals.length}
        heroAnimal={heroAnimal}
        heroImage={heroImage}
        heroPanelImage={heroPanelImage}
      />

      <LandingSection className="pt-0">
        <DiscoveryStrip />
      </LandingSection>

      <LandingSection>
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="eyebrow eyebrow--light">Popular animals</p>
              <h2 className="section-title mt-3 text-[var(--forest-deep)]">
                Great animals to start with
              </h2>
              <p className="mt-3 body-lead">
                Big photos, easy facts, and bonus pages about where each animal lives and what it eats.
              </p>
            </div>
            <Link
              href="/animals"
              className="shrink-0 text-base font-semibold text-[var(--forest)] lg:block"
            >
              See all animals
            </Link>
          </div>
          <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-3">
            {featured.map((animal) => (
              <AnimalCard key={animal.core.slug} animal={animal} />
            ))}
          </div>
      </LandingSection>

      <ExploreTrailsSection
        habitatClusters={habitatClusters}
        dietClusters={dietClusters}
      />

      <LandingSection id="featured-topics" tint="forest" pattern="forest">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow--light">Explore by category</p>
            <h2 className="section-title mt-3 text-[var(--forest-deep)]">
              Pick a group from the animal kingdom
            </h2>
            <p className="mt-3 body-lead">
              Choose a category to explore mammals, birds, fish, and more.
            </p>
          </div>
          <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {ANIMAL_CATEGORIES.map((category) => {
              const featuredAnimal = categoryFeatured.get(category.slug);
              const image = featuredAnimal
                ? getAnimalImageForDisplay(getAnimalPrimaryImage(featuredAnimal))
                : getCategoryCardImage(category, animals);

              return (
              <AnimalCategoryCard
                key={category.slug}
                category={category}
                animalCount={getAnimalsForCategory(category).length}
                image={image}
              />
              );
            })}
          </div>
      </LandingSection>

      <LandingSection tint="cream" pattern="cream">
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <Link
              href={`/animals/${animalOfTheDay.core.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--forest-deep)]"
            >
                <Image
                  src={animalOfTheDayImage.src}
                  alt={animalOfTheDayImage.alt}
                  fill
                  unoptimized={animalOfTheDayImage.unoptimized}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,23,42,0.75)] to-transparent px-5 pb-5 pt-16">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-white/80">
                    Animal of the day
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">{animalOfTheDay.core.name}</p>
                </div>
            </Link>
            <div className="rounded-[2rem] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow)] sm:px-6">
              <p className="eyebrow eyebrow--light">Animal of the day</p>
              <h2 className="mt-3 text-2xl font-extrabold text-[var(--forest-deep)] sm:text-3xl">
                {animalOfTheDay.core.name}
              </h2>
              <p className="mt-3 body-lead">{animalOfTheDay.core.summary}</p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {(
                  [
                    { label: "Habitat", value: getHabitatLabel(animalOfTheDay.core.habitat) },
                    { label: "Diet", value: animalOfTheDay.core.dietType },
                    { label: "Family", value: animalOfTheDay.core.taxonomy.family },
                    {
                      label: "Status",
                      value: (
                        <ConservationStatusBadge status={animalOfTheDay.core.conservationStatus} />
                      ),
                    },
                  ] as const
                ).map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {fact.label}
                    </p>
                    <div className="mt-1">
                      {typeof fact.value === "string" ? (
                        <p className="text-base font-bold leading-snug text-[var(--forest-deep)]">
                          {fact.value}
                        </p>
                      ) : (
                        fact.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link href={`/animals/${animalOfTheDay.core.slug}`}>
                  <Button size="lg">Read today&apos;s feature</Button>
                </Link>
              </div>
            </div>
          </div>
      </LandingSection>

      <LandingSection>
          <div className="max-w-3xl">
            <div>
              <p className="eyebrow eyebrow--light">Quick facts</p>
              <h2 className="section-title mt-3 text-[var(--forest-deep)]">
                Notable facts about {animalOfTheDay.core.name}
              </h2>
              <p className="mt-3 body-lead">
                Handy highlights for quick reference, conversation, or the start of a lesson.
              </p>
            </div>
          </div>
          <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {animalOfTheDay.core.funFacts.map((fact, index) => (
              <Card
                key={fact}
                className="flex h-full flex-col rounded-[1.5rem] border-[var(--line)] bg-white transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent className="flex h-full flex-col p-5 sm:p-6">
                  <p className="shrink-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--warm)]">
                    Fact {index + 1}
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--forest-deep)] sm:text-lg sm:leading-8">
                    {fact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
      </LandingSection>

      <LandingSection tint="forest-soft" pattern="warm">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow--light">Recently added animals</p>
            <h2 className="section-title mt-3 text-[var(--forest-deep)]">
              New pages to explore
            </h2>
            <p className="mt-3 body-lead">
              Fresh animals added over time. Great for readers who love learning something new on each visit.
            </p>
          </div>
          <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentAnimals.map((animal) => {
                const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));
                return (
                  <Link
                    key={animal.core.slug}
                    href={`/animals/${animal.core.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        unoptimized={image.unoptimized}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2.5 p-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold tracking-tight text-[var(--forest-deep)]">
                          {animal.core.name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs italic text-[var(--muted)]">
                          {animal.core.taxonomy.class}
                        </p>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-[var(--foreground)]/80">
                        {animal.core.summary}
                      </p>
                      <div className="card-meta-panel mt-auto grid grid-cols-2 gap-3">
                        <div className="min-w-0">
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                            Lives
                          </p>
                          <p className="mt-0.5 truncate text-sm font-medium text-[var(--forest-deep)]">
                            {getHabitatLabel(animal.core.habitat)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                            Eats
                          </p>
                          <p className="mt-0.5 truncate text-sm font-medium text-[var(--forest-deep)]">
                            {animal.core.dietType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
      </LandingSection>

      <LandingSection id="learning-zone">
          <div className="rounded-[2rem] bg-[var(--forest)] px-5 py-7 text-white shadow-[0_28px_60px_rgba(42,107,82,0.2)] sm:px-7">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <p className="eyebrow eyebrow--dark">For learning & reference</p>
                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Skim for answers or read deeper — at home, in class, or on the go
                </h2>
                <p className="mt-3 text-base leading-7 text-white/90">
                  Clear photos, concise facts, and structured pages without clutter — whether you
                  are researching, teaching, or browsing for curiosity.
                </p>
                <div className="landing-teacher-actions">
                  <Link href="/animals">
                    <Button size="lg" variant="secondary">
                      Browse animals
                    </Button>
                  </Link>
                  <Link href="/habitats">
                    <Button size="lg" variant="secondary">
                      Explore habitats
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="secondary">
                      About the site
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-black/15 px-5 py-5 text-base leading-7 text-white/90 backdrop-blur-sm">
                <p className="text-slot-4">
                  <strong className="text-white">Quick facts</strong> for fast answers.{" "}
                  <strong className="text-white">Support pages</strong> for reports.{" "}
                  <strong className="text-white">Photo galleries</strong> for group talks. Every animal links to related creatures, habitats, and diets.
                </p>
              </div>
            </div>
          </div>
      </LandingSection>
    </div>
  );
}
