import Image from "next/image";
import Link from "next/link";
import { getCategoryHref, type AnimalCategory } from "@/lib/animal-categories";

type AnimalCategoryCardProps = {
  category: AnimalCategory;
  animalCount: number;
  image: {
    src: string;
    alt: string;
    unoptimized?: boolean;
  };
};

export function AnimalCategoryCard({ category, animalCount, image }: AnimalCategoryCardProps) {
  return (
    <Link
      href={getCategoryHref(category.slug)}
      className="group relative block aspect-[5/3] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--forest-deep)] shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--forest)]/40"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        unoptimized={image.unoptimized}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 180px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.9)] via-[rgba(15,23,42,0.35)] to-[rgba(15,23,42,0.08)]" />
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <h3 className="text-sm font-bold tracking-tight text-white">{category.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[0.6875rem] leading-4 text-white/78">
          {category.examples}
        </p>
        <p className="mt-1 text-[0.6875rem] font-semibold text-white/92">
          {animalCount} animal{animalCount === 1 ? "" : "s"} →
        </p>
      </div>
    </Link>
  );
}
