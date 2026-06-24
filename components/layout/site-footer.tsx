import Link from "next/link";
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
    <footer className="mt-20 border-t border-[rgba(23,49,39,0.08)] bg-[var(--forest-deep)] text-white">
      <div className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="eyebrow eyebrow--dark">{siteConfig.name}</div>
            <h2 className="mt-5 max-w-lg text-3xl font-extrabold tracking-tight">
              A digital encyclopedia built for readers of every age — at home, in class, or on the go.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[rgba(255,255,255,0.72)]">
              Explore wildlife through large images, quick facts, and habitat and diet trails that
              keep you moving from one discovery to the next.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--warm-soft)]">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[rgba(255,255,255,0.78)] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[rgba(255,255,255,0.62)]">
            © {new Date().getFullYear()} {siteConfig.organizationName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/privacy" className="text-[rgba(255,255,255,0.78)] hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-[rgba(255,255,255,0.78)] hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-[rgba(255,255,255,0.78)] hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
