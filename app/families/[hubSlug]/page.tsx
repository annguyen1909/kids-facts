import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubPage } from "@/components/animals/hub-page";
import { getStaticFamilyHubRoutes, resolveHubRoute } from "@/lib/content";
import { buildHubMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticFamilyHubRoutes();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hubSlug: string }>;
}): Promise<Metadata> {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("families", hubSlug);
  return resolved?.type === "hub" ? buildHubMetadata(resolved.hub) : {};
}

export default async function FamilyHubPage({ params }: { params: Promise<{ hubSlug: string }> }) {
  const { hubSlug } = await params;
  const resolved = resolveHubRoute("families", hubSlug);
  if (!resolved || resolved.type !== "hub") notFound();
  return <HubPage hub={resolved.hub} animals={resolved.animals} />;
}
