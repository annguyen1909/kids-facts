import Image from "next/image";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { getAnimalImageForDisplay } from "@/lib/images";
import type { AnimalImage } from "@/lib/types";
import type { ReactNode } from "react";

type AnimalPageHeroProps = {
  eyebrow: string;
  conservationStatus?: string;
  title: string;
  summary: string;
  teaser?: string;
  image: AnimalImage;
  actions?: ReactNode;
  slug?: string;
};

export function AnimalPageHero({
  eyebrow,
  conservationStatus,
  title,
  summary,
  teaser,
  image,
  actions,
  slug,
}: AnimalPageHeroProps) {
  const display = getAnimalImageForDisplay(image);

  return (
    <article className="group relative overflow-hidden rounded-[2.5rem] bg-black ring-1 ring-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] aspect-auto min-h-[75vh] flex flex-col justify-end">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={display.src}
          alt={display.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 100vw"
          unoptimized={display.unoptimized}
          referrerPolicy="no-referrer"
          className="object-cover scale-[1.02] transition-transform duration-[20s] ease-out group-hover:scale-[1.08] opacity-85"
          style={{ 
            objectPosition: display.objectPosition || "center",
            ...(slug ? { viewTransitionName: `animal-image-${slug}` } : {})
          } as React.CSSProperties}
        />
        {/* Rich multi-stop gradient for perfect text legibility and editorial mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      <div className="absolute top-6 right-6 z-20 text-white/40 text-xs italic pointer-events-none drop-shadow-md">
        {image.caption}
      </div>

      <div className="relative z-10 px-8 pb-12 pt-32 sm:px-16 sm:pb-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-md">
            {eyebrow}
          </span>
          {conservationStatus ? (
            <ConservationStatusBadge status={conservationStatus} />
          ) : null}
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-xl transition-colors duration-700">
          {title}
        </h1>

        {teaser ? (
          <p className="font-serif text-2xl sm:text-3xl italic text-white/80 mb-6 max-w-3xl leading-relaxed drop-shadow-md">
            "{teaser}"
          </p>
        ) : null}

        <p className="text-lg sm:text-xl text-white/70 max-w-3xl leading-relaxed mb-10 drop-shadow-sm font-medium">
          {summary}
        </p>

        {actions ? (
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}
