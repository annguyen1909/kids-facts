import type { ReactNode } from "react";
import Image from "next/image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type PageHeroShellProps = {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  tone?: "light" | "forest";
  compact?: boolean;
  slim?: boolean;
  split?: boolean; // Legacy prop, no longer strictly enforced in centered design
  coverImage?: string;
};

export function PageHeroShell({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
  compact = false,
  slim = false,
  coverImage,
}: PageHeroShellProps) {
  const hasCover = Boolean(coverImage);

  return (
    <section 
      className={cn(
        "relative overflow-hidden",
        !hasCover && tone === "forest" ? "bg-forest-deep text-white" : "",
        !hasCover && tone === "light" ? "bg-gradient-to-b from-surface to-background text-foreground" : "",
        hasCover ? "bg-black text-white" : "",
        compact ? "py-12 md:py-16" : "py-20 md:py-32",
        slim ? "pt-12 md:pt-16" : ""
      )}
    >
      {hasCover && (
        <>
          <Image
            src={coverImage!}
            alt=""
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="mb-8 md:mb-12">
          <Breadcrumbs items={breadcrumbs} light={hasCover || tone === "forest"} />
        </div>
        
        <p 
          className={cn(
            "font-sans font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 md:mb-6",
            hasCover ? "text-white/80" : (tone === "forest" ? "text-forest-leaf" : "text-muted")
          )}
        >
          {eyebrow}
        </p>
        
        <h1 
          className={cn(
            "font-serif tracking-tight leading-[1.1] mb-6",
            compact ? "text-4xl md:text-5xl" : "text-5xl md:text-7xl lg:text-[5.5rem]",
            hasCover ? "text-white drop-shadow-lg" : (tone === "forest" ? "text-white" : "text-forest-deep")
          )}
        >
          {title}
        </h1>
        
        <p 
          className={cn(
            "max-w-2xl mx-auto font-sans leading-relaxed text-lg md:text-xl",
            hasCover ? "text-white/90 drop-shadow-md font-medium" : (tone === "forest" ? "text-forest-leaf/90" : "text-muted")
          )}
        >
          {intro}
        </p>

        {children && (
          <div className="mt-10 md:mt-16 w-full max-w-3xl mx-auto">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
