import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  default: "border-[var(--line)] bg-white",
  forest: "border-[rgba(61,143,110,0.22)] bg-[rgba(61,143,110,0.06)]",
  sky: "border-[rgba(122,168,196,0.28)] bg-[rgba(122,168,196,0.1)]",
  warm: "border-[rgba(199,122,56,0.24)] bg-[rgba(199,122,56,0.08)]",
} as const;

const iconToneStyles = {
  default: "bg-[rgba(61,143,110,0.12)] text-[var(--forest)]",
  forest: "bg-[rgba(61,143,110,0.16)] text-[var(--forest-deep)]",
  sky: "bg-[rgba(122,168,196,0.22)] text-[var(--sky-deep)]",
  warm: "bg-[rgba(199,122,56,0.16)] text-[var(--warm)]",
} as const;

export function InfoSection({
  id,
  icon: Icon,
  title,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  icon?: LucideIcon;
  title: string;
  tone?: keyof typeof toneStyles;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "info-section scroll-mt-28 rounded-[1.5rem] border p-5 shadow-[var(--shadow)] sm:p-6",
        toneStyles[tone],
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        {Icon ? (
          <div
            className={cn(
              "info-section__icon flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]",
              iconToneStyles[tone],
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="info-section__title font-serif text-2xl tracking-tight text-[var(--forest-deep)] sm:text-3xl">
            {title}
          </h2>
          <div className="info-section__body prose prose-compact mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function InfoCallout({
  title,
  tone = "sky",
  children,
}: {
  title?: string;
  tone?: "sky" | "warm" | "forest";
  children: React.ReactNode;
}) {
  const styles = {
    sky: "border-[rgba(122,168,196,0.35)] bg-[rgba(122,168,196,0.14)]",
    warm: "border-[rgba(199,122,56,0.3)] bg-[rgba(199,122,56,0.12)]",
    forest: "border-[rgba(61,143,110,0.28)] bg-[rgba(61,143,110,0.1)]",
  } as const;

  return (
    <aside
      className={cn(
        "rounded-[1.25rem] border px-5 py-4 text-base leading-7 text-[var(--foreground)]/88 sm:px-6 sm:py-5",
        styles[tone],
      )}
    >
      {title ? (
        <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--forest-deep)]">
          {title}
        </p>
      ) : null}
      <div className={title ? "mt-2" : undefined}>{children}</div>
    </aside>
  );
}

export function InfoFeatureCard({
  icon: Icon,
  title,
  description,
  tone = "default",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <div
      className={cn(
        "info-feature-card flex h-full flex-col rounded-[1.35rem] border p-5 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-0.5 sm:p-6",
        toneStyles[tone],
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[0.85rem]",
          iconToneStyles[tone],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 font-serif text-xl tracking-tight text-[var(--forest-deep)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)] sm:text-base">{description}</p>
    </div>
  );
}
