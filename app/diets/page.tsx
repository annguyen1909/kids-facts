import type { Metadata } from "next";
import { HubIndexPage } from "@/components/animals/hub-index-page";
import { getDietClusters } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Animal Diets",
  description:
    "Browse carnivores, herbivores, and omnivores with wildlife photos and facts about what each animal eats.",
  path: "/diets",
});

export const revalidate = 86400;

export default function DietsIndexPage() {
  return (
    <HubIndexPage
      type="diets"
      title="Explore animals by diet"
      intro="See which animals are carnivores, herbivores, or omnivores — then open full fact pages with photos and quick science."
      clusters={getDietClusters()}
    />
  );
}
