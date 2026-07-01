import { cn } from "@/lib/utils";

type AnimalSectionProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  tight?: boolean;
  children: React.ReactNode;
};

export function AnimalSection({
  id,
  className,
  innerClassName,
  tight = false,
  children,
}: AnimalSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "animate-on-scroll",
        tight ? "animal-section--tight" : "section-band",
        id ? "scroll-mt-28" : undefined,
        className,
      )}
    >
      <div className={cn("section-shell", innerClassName)}>{children}</div>
    </section>
  );
}

export function AnimalPageBackdrop() {
  return <div className="animal-page__backdrop" aria-hidden="true" />;
}
