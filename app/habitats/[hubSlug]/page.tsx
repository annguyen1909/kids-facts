import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubPage } from "@/components/animals/hub-page";
import { getAllHubs, resolveHubRoute } from "@/lib/content";
import { buildHubMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getAllHubs()
    .filter((hub) => hub.type === "habitats")
    .map((hub) => ({ hubSlug: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hubSlug: string }>;
}): Promise<Metadata> {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("habitats", hubSlug);
  return resolved?.type === "hub" ? buildHubMetadata(resolved.hub) : {};
}

export default async function HabitatHubPage({ params }: { params: Promise<{ hubSlug: string }> }) {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("habitats", hubSlug);
  if (!resolved || resolved.type !== "hub") notFound();
  return <HubPage hub={resolved.hub} animals={resolved.animals} />;
}
