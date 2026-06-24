import manifest from "@/content/decorations/manifest.json";
import type { DecorationManifest, DecorationManifestItem } from "@/lib/decorations/types";

const decorationManifest = manifest as DecorationManifest;

export function getDecorationById(id: string): DecorationManifestItem | undefined {
  return decorationManifest.items.find((item) => item.id === id);
}

export function getDecorationsByPlacement(placement: string): DecorationManifestItem[] {
  return decorationManifest.items.filter((item) => item.placement.includes(placement));
}
