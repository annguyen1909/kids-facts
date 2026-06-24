import type { ReactNode } from "react";
import { SectionPattern, type SectionVariant } from "@/components/ui/section-pattern";
import { cn } from "@/lib/utils";

type LandingTint = "sky" | "forest" | "forest-soft" | "warm" | "cream";

type LandingSectionProps = {
  id?: string;
  tint?: LandingTint;
  pattern?: SectionVariant;
  className?: string;
  shellClassName?: string;
  children: ReactNode;
};

const tintClass: Record<LandingTint, string> = {
  sky: "landing-section--tint-sky",
  forest: "landing-section--tint-forest",
  "forest-soft": "landing-section--tint-forest-soft",
  warm: "landing-section--tint-warm",
  cream: "landing-section--tint-cream",
};

export function LandingPageCanvas() {
  return <div className="landing-page__backdrop" aria-hidden="true" />;
}

export function LandingSection({
  id,
  tint,
  pattern,
  className,
  shellClassName,
  children,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("section-band landing-section", tint && tintClass[tint], className)}
    >
      {pattern ? <SectionPattern variant={pattern} /> : null}
      <div className={cn("section-shell landing-section__shell", shellClassName)}>{children}</div>
    </section>
  );
}
