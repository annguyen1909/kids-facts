import Image from "next/image";
import { getDisplayImageSrc, isWikimediaCommonsUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

type FrameAspect = "hero" | "card" | "banner" | "square" | "gallery";

const aspectClasses: Record<FrameAspect, string> = {
  hero: "aspect-[5/4]",
  card: "aspect-[3/2]",
  banner: "aspect-[2/1]",
  square: "aspect-square",
  gallery: "aspect-[4/3]",
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
}: AnimalImageFrameProps) {
  const displaySrc = getDisplayImageSrc(src);

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
        src={displaySrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={isWikimediaCommonsUrl(src)}
        className={cn(
          fit === "contain" ? "object-contain object-center" : "object-cover object-center",
          imageClassName,
        )}
      />
    </div>
  );
}
