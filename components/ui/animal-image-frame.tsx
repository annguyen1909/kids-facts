import Image from "next/image";
import { getAnimalImageForDisplay } from "@/lib/images";
import { cn } from "@/lib/utils";

type FrameAspect = "hero" | "card" | "banner" | "square" | "gallery";

const aspectClasses: Record<FrameAspect, string> = {
  hero: "aspect-[5/4]",
  card: "aspect-[3/2]",
  banner: "aspect-[2/1]",
  square: "aspect-square",
  gallery: "aspect-[4/5]",
};

type AnimalImageFrameProps = {
  src: string;
  alt: string;
  aspect?: FrameAspect;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  updatedAt?: string;
};

export function AnimalImageFrame({
  src,
  alt,
  aspect = "card",
  fit = "cover",
  priority = false,
  sizes = "100vw",
  className,
  imageClassName,
  objectPosition,
  updatedAt,
}: AnimalImageFrameProps) {
  const display = getAnimalImageForDisplay({ src, alt, objectPosition, updatedAt });

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[rgba(23,49,39,0.06)]",
        aspectClasses[aspect],
        fit === "contain" && "p-3",
        className,
      )}
    >
      <Image
        src={display.src}
        alt={display.alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={display.unoptimized}
        referrerPolicy="no-referrer"
        className={cn(
          fit === "contain" ? "object-contain" : "object-cover",
          fit === "contain" && !display.objectPosition && "object-center",
          !fit && !display.objectPosition && "object-center",
          imageClassName,
        )}
        style={display.objectPosition ? { objectPosition: display.objectPosition } : undefined}
      />
    </div>
  );
}
