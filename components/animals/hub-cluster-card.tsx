import Image from "next/image";
import Link from "next/link";
import type { HubCluster } from "@/lib/hub-clusters";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";
import type { AnimalRecord } from "@/lib/types";

export function HubClusterCard({
  cluster,
  type,
  featuredAnimal,
}: {
  cluster: HubCluster;
  type: "habitats" | "diets";
  featuredAnimal?: AnimalRecord;
}) {
  const pathPrefix = `/${type}` as const;
  const animal = featuredAnimal ?? cluster.animals[0];
  if (!animal) return null;

  const image = getAnimalImageForDisplay(getAnimalPrimaryImage(animal));

  return (
    <Link
      href={`${pathPrefix}/${cluster.slug}`}
      className="group relative block aspect-[5/3] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--forest-deep)] shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--forest)]/40"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        unoptimized={image.unoptimized}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.9)] via-[rgba(15,23,42,0.35)] to-[rgba(15,23,42,0.08)]" />
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <h3 className="text-sm font-bold tracking-tight text-white">{cluster.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-[0.6875rem] leading-4 text-white/78">
          {cluster.description}
        </p>
        <p className="mt-1 text-[0.6875rem] font-semibold text-white/92">
          {cluster.animals.length} animal{cluster.animals.length === 1 ? "" : "s"} →
        </p>
      </div>
    </Link>
  );
}
