"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { getAnimalImageForDisplay } from "@/lib/images";
import type { AnimalImage, AnimalImageKind } from "@/lib/types";

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
  const image = images[activeIndex];
  if (typeof document === "undefined" || !image) return null;

  const label = IMAGE_TYPE_LABELS[image.imageType] ?? image.imageType;
  const display = getAnimalImageForDisplay(image);

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
            key={display.src}
            src={display.src}
            alt={display.alt}
            fill
            unoptimized={display.unoptimized}
            referrerPolicy="no-referrer"
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
        className="group overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-black/5 scroll-mt-24"
      >
        <div className="border-b border-[var(--line)] px-8 py-8 sm:px-12 sm:py-10 bg-[var(--surface-strong)]/20">
          <span className="inline-flex rounded-full bg-[var(--forest-deep)]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--forest-deep)]/20 mb-4">
            Photo Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--forest-deep)]">{title}</h2>
          {intro ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">{intro}</p>
          ) : null}
        </div>

        <div className="p-8 sm:p-12">
          <p className="mb-8 text-sm sm:text-base font-medium text-[var(--muted)]">
            Click any photo to view it larger. {safeImages.length} images available.
          </p>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {safeImages.map((image, index) => {
              const label = IMAGE_TYPE_LABELS[image.imageType] ?? image.imageType;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group/card relative block w-full overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)] ring-1 ring-black/5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 break-inside-avoid text-left"
                >
                  <div className="relative w-full aspect-auto overflow-hidden">
                    <AnimalImageFrame
                      src={image.src}
                      alt={image.alt}
                      updatedAt={image.updatedAt}
                      aspect="gallery"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 pointer-events-none">
                    <span className="inline-block mb-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white ring-1 ring-inset ring-white/30">
                      {label}
                    </span>
                    <p className="text-white font-medium line-clamp-2 drop-shadow-md">
                      {image.caption}
                    </p>
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
