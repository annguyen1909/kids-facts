import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnimalRecord } from "@/lib/types";
import { getAnimalImageForDisplay } from "@/lib/images";

type LandingHeroProps = {
  animalCount: number;
  heroAnimal: AnimalRecord;
  heroPanelAnimal: AnimalRecord;
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
  heroPanelAnimal,
  heroImage,
  heroPanelImage,
}: LandingHeroProps) {
  const heroStats = [
    { label: "Animal pages", value: `${animalCount}+` },
    { label: "Field photos", value: "Every profile" },
    { label: "Trail routes", value: "Habitat / Diet" },
  ] as const;

  return (
    <section className="relative w-full overflow-hidden bg-black min-h-[85vh] flex items-center justify-center -mt-[4.5rem] lg:-mt-[5.5rem]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 parallax-bg -top-[15%] h-[115%]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          unoptimized={heroImage.unoptimized}
          className="object-cover opacity-70"
          sizes="100vw"
        />
        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="section-shell relative z-10 w-full flex flex-col lg:flex-row items-end justify-between gap-10 pb-16 pt-32 lg:pt-48">
        {/* Left Side: Main Typography */}
        <div className="flex-1 max-w-3xl">
          <p className="eyebrow text-white/70 font-semibold uppercase tracking-widest text-sm mb-4">
            Field Guide Expedition
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-serif">
            Explore wildlife like a naturalist in the field
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-white/80 max-w-2xl font-light">
            Photo-led animal profiles, quick taxonomy, and habitat trails for curious readers
            moving from one discovery to the next.
          </p>
          
          <form action="/animals" className="mt-8 relative max-w-md group">
            <label htmlFor="landing-search" className="sr-only">
              Search animals
            </label>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/60 transition-colors group-focus-within:text-white" aria-hidden />
            </div>
            <input
              id="landing-search"
              name="query"
              type="search"
              placeholder="Search lions, dolphins, whales…"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[var(--forest)] focus:bg-white/15 transition-all font-serif italic text-lg"
            />
          </form>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/animals">
              <Button size="lg" className="bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)] border-none px-8 rounded-full h-12 text-base">
                Explore animals
              </Button>
            </Link>
            <Link href={`/animals/${heroAnimal.core.slug}`}>
              <Button size="lg" variant="secondary" className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 hover:text-white rounded-full h-12 text-base">
                Read about {heroAnimal.core.name}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Glassmorphic Field Note */}
        <aside 
          className="w-full lg:w-[420px] shrink-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 ambient-glow relative overflow-hidden group/card mt-12 lg:mt-0"
          style={{ '--ambient-color': 'rgba(122, 168, 196, 0.4)' } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
          <Link href={`/animals/${heroPanelAnimal.core.slug}`} className="relative block z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Featured Specimen</span>
              <span className="h-2 w-2 rounded-full bg-[var(--forest)] animate-pulse" />
            </div>
            
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6 shadow-inner">
               <Image
                src={heroPanelImage.src}
                alt={heroPanelImage.alt}
                fill
                priority
                unoptimized={heroPanelImage.unoptimized}
                className="object-cover transition-transform duration-1000 group-hover/card:scale-105"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>

            <h2 className="text-3xl font-bold text-white font-serif">{heroPanelAnimal.core.name}</h2>
            <p className="text-white/70 italic mt-1 text-sm">{heroPanelAnimal.core.scientificName}</p>
            
            <dl className="mt-6 space-y-3">
              {heroStats.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-white/60">{item.label}</dt>
                  <dd className="text-sm font-semibold text-white text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Link>
        </aside>
      </div>
    </section>
  );
}
