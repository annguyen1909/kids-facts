import { formatDisplayLabel } from "@/lib/format-display";
import { siteFeatures } from "@/lib/site-features";
import type { HubType } from "@/lib/types";

const hubIndexPaths: Partial<Record<HubType, string>> = {
  habitats: "/habitats",
  diets: "/diets",
};

function normalizeInternalPath(path: string) {
  if (!path.startsWith("/")) return null;

  const [pathname] = path.split(/[?#]/, 1);
  return pathname.replace(/\/+$/, "") || "/";
}

export function getHubIndexPath(type: HubType) {
  return hubIndexPaths[type];
}

export function getHubTypeLabel(type: HubType) {
  return formatDisplayLabel(type.replace(/-/g, " "));
}

export function isNavigableInternalPath(path: string) {
  const normalized = normalizeInternalPath(path);
  if (!normalized) return false;

  if (normalized === "/") return true;

  const staticRoutes = new Set([
    "/about",
    "/animals",
    "/contact",
    "/diets",
    "/habitats",
    "/privacy",
    "/terms",
  ]);

  if (staticRoutes.has(normalized)) return true;
  if (normalized.startsWith("/animals/compare")) return siteFeatures.compare;
  if (normalized.startsWith("/topics/")) return true;
  if (normalized.startsWith("/animals/")) return true;
  if (normalized.startsWith("/habitats/")) return true;
  if (normalized.startsWith("/diets/")) return true;
  if (normalized.startsWith("/families/")) return true;
  if (normalized.startsWith("/conservation-status/")) return true;

  return false;
}

export function isIndexablePath(path: string) {
  const normalized = normalizeInternalPath(path);
  if (!normalized) return false;

  if (/^\/animals\/[^/]+\/images\/[^/]+$/.test(normalized)) {
    return false;
  }

  if (normalized === "/families" || normalized === "/conservation-status") {
    return false;
  }

  if (normalized.startsWith("/topics")) {
    return siteFeatures.topics;
  }

  if (normalized.startsWith("/animals/compare")) {
    return siteFeatures.compare;
  }

  return isNavigableInternalPath(normalized);
}
