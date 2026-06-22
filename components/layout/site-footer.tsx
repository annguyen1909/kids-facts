import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/animals", label: "All animals" },
      { href: "/habitats/savanna", label: "Habitats" },
      { href: "/diets/carnivore", label: "Diets" },
      { href: "/topics/social-animals", label: "Topics" },
    ],
  },
  {
    title: "Featured paths",
    links: [
      { href: "/animals/lion", label: "Lion facts" },
      { href: "/animals/african-elephant/behavior", label: "Elephant behavior" },
      { href: "/animals/bottlenose-dolphin#gallery", label: "Dolphin photos" },
      { href: "/animals/compare/lion-vs-african-elephant", label: "Compare animals" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[rgba(23,49,39,0.08)] bg-[var(--forest-deep)] text-white">
      <div className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="eyebrow bg-[rgba(255,255,255,0.1)] text-[var(--warm-soft)]">
              Animal Facts for Kids
            </div>
            <h2 className="mt-5 max-w-lg text-3xl font-extrabold tracking-tight">
              A digital encyclopedia built for curious readers, classrooms, and family browsing.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[rgba(255,255,255,0.72)]">
              Explore wildlife through large images, quick facts, supporting pages, and related topics that keep children moving from one discovery to the next.
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
      </div>
    </footer>
  );
}
