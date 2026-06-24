import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumb";

type PageHeroShellProps = {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  tone?: "light" | "forest";
  compact?: boolean;
  slim?: boolean;
  split?: boolean;
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
  split = false,
}: PageHeroShellProps) {
  const heroToneClass = tone === "forest" ? "page-hero page-hero--forest" : "page-hero";
  const heroClass = [
    heroToneClass,
    slim ? "page-hero--slim" : "",
    split ? "page-hero--split" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const bandClass = [
    compact ? "page-hero-band page-hero-band--compact" : "page-hero-band",
    slim ? "page-hero-band--slim" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={bandClass}>
      <div className="section-shell">
        <Breadcrumbs items={breadcrumbs} />
        <div className={heroClass}>
          <div className="page-hero__copy">
            <p className={tone === "forest" ? "eyebrow eyebrow--dark" : "eyebrow eyebrow--light"}>
              {eyebrow}
            </p>
            <h1 className="page-hero__title">{title}</h1>
            <p className="page-hero__intro">{intro}</p>
          </div>
          {children ? <div className="page-hero__extra">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
