import Link from "next/link";
import {
  BookOpen,
  Camera,
  Compass,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Users,
} from "lucide-react";
import { InfoFeatureCard, InfoSection } from "@/components/layout/info-section";
import { InfoPageShell } from "@/components/layout/info-page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "About",
  description: `Learn about ${siteConfig.name} — an independent wildlife encyclopedia for readers of every age, with photos, quick facts, and clear science.`,
  path: "/about",
});

const standards = [
  {
    icon: Sparkles,
    title: "Clear, accessible tone",
    description:
      "Plain language, short sections, and facts readers can understand without a science degree.",
    tone: "forest" as const,
  },
  {
    icon: BookOpen,
    title: "Science-first",
    description:
      "Taxonomy, habitat, diet, and conservation checked against museums, IUCN, GBIF, and similar sources.",
    tone: "sky" as const,
  },
  {
    icon: Camera,
    title: "Honest images",
    description:
      "Every photo is labeled with species, caption, and license or attribution — including Wikimedia Commons.",
    tone: "warm" as const,
  },
  {
    icon: HeartHandshake,
    title: "Ongoing updates",
    description:
      "Pages are revised when facts change or when a reader reports something that needs fixing.",
    tone: "default" as const,
  },
];

export default function AboutPage() {
  return (
    <InfoPageShell
      title="About"
      path="/about"
      eyebrow="Our story"
      tone="forest"
      intro={`${siteConfig.name} is an independent educational website built for curious readers of every age.`}
      chips={[
        { label: "Independent project" },
        { label: "Readers of every age" },
        { label: "Free to read" },
      ]}
    >
      <InfoSection icon={Compass} title="What we do" tone="sky">
        <p>
          We publish clear, photo-led animal pages with quick facts, notable trivia, FAQs, and
          easy-to-read articles. Each page is designed so you can skim for answers or read deeper
          for research — without clutter getting in the way.
        </p>
        <p>
          Explore our growing collection on the{" "}
          <Link href="/animals">animals index</Link>, or start with popular pages like{" "}
          <Link href="/animals/lion">lion facts</Link> and{" "}
          <Link href="/animals/tiger">tiger facts</Link>.
        </p>
      </InfoSection>

      <InfoSection icon={Users} title="Who runs this site" tone="forest">
        <p>
          {siteConfig.name} is created and maintained independently — not by a large publisher or
          classroom brand. One person handles research, writing, image sourcing, and site updates.
          That keeps the focus on useful content rather than corporate filler.
        </p>
        <p>
          You do not need to know the owner&apos;s personal name to use the site. If you have a
          question, correction, or partnership idea, reach us through the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </InfoSection>

      <div>
        <p className="eyebrow eyebrow--light">Editorial standards</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-3xl">
          How we write every page
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {standards.map((item) => (
            <InfoFeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>

      <InfoSection icon={GraduationCap} title="Who this site is for" tone="warm">
        <p>
          The site is written for readers of every age — students, families, educators, homeschoolers,
          and anyone who wants reliable animal facts with strong photos. We aim to support research,
          classroom reading, and casual browsing — not to replace a textbook or a visit to a zoo.
        </p>
      </InfoSection>

      <div className="info-page__cta rounded-[1.75rem] bg-[var(--forest)] px-6 py-7 text-white shadow-[0_28px_60px_rgba(42,107,82,0.22)] sm:px-8 sm:py-8">
        <p className="eyebrow eyebrow--dark">Start exploring</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Ready to explore your next animal page?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/88">
          Browse photos, quick facts, and clear articles — or jump straight into a popular page.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/animals" className={cn(buttonVariants({ size: "lg" }))}>
            Explore all animals
          </Link>
          <Link href="/privacy" className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </InfoPageShell>
  );
}
