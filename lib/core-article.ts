import type { AnimalImageKind } from "@/lib/types";

export type MdxSection = {
  title: string;
  body: string;
};

export type SectionConfig = {
  imageType?: AnimalImageKind;
  coreRole?: string;
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

  if (normalized.includes("where") || normalized.includes("habitat")) {
    return { imageType: "habitat", coreRole: "habitat" };
  }

  if (normalized.includes("eat") || normalized.includes("diet")) {
    return { imageType: "diet", coreRole: "diet" };
  }

  if (
    normalized.includes("color") ||
    normalized.includes("colour") ||
    normalized.includes("marking") ||
    normalized.includes("appearance")
  ) {
    return { imageType: "closeup", coreRole: "closeup" };
  }

  if (
    normalized.includes("together") ||
    normalized.includes("pride") ||
    normalized.includes("families") ||
    normalized.includes("family") ||
    normalized.includes("herd") ||
    normalized.includes("horde") ||
    normalized.includes("social") ||
    normalized.includes("pods") ||
    normalized.includes("pod") ||
    normalized.includes("behave") ||
    normalized.includes("behavior") ||
    normalized.includes("communicat") ||
    (normalized.includes("how do") && !normalized.includes("where"))
  ) {
    return { imageType: "family", coreRole: "family" };
  }

  if (
    normalized.includes("life cycle") ||
    normalized.includes("calves") ||
    normalized.includes("cubs") ||
    normalized.includes("bab")
  ) {
    return { imageType: "baby", coreRole: "baby" };
  }

  if (
    normalized.includes("big") ||
    normalized.includes("fast") ||
    normalized.includes("size")
  ) {
    return { imageType: "closeup", coreRole: "closeup" };
  }

  if (
    normalized.includes("risk") ||
    normalized.includes("threat") ||
    normalized.includes("conservation") ||
    normalized.includes("at risk")
  ) {
    return { imageType: "range", coreRole: "range" };
  }

  return {};
}

export function coreImageSlugPrefix(animalSlug: string): string {
  if (animalSlug === "african-elephant") return "elephant";
  if (animalSlug === "bottlenose-dolphin") return "dolphin";
  return animalSlug;
}

export function coreImageSlug(animalSlug: string, coreRole: string): string {
  return `${coreImageSlugPrefix(animalSlug)}-core-${coreRole}`;
}
