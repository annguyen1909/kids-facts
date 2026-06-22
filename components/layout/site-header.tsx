import Link from "next/link";
import { Compass, Search, Telescope } from "lucide-react";

const quickLinks = [
  { href: "/animals", label: "Animals" },
  { href: "/habitats/savanna", label: "Habitats" },
  { href: "/diets/carnivore", label: "Diets" },
  { href: "/topics/social-animals", label: "Topics" },
  { href: "/animals/compare/lion-vs-african-elephant", label: "Compare" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(23,49,39,0.08)] bg-[rgba(244,241,232,0.9)] backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex flex-col gap-4 py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-white shadow-[0_12px_24px_rgba(36,83,65,0.22)]">
                <Telescope className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-xl">
                  Animal Facts for Kids
                </p>
                <p className="truncate text-sm text-[var(--muted)]">
                  A wildlife encyclopedia for curious readers
                </p>
              </div>
            </Link>
            <form action="/animals" className="hidden items-center gap-2 lg:flex">
              <label htmlFor="site-search" className="sr-only">
                Search animals
              </label>
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/90 px-3 shadow-[0_10px_22px_rgba(23,49,39,0.06)]">
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <input
                  id="site-search"
                  name="query"
                  type="search"
                  placeholder="Search animals, habitats, or diets"
                  className="h-11 w-72 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--forest)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--sky)] hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 rounded-full bg-[rgba(122,168,196,0.12)] px-4 py-2 text-sm font-semibold text-[var(--sky-deep)] md:flex">
              <Compass className="h-4 w-4" />
              Discover an animal, follow its habitat, compare what it eats, and keep exploring.
            </div>
          </div>

          <form action="/animals" className="flex items-center gap-2 lg:hidden">
            <label htmlFor="site-search-mobile" className="sr-only">
              Search animals
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--line)] bg-white/90 px-3 shadow-[0_10px_22px_rgba(23,49,39,0.06)]">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <input
                id="site-search-mobile"
                name="query"
                type="search"
                placeholder="Search animals"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
