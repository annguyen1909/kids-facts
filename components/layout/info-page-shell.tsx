import Link from "next/link";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHeroShell } from "@/components/animals/page-hero-shell";
import { getAbsoluteUrl } from "@/lib/images";
import { buildBreadcrumbSchema } from "@/lib/schema";

export type InfoPageTocItem = {
  id: string;
  label: string;
};

export function InfoPageShell({
  title,
  path,
  eyebrow = "Site information",
  intro,
  lastUpdated,
  tone = "forest",
  chips,
  toc,
  children,
}: {
  title: string;
  path: string;
  eyebrow?: string;
  intro: string;
  lastUpdated?: string;
  tone?: "light" | "forest";
  chips?: { label: string; href?: string }[];
  toc?: InfoPageTocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="info-page pb-12 sm:pb-16">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", item: getAbsoluteUrl("/") },
          { name: title, item: getAbsoluteUrl(path) },
        ])}
      />

      <PageHeroShell
        tone={tone}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        eyebrow={eyebrow}
        title={title}
        intro={intro}
      >
        {chips?.map((chip) =>
          chip.href ? (
            <Link key={chip.label} href={chip.href} className="page-hero__chip">
              {chip.label}
            </Link>
          ) : (
            <span key={chip.label} className="page-hero__chip">
              {chip.label}
            </span>
          ),
        )}
        {lastUpdated ? (
          <span className="page-hero__chip">
            Updated{" "}
            {new Date(`${lastUpdated}T12:00:00`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : null}
      </PageHeroShell>

      {toc && toc.length > 0 ? (
        <div className="section-shell mt-4 lg:hidden">
          <nav aria-label="On this page" className="info-page__toc-mobile">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="info-page__toc-link">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}

      <div
        className={
          toc && toc.length > 0
            ? "section-shell mt-6 grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-start"
            : "section-shell mt-6"
        }
      >
        {toc && toc.length > 0 ? (
          <aside className="info-page__toc-desktop hidden lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">
              On this page
            </p>
            <nav aria-label="On this page" className="mt-4 space-y-1.5">
              {toc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="info-page__toc-sidebar-link">
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}

        <div className="info-page__content min-w-0 space-y-5">{children}</div>
      </div>
    </div>
  );
}
