import Image from "next/image";
import Link from "next/link";
import type { HubCluster } from "@/lib/hub-clusters";
import { getAnimalImageForDisplay, getAnimalPrimaryImage, getCoverObjectPosition } from "@/lib/images";
import type { AnimalRecord } from "@/lib/types";

export function HubClusterCard({
  cluster,
  type,
  featuredAnimal,
  variant = "default",
}: {
  cluster: HubCluster;
  type: "habitats" | "diets";
  featuredAnimal?: AnimalRecord;
  variant?: "default" | "featured";
}) {
  const pathPrefix = `/${type}` as const;
  const animal = featuredAnimal ?? cluster.animals[0];
  if (!animal) return null;

  const primaryImage = getAnimalPrimaryImage(animal);
  const image = getAnimalImageForDisplay(primaryImage);
  const objectPosition = getCoverObjectPosition(primaryImage);

  return (
    <Link
      href={`${pathPrefix}/${cluster.slug}`}
      className={`hub-cluster-card hub-cluster-card--${variant} group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-[#0a110d] shadow-2xl ring-1 ring-black/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] ${
        variant === "featured" ? "aspect-[4/5] md:aspect-square" : "aspect-[4/5] sm:aspect-square"
      }`}
    >
      {/* Blurred background layer for depth */}
      <Image
        src={image.src}
        alt=""
        fill
        unoptimized={image.unoptimized}
        className="object-cover blur-2xl opacity-40 scale-125 transition-transform duration-[1.5s] group-hover:scale-150"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 800px"
      />
      {/* Foreground image layer */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        unoptimized={image.unoptimized}
        className={`object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 ${variant === "featured" ? "opacity-85 group-hover:opacity-100" : "opacity-85 group-hover:opacity-100"}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 800px"
        style={objectPosition ? { objectPosition } : undefined}
      />
      
      {/* Deep cinematic gradient overlay */}
      <div className={`absolute inset-0 pointer-events-none ${variant === "featured" ? "bg-gradient-to-t from-black/95 via-black/40 to-black/10" : "bg-gradient-to-t from-black/90 via-black/30 to-transparent"}`} />
      
      {/* Content */}
      <div className={`relative z-10 flex flex-col text-white ${variant === "featured" ? "p-8 sm:p-12 lg:p-14" : "p-5"}`}>
        <h3 className={`font-serif font-bold tracking-tight drop-shadow-md text-[var(--surface)] transition-all duration-500 group-hover:text-white group-hover:-translate-y-1 ${variant === "featured" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl"}`}>
          {cluster.name}
        </h3>
        <p className={`${variant === "featured" ? "mt-4 text-base sm:text-lg lg:text-xl max-w-2xl" : "hidden"} text-white/70 font-sans leading-relaxed drop-shadow-sm transition-all duration-700 delay-75 group-hover:text-white/90 group-hover:-translate-y-1`}>
          {cluster.description}
        </p>
        
        <div className={`flex items-center overflow-hidden ${variant === "featured" ? "mt-8" : "mt-4"}`}>
          <span className="flex items-center text-xs font-bold uppercase tracking-widest text-white/60 transition-all duration-500 group-hover:text-white group-hover:translate-x-2">
            Explore {cluster.animals.length} animal{cluster.animals.length === 1 ? "" : "s"} 
            <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-500 group-hover:bg-white group-hover:text-black">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
