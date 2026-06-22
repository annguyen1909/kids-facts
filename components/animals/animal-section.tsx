import { cn } from "@/lib/utils";
import { SectionPattern } from "@/components/ui/section-pattern";
import type { SectionVariant } from "@/components/ui/section-pattern";

export type { SectionVariant };

type AnimalSectionProps = {
  variant?: SectionVariant;
  className?: string;
  innerClassName?: string;
  tight?: boolean;
  children: React.ReactNode;
};

const variantOverlay: Record<SectionVariant, string> = {
  default: "animal-section-overlay--default",
  hero: "animal-section-overlay--hero",
  sky: "animal-section-overlay--sky",
  forest: "animal-section-overlay--forest",
  warm: "animal-section-overlay--warm",
  cream: "animal-section-overlay--cream",
};

export function AnimalSection({
  variant = "default",
  className,
  innerClassName,
  tight = false,
  children,
}: AnimalSectionProps) {
  return (
    <section
      className={cn(
        "animal-section",
        tight ? "animal-section--tight" : "section-band",
        className,
      )}
    >
      <SectionPattern variant={variant} />
      <div className={cn("animal-section__overlay", variantOverlay[variant])} aria-hidden="true" />
      <div className={cn("section-shell animal-section__content", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
