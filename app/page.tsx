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
  title: "Wildlife Encyclopedia",
  description:
    "Explore a photo-led wildlife encyclopedia with popular animals, categories, quick facts, and discovery paths for readers of every age.",
  path: "/",
});

const categoryCardTones = ["forest", "sky", "warm", "sky", "forest"] as const;

export default function HomePage() {
  const animals = getPublishedAnimals();
  const featured = animals.slice(0, 3);
  const animalOfTheDay = getAnimalOfTheDay(animals);
  const featuredSlugs = new Set(featured.map((a) => a.core.slug));
  const recentAnimals = [...animals]
    .reverse()
    .filter((a) => !featuredSlugs.has(a.core.slug))
    .slice(0, 3);
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
        heroPanelAnimal={heroPanelAnimal}
        heroImage={heroImage}
        heroPanelImage={heroPanelImage}
      />

      <LandingSection className="is-compact mt-12 lg:mt-16">
        <DiscoveryStrip />
      </LandingSection>

      <LandingSection className="home-featured-section animate-on-scroll">
          <div className="home-section-heading home-section-heading--split">
            <div className="max-w-3xl">
              <p className="eyebrow eyebrow--light">Popular animals</p>
              <h2 className="section-title mt-3 text-[var(--forest-deep)] font-serif text-4xl">
                Start with a few field-guide profiles
              </h2>
              <p className="mt-3 body-lead">
                Big photos, easy facts, and bonus pages about where each animal lives and what it eats.
              </p>
            </div>
            <Link href="/animals" className="section-link">
              See all animals
            </Link>
          </div>
          <div className="home-featured-grid">
            {featured.map((animal, index) => (
              <AnimalCard
                key={animal.core.slug}
                animal={animal}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        </LandingSection>

      <ExploreTrailsSection
        habitatClusters={habitatClusters}
        dietClusters={dietClusters}
      />

      <LandingSection id="featured-topics" tint="forest" pattern="forest" className="category-field-section">
        <div className="home-section-heading">
          <p className="eyebrow eyebrow--light">Explore by category</p>
          <h2 className="section-title mt-3 text-[var(--forest-deep)]">
            Pick a group from the animal kingdom
          </h2>
          <p className="mt-3 body-lead">
            Choose a category to explore mammals, birds, fish, and more.
          </p>
        </div>
        <div className="category-field-grid">
          {ANIMAL_CATEGORIES.map((category, index) => {
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
                  tone={categoryCardTones[index % categoryCardTones.length]}
                  variant={index === 1 || index === 3 ? "plate" : "photo"}
                />
              );
            })}
        </div>
      </LandingSection>

      <LandingSection tint="cream" pattern="cream" className="daily-specimen-section">
        <div className="daily-specimen">
          <Link href={`/animals/${animalOfTheDay.core.slug}`} className="daily-specimen__media group">
            <Image
              src={animalOfTheDayImage.src}
              alt={animalOfTheDayImage.alt}
              fill
              unoptimized={animalOfTheDayImage.unoptimized}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
            <span className="daily-specimen__stamp">Animal of the day</span>
            <span className="daily-specimen__caption">
              <strong>{animalOfTheDay.core.name}</strong>
              <em>{animalOfTheDay.core.taxonomy.class}</em>
            </span>
          </Link>
          <article className="daily-specimen__sheet">
            <p className="field-label field-label--warm">Today&apos;s field note</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-4xl">
              {animalOfTheDay.core.name}
            </h2>
            <p className="scientific-name mt-1">{animalOfTheDay.core.scientificName}</p>
            <p className="mt-4 body-lead">{animalOfTheDay.core.summary}</p>
            <div className="daily-specimen__facts">
              {(
                [
                  { label: "Habitat", value: getHabitatLabel(animalOfTheDay.core.habitat) },
                  { label: "Diet", value: animalOfTheDay.core.dietType },
                  { label: "Family", value: animalOfTheDay.core.taxonomy.family },
                  { label: "Trend", value: animalOfTheDay.core.populationTrend },
                  {
                    label: "Status",
                    value: (
                      <ConservationStatusBadge status={animalOfTheDay.core.conservationStatus} />
                    ),
                  },
                ] as const
              ).map((fact) => (
                <div key={fact.label} className="daily-specimen__fact">
                  <p className="daily-specimen__fact-label">{fact.label}</p>
                  <div className="daily-specimen__fact-value">
                    {typeof fact.value === "string" ? <p>{fact.value}</p> : fact.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href={`/animals/${animalOfTheDay.core.slug}`}>
                <Button size="lg">Read today&apos;s feature</Button>
              </Link>
            </div>
          </article>
        </div>
      </LandingSection>

      <LandingSection className="quick-notes-section">
          <div className="quick-notes">
            <div className="quick-notes__intro max-w-2xl lg:sticky lg:top-32">
              <p className="field-label">Notebook margin</p>
              <h2 className="section-title mt-3 text-[var(--forest-deep)] font-serif text-4xl">
                Notable animal facts
              </h2>
              <p className="mt-1 text-lg font-semibold text-[var(--muted)]">
                Featuring {animalOfTheDay.core.name} today
              </p>
              <p className="mt-3 body-lead">
                Handy highlights for quick reference, conversation, or the start of a lesson.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 lg:mt-0">
              {animalOfTheDay.core.funFacts.map((fact, index) => {
                return (
                  <article 
                    key={fact} 
                    className="relative p-8 rounded-[2rem] overflow-hidden border border-[var(--line)] bg-[var(--surface-strong)] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-[var(--forest)]/30 group animate-on-scroll-fast"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Watermark Number */}
                    <div className="absolute -top-4 -right-2 font-serif text-[5rem] font-bold leading-none text-[var(--forest)]/5 transition-transform duration-700 group-hover:scale-105 group-hover:text-[var(--forest)]/10 select-none pointer-events-none">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] font-serif text-sm font-medium text-[var(--muted)] transition-colors group-hover:border-[var(--forest)]/30 group-hover:bg-[var(--forest)]/5 group-hover:text-[var(--forest-deep)]">
                          {index + 1}
                        </span>
                      </div>
                      
                      <p className="text-[var(--foreground)] flex-1 text-[1.05rem] leading-[1.6] font-light">
                        {fact}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </LandingSection>

      <LandingSection tint="forest-soft" pattern="warm" className="expedition-log-section">
          <div className="home-section-heading">
            <p className="eyebrow eyebrow--light">Recently added animals</p>
            <h2 className="section-title mt-3 text-[var(--forest-deep)]">
              New pages from the expedition log
            </h2>
            <p className="mt-3 body-lead">
              Fresh animals added over time. Great for readers who love learning something new on each visit.
            </p>
          </div>
          <div className="expedition-log-grid">
            {recentAnimals.map((animal, index) => (
              <AnimalCard
                key={animal.core.slug}
                animal={animal}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
      </LandingSection>

      <LandingSection id="learning-zone" className="relative mt-24 mb-12 animate-on-scroll">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--forest-surface-deep)] px-8 py-16 sm:px-12 lg:px-16 text-white shadow-xl">
          {/* Subtle noise/texture overlay if applicable, or just solid elegant color */}
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
          
          <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <p className="eyebrow eyebrow--light mb-6 text-white/70">For learning & reference</p>
              
              <h2 className="text-3xl font-serif text-white sm:text-4xl md:text-5xl leading-[1.2]">
                Skim for answers or read deeper
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/80 font-light">
                Clear photos, concise facts, and structured pages without clutter — whether you
                are researching, teaching, or simply browsing for curiosity.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/animals">
                  <Button size="lg" variant="secondary">
                    Browse animals
                  </Button>
                </Link>
                <Link href="/habitats">
                  <Button size="lg" className="bg-transparent text-white border border-white/20 hover:bg-white/10">
                    Explore habitats
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {[
                { num: "01", title: "Quick facts", desc: "For fast answers and quick stats." },
                { num: "02", title: "Support pages", desc: "Detailed context for school reports." },
                { num: "03", title: "Photo galleries", desc: "Curated high-quality images for talks." },
                { num: "04", title: "Deep links", desc: "Connects creatures, habitats, and diets." }
              ].map((feature, i) => (
                <div key={i} className="group border-t border-white/20 pt-6">
                  <span className="mb-4 block font-serif text-xl text-white/40 group-hover:text-white/70 transition-colors duration-300">
                    {feature.num}
                  </span>
                  <h3 className="mb-3 text-xl font-medium text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70 font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
