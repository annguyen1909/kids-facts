import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, light = false }: { items: BreadcrumbItem[]; light?: boolean }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${light ? "text-white/70" : "text-[var(--muted)]"}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky)] focus-visible:ring-offset-2 ${
                    light 
                      ? "text-white/70 hover:text-white" 
                      : "text-[var(--muted)] hover:text-[var(--forest-deep)]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? `font-semibold ${light ? "text-white drop-shadow-md" : "text-[var(--forest-deep)]"}` : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="h-4 w-4" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
