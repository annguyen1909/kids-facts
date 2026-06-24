export type ConservationTone =
  | "safe"
  | "watch"
  | "vulnerable"
  | "endangered"
  | "critical"
  | "extinct"
  | "unknown";

export function getConservationTone(status: string): ConservationTone {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("least concern")) return "safe";
  if (normalized.includes("near threatened")) return "watch";
  if (normalized.includes("critically endangered")) return "critical";
  if (normalized.includes("endangered")) return "endangered";
  if (normalized.includes("vulnerable")) return "vulnerable";
  if (normalized.includes("extinct")) return "extinct";
  if (normalized.includes("data deficient") || normalized.includes("not evaluated")) {
    return "unknown";
  }

  return "unknown";
}
