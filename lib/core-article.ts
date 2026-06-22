import type { AnimalImageKind, SupportingPageSlug } from "@/lib/types";

export type MdxSection = {
  title: string;
  body: string;
};

export type SectionConfig = {
  slug?: SupportingPageSlug;
  imageType?: AnimalImageKind;
  slugIncludes?: string;
};

export function splitMdxSections(source: string): MdxSection[] {
  return source
    .split(/^## /m)
    .filter(Boolean)
    .map((block) => {
      const newline = block.indexOf("\n");
      const title = newline === -1 ? block.trim() : block.slice(0, newline).trim();
      const body = newline === -1 ? "" : block.slice(newline + 1).trim();
      return { title, body };
    });
}

export function matchSectionConfig(title: string): SectionConfig {
  const normalized = title.toLowerCase();

  if (normalized.includes("what is") || normalized.includes("what are")) {
    return { imageType: "hero" };
  }

  if (normalized.includes("where") || normalized.includes("live")) {
    return { slug: "habitat", imageType: "habitat" };
  }
  if (normalized.includes("eat") || normalized.includes("diet")) {
    return { slug: "diet", imageType: "diet", slugIncludes: "eating" };
  }
  if (
    normalized.includes("together") ||
    normalized.includes("pride") ||
    normalized.includes("behavior") ||
    normalized.includes("behave")
  ) {
    return { slug: "behavior", imageType: "family" };
  }
  if (normalized.includes("life cycle") || normalized.includes("grow")) {
    return { slug: "life-cycle", imageType: "baby" };
  }
  if (
    normalized.includes("risk") ||
    normalized.includes("threat") ||
    normalized.includes("conservation")
  ) {
    return { slug: "predators-and-threats", imageType: "range" };
  }
  if (normalized.includes("look") || normalized.includes("adapt")) {
    return { slug: "adaptations", imageType: "closeup" };
  }
  if (normalized.includes("cub") || normalized.includes("bab")) {
    return { slug: "babies", imageType: "baby" };
  }

  return {};
}

export function getCoreArticleLinkedSlugs(source: string): SupportingPageSlug[] {
  const [, ...topicSections] = splitMdxSections(source);

  return [
    ...new Set(
      topicSections
        .map((section) => matchSectionConfig(section.title).slug)
        .filter((slug): slug is SupportingPageSlug => Boolean(slug)),
    ),
  ];
}
