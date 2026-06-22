import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { getAllAnimals, resolveImageRoute } from "@/lib/content";
import { getAbsoluteUrl, getAnimalImageForDisplay } from "@/lib/images";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildImageSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getAllAnimals().flatMap((animal) =>
    animal.images.map((image) => ({
      animalSlug: animal.core.slug,
      imageSlug: image.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ animalSlug: string; imageSlug: string }>;
}): Promise<Metadata> {
  const { animalSlug, imageSlug } = await params;
  const resolved = resolveImageRoute(animalSlug, imageSlug);
  return resolved?.type === "image"
    ? buildPageMetadata({
        title: `${resolved.animal.core.name} image`,
        description: resolved.image.caption,
        path: `/animals/${resolved.animal.core.slug}/images/${resolved.image.slug}`,
        image: resolved.image.src,
      })
    : {};
}

export default async function AnimalImagePage({
  params,
}: {
  params: Promise<{ animalSlug: string; imageSlug: string }>;
}) {
  const { animalSlug, imageSlug } = await params;
  const resolved = resolveImageRoute(animalSlug, imageSlug);
  if (!resolved || resolved.type !== "image") notFound();

  const displayImage = getAnimalImageForDisplay(resolved.image);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: "Animals", item: getAbsoluteUrl("/animals") },
          {
            name: resolved.animal.core.name,
            item: getAbsoluteUrl(`/animals/${resolved.animal.core.slug}`),
          },
          {
            name: resolved.image.slug,
            item: getAbsoluteUrl(
              `/animals/${resolved.animal.core.slug}/images/${resolved.image.slug}`,
            ),
          },
        ])}
      />
      <JsonLd data={buildImageSchema(resolved.image)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Animals", href: "/animals" },
          { label: resolved.animal.core.name, href: `/animals/${resolved.animal.core.slug}` },
          { label: "Image" },
        ]}
      />
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={displayImage.src}
            alt={displayImage.alt}
            fill
            unoptimized={displayImage.unoptimized}
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950">
          {resolved.animal.core.name} image detail
        </h1>
        <p className="mt-3 text-lg leading-8 text-slate-600">{resolved.image.caption}</p>
      </section>
    </div>
  );
}
