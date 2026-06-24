"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { getDisplayImageSrc, isWikimediaCommonsUrl } from "@/lib/images";
import type { AnimalImage, AnimalImageKind } from "@/lib/types";

const LIGHTBOX_WIDTH = 1280;

const GALLERY_TYPE_ACCENTS: Record<AnimalImageKind, { bg: string; fg: string }> = {
  hero: { bg: "#ede9fe", fg: "#7c3aed" },
  habitat: { bg: "#dbeafe", fg: "#2563eb" },
  diet: { bg: "#dcfce7", fg: "#16a34a" },
  baby: { bg: "#fce7f3", fg: "#db2777" },
  family: { bg: "#ffedd5", fg: "#ea580c" },
  range: { bg: "#ccfbf1", fg: "#0d9488" },
  size: { bg: "#e0e7ff", fg: "#4f46e5" },
  closeup: { bg: "#fef9c3", fg: "#ca8a04" },
  "fun-fact": { bg: "#ffe4e6", fg: "#e11d48" },
  gallery: { bg: "#f3f4f6", fg: "#4b5563" },
};

const IMAGE_TYPE_LABELS: Record<AnimalImageKind, string> = {
  hero: "Featured",
  habitat: "Habitat",
  diet: "Diet",
  baby: "Baby",
  family: "Family",
  range: "Range",
  size: "Size",
  closeup: "Close-up",
  "fun-fact": "Fun fact",
  gallery: "Gallery",
};

type AnimalGalleryProps = {
  title?: string;
  images: AnimalImage[];
  intro?: string;
  sectionId?: string;
};

function useGalleryState(images: AnimalImage[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goTo(activeIndex - 1);
      if (event.key === "ArrowRight") goTo(activeIndex + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, activeIndex, goTo, closeLightbox]);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 48) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    setTouchStartX(null);
  }

  return {
    activeIndex,
    lightboxOpen,
    goTo,
    openLightbox,
    closeLightbox,
    handleTouchStart,
    handleTouchEnd,
  };
}

function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  onTouchStart,
  onTouchEnd,
}: {
  images: AnimalImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const image = images[activeIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !image) return null;

  const label = IMAGE_TYPE_LABELS[image.imageType] ?? image.imageType;
  const displaySrc = getDisplayImageSrc(image.src, LIGHTBOX_WIDTH);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[rgba(10,18,15,0.94)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} photo viewer`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm font-semibold text-white/90">
          {label} · {activeIndex + 1} of {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative min-h-[min(62vh,640px)] flex-1 overflow-hidden rounded-[1.25rem] bg-black/30">
          <Image
            key={displaySrc}
            src={displaySrc}
            alt={image.alt}
            fill
            unoptimized={isWikimediaCommonsUrl(image.src)}
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:left-4"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:right-4"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-6 pt-4 sm:px-6">
        <p className="text-base font-semibold leading-7 text-white">{image.caption}</p>
        <p className="mt-1 text-sm leading-6 text-white/70">{image.alt}</p>
        {image.attributionText ? (
          <p className="mt-2 text-xs leading-5 text-white/55">{image.attributionText}</p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function AnimalGallery({
  title = "Photo gallery",
  images,
  intro,
  sectionId,
}: AnimalGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const { activeIndex, lightboxOpen, openLightbox, closeLightbox, goTo, handleTouchStart, handleTouchEnd } =
    useGalleryState(safeImages);

  if (!safeImages.length) return null;

  return (
    <>
      <section
        id={sectionId}
        className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white shadow-[var(--shadow)] scroll-mt-24"
      >
        <div className="border-b border-[var(--line)] px-5 py-5 sm:px-7 sm:py-6">
          <p className="eyebrow eyebrow--light">Photo gallery</p>
          <h2 className="section-title mt-3 text-[var(--forest-deep)]">{title}</h2>
          {intro ? (
            <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{intro}</p>
          ) : null}
        </div>

        <div className="gallery-grid p-4 sm:p-6">
          <p className="mb-5 text-base text-[var(--muted)]">
            Click any photo to view it larger. {safeImages.length} images.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safeImages.map((image, index) => {
              const label = IMAGE_TYPE_LABELS[image.imageType] ?? image.imageType;
              const accent = GALLERY_TYPE_ACCENTS[image.imageType] ?? GALLERY_TYPE_ACCENTS.gallery;
              const tiltClass = `gallery-card--tilt-${(index % 3) + 1}`;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`gallery-card gallery-card--${image.imageType} ${tiltClass} group text-left`}
                  style={
                    {
                      "--gallery-accent-bg": accent.bg,
                      "--gallery-accent-fg": accent.fg,
                    } as CSSProperties
                  }
                >
                  <div className="gallery-card__tape" aria-hidden />
                  <div className="gallery-card__frame">
                    <AnimalImageFrame
                      src={image.src}
                      alt={image.alt}
                      aspect="card"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                      className="gallery-card__image pointer-events-none"
                    />
                    <div className="gallery-card__shine" aria-hidden />
                  </div>
                  <div className="gallery-card__footer">
                    <p className="gallery-card__label">{label}</p>
                    <p className="gallery-card__caption">{image.caption}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {lightboxOpen ? (
        <GalleryLightbox
          images={safeImages}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrev={() => goTo(activeIndex - 1)}
          onNext={() => goTo(activeIndex + 1)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      ) : null}
    </>
  );
}
