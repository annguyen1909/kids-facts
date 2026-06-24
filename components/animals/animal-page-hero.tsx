import Image from "next/image";
import { ConservationStatusBadge } from "@/components/ui/conservation-status-badge";
import { getDisplayImageSrc, isWikimediaCommonsUrl } from "@/lib/images";
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
};

export function AnimalPageHero({
  eyebrow,
  conservationStatus,
  title,
  summary,
  teaser,
  image,
  actions,
}: AnimalPageHeroProps) {
  const displaySrc = getDisplayImageSrc(image.src);

  return (
    <article className="animal-hero">
      <div className="animal-hero__media">
        <Image
          src={displaySrc}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          unoptimized={isWikimediaCommonsUrl(image.src)}
          className="object-cover object-center"
        />
        <div className="animal-hero__caption">
          <p className="animal-hero__caption-text">{image.caption}</p>
        </div>
      </div>

      <div className="animal-hero__body">
        <div className="animal-hero__body-inner">
          <header className="animal-hero__head">
            <div className="animal-hero__topline">
              <span className="animal-hero__class">{eyebrow}</span>
              {conservationStatus ? (
                <>
                  <span className="animal-hero__topline-sep" aria-hidden>
                    ·
                  </span>
                  <ConservationStatusBadge status={conservationStatus} />
                </>
              ) : null}
            </div>
            <h1 className="animal-hero__title">{title}</h1>
          </header>
          <div className="animal-hero__copy">
            <p className="animal-hero__summary">{summary}</p>
            {teaser ? <p className="animal-hero__teaser">{teaser}</p> : null}
          </div>
        </div>
        {actions ? <footer className="animal-hero__actions">{actions}</footer> : null}
      </div>
    </article>
  );
}
