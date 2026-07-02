import Image from "next/image";
import Link from "next/link";
import { getCategoryHref, type AnimalCategory } from "@/lib/animal-categories";

type AnimalCategoryCardProps = {
  category: AnimalCategory;
  animalCount: number;
  variant?: "photo" | "plate";
  tone?: "forest" | "sky" | "warm";
  image: {
    src: string;
    alt: string;
    unoptimized?: boolean;
  };
};

export function AnimalCategoryCard({
  category,
  animalCount,
  image,
  tone = "forest",
}: AnimalCategoryCardProps) {
  const toneClasses = {
    forest: "bg-[var(--forest-surface)]",
    sky: "bg-[var(--sky-surface)]",
    warm: "bg-[var(--warm-surface)]",
  }[tone];

  return (
    <Link
      href={getCategoryHref(category.slug)}
      className="group flex flex-col items-center cursor-pointer"
    >
      <div className={`relative w-full aspect-square overflow-hidden rounded-[8rem_8rem_0_0] ${toneClasses} ring-1 ring-black/5 shadow-md group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-700`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized={image.unoptimized}
          className="object-cover group-hover:scale-105 transition-all duration-1000"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 220px"
        />
        {/* Soft overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="mt-6 text-center flex flex-col items-center px-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
          {category.labels[0] ?? "category"}
        </span>
        <span className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)] group-hover:text-[var(--forest)] transition-colors duration-500">
          {category.title}
        </span>
        <span className="text-sm italic text-[var(--muted)] mt-1">
          {category.examples}
        </span>
        <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--forest)] group-hover:translate-x-1 transition-transform duration-300">
          Explore {animalCount} {animalCount === 1 ? "animal" : "animals"} &rarr;
        </span>
      </div>
    </Link>
  );
}
