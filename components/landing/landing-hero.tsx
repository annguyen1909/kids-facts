import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnimalRecord } from "@/lib/types";
import { getAnimalImageForDisplay } from "@/lib/images";

type LandingHeroProps = {
  animalCount: number;
  heroAnimal: AnimalRecord;
  heroImage: ReturnType<typeof getAnimalImageForDisplay>;
  heroPanelImage: ReturnType<typeof getAnimalImageForDisplay>;
};

const quickLinks = [
  { href: "/animals", label: "All animals" },
  { href: "#explore-trails", label: "Habitats & diets" },
  { href: "#featured-topics", label: "Categories" },
  { href: "#learning-zone", label: "Learning resources" },
] as const;

export function LandingHero({
  animalCount,
  heroAnimal,
  heroImage,
  heroPanelImage,
}: LandingHeroProps) {
  return (
    <section className="section-band landing-hero-band pb-6 pt-5 sm:pt-8">
      <div className="section-shell">
        <div className="landing-hero-grid">
          <div className="landing-hero-panel">
            <Image
              src={heroPanelImage.src}
              alt=""
              fill
              priority
              unoptimized={heroPanelImage.unoptimized}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              aria-hidden
            />
            <div className="landing-hero-panel__overlay" />
            <div className="landing-hero-panel__content">
              <p className="eyebrow eyebrow--dark">Digital encyclopedia</p>
              <h1 className="display-title mt-4 max-w-3xl font-extrabold text-white">
                Discover amazing animals, one page at a time
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-7 text-white/90">
                Large wildlife photos and clear facts. Search for a species or browse from one page
                to the next in a few clicks.
              </p>

              <form action="/animals" className="landing-hero-search mt-6">
                <label htmlFor="landing-search" className="sr-only">
                  Search animals
                </label>
                <Search className="h-5 w-5 shrink-0 text-white/80" aria-hidden />
                <input
                  id="landing-search"
                  name="query"
                  type="search"
                  placeholder="Search lions, dolphins, whales…"
                  className="landing-hero-search__input"
                />
                <button type="submit" className="landing-hero-search__button">
                  Search
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="landing-hero-chip">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/animals">
                  <Button size="lg">Explore animals</Button>
                </Link>
                <Link href={`/animals/${heroAnimal.core.slug}`}>
                  <Button size="lg" variant="secondary">
                    Read about {heroAnimal.core.name}
                  </Button>
                </Link>
              </div>

              <div className="landing-hero-stats mt-6">
                {[
                  { label: "Animal pages", value: `${animalCount}+` },
                  { label: "Big photos", value: "Every page" },
                  { label: "Learning paths", value: "Habitat · Diet · Gallery" },
                ].map((item) => (
                  <div key={item.label} className="landing-hero-stat">
                    <p className="landing-hero-stat__label">{item.label}</p>
                    <p className="landing-hero-stat__value">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={`/animals/${heroAnimal.core.slug}`}
            className="landing-featured-card group"
          >
            <div className="landing-featured-card__media">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                unoptimized={heroImage.unoptimized}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="landing-featured-card__badge">Featured animal</div>
            </div>
            <div className="landing-featured-card__body">
              <h2 className="truncate text-2xl font-extrabold tracking-tight text-[var(--forest-deep)]">
                {heroAnimal.core.name}
              </h2>
              <p className="text-slot-2 mt-2 text-base text-[var(--foreground)]/85">
                {heroAnimal.core.summary}
              </p>
              <p className="landing-featured-card__link mt-3">
                See photos, quick facts, and related pages →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
