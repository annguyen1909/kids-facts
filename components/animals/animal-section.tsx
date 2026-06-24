import { cn } from "@/lib/utils";

type AnimalSectionProps = {
  className?: string;
  innerClassName?: string;
  tight?: boolean;
  children: React.ReactNode;
};

export function AnimalSection({
  className,
  innerClassName,
  tight = false,
  children,
}: AnimalSectionProps) {
  return (
    <section className={cn(tight ? "animal-section--tight" : "section-band", className)}>
      <div className={cn("section-shell", innerClassName)}>{children}</div>
    </section>
  );
}

export function AnimalPageBackdrop() {
  return <div className="animal-page__backdrop" aria-hidden="true" />;
}
