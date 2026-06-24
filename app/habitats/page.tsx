import type { Metadata } from "next";
import { HubIndexPage } from "@/components/animals/hub-index-page";
import { getHabitatClusters } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Animal Habitats",
  description:
    "Browse animals by habitat — savanna, ocean, forest, and more. Wildlife photos and facts for each place animals live.",
  path: "/habitats",
});

export const revalidate = 86400;

export default function HabitatsIndexPage() {
  return (
    <HubIndexPage
      type="habitats"
      title="Explore animals by habitat"
      intro="Each animal belongs to one habitat. Pick a place — savanna, ocean, forest, polar, and more — then browse photos and facts."
      clusters={getHabitatClusters()}
    />
  );
}
