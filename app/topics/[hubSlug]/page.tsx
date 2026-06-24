import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubPage } from "@/components/animals/hub-page";
import { getAllHubs, resolveHubRoute } from "@/lib/content";
import { buildHubMetadata } from "@/lib/metadata";
import { disabledFeatureRobots, siteFeatures } from "@/lib/site-features";

export function generateStaticParams() {
  return getAllHubs()
    .filter((hub) => hub.type === "topics")
    .map((hub) => ({ hubSlug: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hubSlug: string }>;
}): Promise<Metadata> {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("topics", hubSlug);
  return resolved?.type === "hub"
    ? {
        ...buildHubMetadata(resolved.hub),
        ...(siteFeatures.topics ? {} : { robots: disabledFeatureRobots }),
      }
    : {};
}

export default async function TopicHubPage({ params }: { params: Promise<{ hubSlug: string }> }) {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("topics", hubSlug);
  if (!resolved || resolved.type !== "hub") notFound();
  return <HubPage hub={resolved.hub} animals={resolved.animals} />;
}
