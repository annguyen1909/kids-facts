import type { AnimalRecord } from "@/lib/types";

/** Deterministic daily pick — same animal all day, rotates over the catalog. */
export function getAnimalOfTheDay(animals: AnimalRecord[], date = new Date()): AnimalRecord {
  if (animals.length === 0) {
    throw new Error("getAnimalOfTheDay requires at least one published animal");
  }

  const dayIndex = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  return animals[dayIndex % animals.length];
}
