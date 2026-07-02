import Image from "next/image";
import Link from "next/link";
import { PrivacySettingsControl } from "@/components/layout/privacy-settings-control";
import { siteConfig } from "@/lib/site-config";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/animals", label: "All animals" },
      { href: "/habitats", label: "Habitats" },
      { href: "/diets", label: "Diets" },
    ],
  },
  {
    title: "Featured paths",
    links: [
      { href: "/animals/lion", label: "Lion facts" },
      { href: "/animals/african-elephant", label: "Elephant facts" },
      { href: "/habitats/savanna", label: "Savanna animals" },
      { href: "/diets/carnivore", label: "Carnivore animals" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-20 bg-[var(--surface)] text-[var(--foreground)] transition-colors duration-300">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-[var(--forest)]/0 via-[var(--forest)]/50 to-[var(--forest)]/0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-16 h-16"
        style={{
          background: `
            linear-gradient(
              180deg,
              transparent 0%,
              color-mix(in srgb, var(--surface) 44%, transparent) 42%,
              color-mix(in srgb, var(--surface) 82%, transparent) 74%,
              var(--surface) 100%
            )
          `,
        }}
      />
      <div className="section-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div className="flex flex-col">
            <div className="relative flex items-center gap-3">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--forest)]/10 via-[var(--sky)]/10 to-[var(--warm)]/10 blur-xl rounded-full opacity-50 animate-pulse" />
              <Image
                src="/brand/logo-side-nobg.png"
                alt=""
                width={610}
                height={701}
                className="relative h-14 w-auto transition-transform duration-500 hover:scale-105 drop-shadow-md"
              />
              <span className="relative text-xl font-serif font-bold tracking-tight text-[var(--forest-deep)]">
                {siteConfig.name}
              </span>
            </div>
            <h2 className="mt-6 max-w-lg text-xl font-serif leading-[1.4] sm:text-[1.35rem] text-[var(--foreground)]">
              A digital encyclopedia built for readers of every age — at home, in class, or on the go.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-[1.8] text-[var(--muted)] font-light">
              Explore wildlife through large images, quick facts, and habitat and diet trails that
              keep you moving from one discovery to the next.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[var(--forest)]/70">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center text-[0.85rem] font-light text-[var(--muted)] nav-link-expand hover:text-[var(--forest-deep)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-[var(--line)]/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-light text-[var(--muted)]/80">
            © {new Date().getFullYear()} {siteConfig.organizationName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light">
            <Link href="/privacy" className="text-[var(--muted)]/80 nav-link-expand hover:text-[var(--forest-deep)]">
              Privacy
            </Link>
            <Link href="/terms" className="text-[var(--muted)]/80 nav-link-expand hover:text-[var(--forest-deep)]">
              Terms
            </Link>
            <Link href="/contact" className="text-[var(--muted)]/80 nav-link-expand hover:text-[var(--forest-deep)]">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <PrivacySettingsControl compact />
        </div>
      </div>
    </footer>
  );
}
