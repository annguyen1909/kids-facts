"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/animals", label: "Animals", tone: "forest" },
  { href: "/habitats", label: "Habitats", tone: "sky" },
  { href: "/diets", label: "Diets", tone: "warm" },
] as const;

const navToneClass = {
  forest:
    "hover:border-[var(--forest)] hover:bg-[rgba(61,143,110,0.12)] hover:text-[var(--forest-deep)] data-[active=true]:border-[var(--forest)] data-[active=true]:bg-[rgba(61,143,110,0.14)] data-[active=true]:text-[var(--forest-deep)]",
  sky: "hover:border-[var(--sky)] hover:bg-[rgba(122,168,196,0.16)] hover:text-[var(--sky-deep)] data-[active=true]:border-[var(--sky)] data-[active=true]:bg-[rgba(122,168,196,0.18)] data-[active=true]:text-[var(--sky-deep)]",
  warm: "hover:border-[var(--warm)] hover:bg-[rgba(199,122,56,0.14)] hover:text-[var(--warm)] data-[active=true]:border-[var(--warm)] data-[active=true]:bg-[rgba(199,122,56,0.16)] data-[active=true]:text-[var(--warm)]",
} as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/animals") {
    return (
      pathname === "/animals" ||
      (pathname.startsWith("/animals/") && !pathname.startsWith("/animals/compare"))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  tone,
  pathname,
}: {
  href: string;
  label: string;
  tone: (typeof quickLinks)[number]["tone"];
  pathname: string;
}) {
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      className={cn("site-header__nav-link", navToneClass[tone])}
      data-active={active ? "true" : "false"}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function SiteHeaderNav({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  return (
    <>
      {quickLinks.map((link) => (
        <NavLink key={`${variant}-${link.href}`} {...link} pathname={pathname} />
      ))}
    </>
  );
}
