import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bird,
  Bug,
  Fish,
  PawPrint,
  Shell,
  Sparkles,
  Telescope,
} from "lucide-react";
import { AnimalCard } from "@/components/animals/animal-card";
import { JsonLd } from "@/components/layout/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAnimals } from "@/lib/content";
import { getAnimalImageForDisplay, getAnimalPrimaryImage, getAbsoluteUrl } from "@/lib/images";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: "Animal Facts for Kids",
  description:
    "Explore an image-led animal encyclopedia for kids with popular animals, categories, fun facts, and discovery paths built for home and classroom learning.",
  path: "/",
});

const categoryCards = [
  {
    title: "Mammals",
    href: "/families/felidae",
    icon: PawPrint,
    copy: "Big cats, elephants, dolphins, and more warm-blooded explorers.",
  },
  {
    title: "Birds",
    href: "/topics/social-animals",
    icon: Bird,
    copy: "Wings, feathers, nests, migration, and sky-high survival skills.",
  },
  {
    title: "Reptiles",
    href: "/animals",
    icon: Shell,
    copy: "Scales, camouflage, sun-warmed bodies, and ancient lineages.",
  },
  {
    title: "Fish",
    href: "/animals/bottlenose-dolphin/habitat",
    icon: Fish,
    copy: "Ocean habitats, fins, currents, and underwater adaptations.",
  },
  {
    title: "Insects",
    href: "/animals",
    icon: Bug,
    copy: "Tiny bodies, giant ecosystems, and astonishing life cycles.",
  },
];

export default function HomePage() {
  const animals = getAllAnimals();
  const featured = animals.slice(0, 3);
  const animalOfTheDay = animals[0];
  const recentAnimals = [...animals].reverse().slice(0, 3);
  const heroAnimal = featured[0];
  const heroAnimalImage = getAnimalPrimaryImage(heroAnimal);
  const heroImage = getAnimalImageForDisplay(heroAnimalImage);
  const animalOfTheDayImage = getAnimalImageForDisplay(getAnimalPrimaryImage(animalOfTheDay));

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbSchema([{ name: "Home", item: getAbsoluteUrl("/") }])}
      />

      <section className="section-band pb-8 pt-6 sm:pt-10">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="texture-card overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--forest-deep)] px-6 py-8 text-white shadow-[0_28px_60px_rgba(23,49,39,0.18)] sm:px-8 sm:py-10">
              <div className="eyebrow bg-white/10 text-[var(--warm-soft)]">
                Digital Encyclopedia
              </div>
              <h1 className="display-title mt-6 max-w-3xl font-extrabold">
                Big animal discoveries for curious kids.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(255,255,255,0.8)]">
                Follow habitats, compare diets, zoom into wildlife photos, and move from one fascinating animal to the next like you just opened a modern field guide.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/animals">
                  <Button size="lg">
                    Explore animals
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/animals/${heroAnimal.core.slug}`}>
                  <Button size="lg" variant="secondary">
                    Meet {heroAnimal.core.name}
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Animals", value: "500+" },
                  { label: "Photo-led pages", value: "5000+" },
                  { label: "Discovery paths", value: "Habitat, diet, compare" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-sm text-[rgba(255,255,255,0.68)]">{item.label}</p>
                    <p className="mt-2 text-xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[var(--shadow)]">
                <div className="relative aspect-[5/4] sm:aspect-[4/3]">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    priority
                    unoptimized={heroImage.unoptimized}
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
                <div className="px-6 py-5">
                  <p className="eyebrow">Featured animal</p>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--forest-deep)]">
                    {heroAnimal.core.name}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                    {heroAnimalImage.caption}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-[1.5rem] border-[var(--line)] bg-[rgba(122,168,196,0.14)]">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--sky-deep)]">
                        <Telescope className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--sky-deep)]">
                          Explore by trail
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Habitat, life cycle, compare, and image gallery routes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[1.5rem] border-[var(--line)] bg-[rgba(199,122,56,0.14)]">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--warm)]">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--warm)]">
                          Classroom ready
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Quick facts, captions, and supporting pages children can scan fast.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Popular animals</p>
              <h2 className="section-title mt-4 text-[var(--forest-deep)]">
                Start with the animals kids ask about most
              </h2>
            </div>
            <Link href="/animals" className="hidden text-sm font-semibold text-[var(--forest)] lg:block">
              See the full library
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featured.map((animal) => (
              <AnimalCard key={animal.core.slug} animal={animal} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-[rgba(122,168,196,0.08)]" id="featured-topics">
        <div className="section-shell">
          <div>
            <p className="eyebrow">Explore by category</p>
            <h2 className="section-title mt-4 text-[var(--forest-deep)]">
              Follow the branches of the animal kingdom
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {categoryCards.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group texture-card rounded-[1.5rem] border border-[var(--line)] bg-white p-5 transition-all duration-200 hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(36,83,65,0.08)] text-[var(--forest)]">
                  <category.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{category.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="texture-card overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white">
              <div className="relative aspect-[5/4]">
                <Image
                  src={animalOfTheDayImage.src}
                  alt={animalOfTheDayImage.alt}
                  fill
                  unoptimized={animalOfTheDayImage.unoptimized}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[2rem] bg-[var(--surface-strong)] px-6 py-8 shadow-[var(--shadow)] sm:px-8">
              <p className="eyebrow">Animal of the day</p>
              <h2 className="section-title mt-4 text-[var(--forest-deep)]">
                {animalOfTheDay.core.name}
              </h2>
              <p className="mt-4 body-lead">{animalOfTheDay.core.summary}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Habitat", value: animalOfTheDay.core.habitats.join(", ") },
                  { label: "Diet", value: animalOfTheDay.core.dietType },
                  { label: "Family", value: animalOfTheDay.core.taxonomy.family },
                  { label: "Status", value: animalOfTheDay.core.conservationStatus },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-[var(--forest-deep)]">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href={`/animals/${animalOfTheDay.core.slug}`}>
                  <Button size="lg">
                    Read today&apos;s feature
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Fun facts</p>
              <h2 className="section-title mt-4 text-[var(--forest-deep)]">
                Small facts that spark bigger questions
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {heroAnimal.core.funFacts.map((fact, index) => (
              <Card
                key={fact}
                className="rounded-[1.5rem] border-[var(--line)] bg-white transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent>
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--warm)]">
                    Fact {index + 1}
                  </p>
                  <p className="mt-4 text-lg leading-8 text-[var(--forest-deep)]">{fact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-[rgba(36,83,65,0.06)]">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="eyebrow">Recently added animals</p>
              <h2 className="section-title mt-4 text-[var(--forest-deep)]">
                New pages to keep exploration moving
              </h2>
              <p className="mt-4 body-lead">
                Fresh additions help kids discover something new each visit and give parents and teachers new pages to share.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {recentAnimals.map((animal) => {
                const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));
                return (
                  <Link
                    key={animal.core.slug}
                    href={`/animals/${animal.core.slug}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        unoptimized={image.unoptimized}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 24vw"
                      />
                    </div>
                    <div className="px-4 py-4">
                      <h3 className="text-xl font-bold tracking-tight text-[var(--forest-deep)]">
                        {animal.core.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {animal.core.taxonomy.class}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band" id="teacher-zone">
        <div className="section-shell">
          <div className="rounded-[2rem] bg-[var(--forest)] px-6 py-10 text-white shadow-[0_28px_60px_rgba(36,83,65,0.18)] sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div>
                <p className="eyebrow bg-white/10 text-[var(--warm-soft)]">For parents and teachers</p>
                <h2 className="section-title mt-4 text-white">
                  Clear structure for research projects, read-aloud browsing, and classroom curiosity.
                </h2>
              </div>
              <div className="rounded-[1.5rem] bg-white/8 px-5 py-5 text-base leading-8 text-[rgba(255,255,255,0.82)]">
                Use quick facts for fast scanning, support pages for deeper learning, and image galleries for observation-based discussion.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
