import Link from "next/link";
import {
  ArrowRight,
  Footprints,
  Leaf,
  MapPin,
  PawPrint,
  Shield,
  Users,
} from "lucide-react";
import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { MdxSnippet } from "@/components/mdx/mdx-snippet";
import { pickAnimalImage } from "@/lib/animal-images";
import { matchSectionConfig, splitMdxSections } from "@/lib/core-article";
import type { AnimalRecord } from "@/lib/types";

type SectionVisualConfig = {
  icon: typeof PawPrint;
  accent: "forest" | "sky" | "warm";
};

const accentStyles = {
  forest: {
    icon: "bg-[rgba(36,83,65,0.1)] text-[var(--forest)]",
    border: "border-[rgba(36,83,65,0.18)]",
    chip: "bg-[rgba(36,83,65,0.08)] text-[var(--forest)]",
  },
  sky: {
    icon: "bg-[rgba(122,168,196,0.18)] text-[var(--sky-deep)]",
    border: "border-[rgba(122,168,196,0.28)]",
    chip: "bg-[rgba(122,168,196,0.12)] text-[var(--sky-deep)]",
  },
  warm: {
    icon: "bg-[rgba(199,122,56,0.14)] text-[var(--warm)]",
    border: "border-[rgba(199,122,56,0.28)]",
    chip: "bg-[rgba(199,122,56,0.12)] text-[var(--warm)]",
  },
};

function getSectionVisual(title: string): SectionVisualConfig {
  const normalized = title.toLowerCase();

  if (normalized.includes("what is")) {
    return { icon: PawPrint, accent: "forest" };
  }
  if (normalized.includes("where") || normalized.includes("live")) {
    return { icon: MapPin, accent: "sky" };
  }
  if (normalized.includes("eat") || normalized.includes("diet")) {
    return { icon: Leaf, accent: "warm" };
  }
  if (
    normalized.includes("together") ||
    normalized.includes("pride") ||
    normalized.includes("behavior") ||
    normalized.includes("behave")
  ) {
    return { icon: Users, accent: "forest" };
  }
  if (normalized.includes("life cycle") || normalized.includes("grow")) {
    return { icon: Footprints, accent: "sky" };
  }
  if (
    normalized.includes("risk") ||
    normalized.includes("threat") ||
    normalized.includes("conservation")
  ) {
    return { icon: Shield, accent: "warm" };
  }

  return { icon: PawPrint, accent: "forest" };
}

async function SectionCard({
  animal,
  title,
  body,
}: {
  animal: AnimalRecord;
  title: string;
  body: string;
}) {
  const config = matchSectionConfig(title);
  const visual = getSectionVisual(title);
  const styles = accentStyles[visual.accent];
  const image = pickAnimalImage(animal, {
    imageType: config.imageType,
    slugIncludes: config.slugIncludes,
  });
  const href = config.slug ? `/animals/${animal.core.slug}/${config.slug}` : null;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[1.35rem] border bg-white/95 shadow-[0_10px_28px_rgba(23,49,39,0.06)] backdrop-blur-sm ${styles.border}`}
    >
      {image ? (
        <AnimalImageFrame
          src={image.src}
          alt={image.alt}
          aspect="card"
          sizes="(max-width: 768px) 100vw, 40vw"
          className="border-b border-[var(--line)]"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
          >
            <visual.icon className="h-4 w-4" />
          </span>
          <h3 className="pt-1 text-lg font-bold leading-snug text-[var(--forest-deep)]">
            {title}
          </h3>
        </div>

        <div className="mt-3 flex-1">
          <MdxSnippet source={body} />
        </div>

        {href ? (
          <Link
            href={href}
            className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${styles.chip} transition-opacity hover:opacity-80`}
          >
            Learn more
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export async function CoreArticleExplorer({
  animal,
  source,
}: {
  animal: AnimalRecord;
  source: string;
}) {
  const sections = splitMdxSections(source);
  if (!sections.length) return null;

  const [intro, ...topicSections] = sections;
  const introVisual = getSectionVisual(intro.title);

  return (
    <div className="space-y-4">
      <article className="rounded-[1.5rem] border border-[rgba(36,83,65,0.15)] bg-white/95 p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-7">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${accentStyles[introVisual.accent].icon}`}
          >
            <introVisual.icon className="h-4 w-4" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
            Start here
          </p>
        </div>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-3xl">
          {intro.title}
        </h3>
        <div className="mt-3 max-w-3xl">
          <MdxSnippet source={intro.body} />
        </div>
      </article>

      {topicSections.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {topicSections.map((section) => (
            <SectionCard
              key={section.title}
              animal={animal}
              title={section.title}
              body={section.body}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
