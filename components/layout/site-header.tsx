import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const quickLinks = [
  { href: "/animals", label: "Animals", tone: "forest" },
  { href: "/habitats", label: "Habitats", tone: "sky" },
  { href: "/diets", label: "Diets", tone: "warm" },
] as const;

const navToneClass = {
  forest:
    "hover:border-[var(--forest)] hover:bg-[rgba(61,143,110,0.12)] hover:text-[var(--forest-deep)]",
  sky: "hover:border-[var(--sky)] hover:bg-[rgba(122,168,196,0.16)] hover:text-[var(--sky-deep)]",
  warm: "hover:border-[var(--warm)] hover:bg-[rgba(199,122,56,0.14)] hover:text-[var(--warm)]",
} as const;

function NavLink({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: (typeof quickLinks)[number]["tone"];
}) {
  return (
    <Link href={href} className={`site-header__nav-link ${navToneClass[tone]}`}>
      {label}
    </Link>
  );
}

function SearchField({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/animals" className={className}>
      <label htmlFor={id} className="sr-only">
        Search animals
      </label>
      <div className="site-header__search">
        <Search className="h-4 w-4 shrink-0 text-[var(--forest)]" aria-hidden />
        <input
          id={id}
          name="query"
          type="search"
          placeholder="Search animals…"
          className="site-header__search-input"
        />
      </div>
    </form>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__accent" aria-hidden />
      <div className="section-shell site-header__bar">
        <Link href="/" className="site-header__brand">
          <Image
            src="/brand/logo-mark.svg"
            alt=""
            width={40}
            height={40}
            className="site-header__logo"
            priority
          />
          <span className="min-w-0">
            <span className="site-header__title">{siteConfig.name}</span>
            <span className="site-header__tagline">{siteConfig.tagline}</span>
          </span>
        </Link>

        <nav className="site-header__nav-desktop" aria-label="Main">
          {quickLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <SearchField id="site-search" className="site-header__search-desktop" />
        <SearchField id="site-search-mobile" className="site-header__search-mobile" />
      </div>

      <nav className="site-header__nav-mobile" aria-label="Main">
        <div className="site-header__nav-mobile-track">
          {quickLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </nav>
    </header>
  );
}
