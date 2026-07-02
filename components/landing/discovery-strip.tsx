import Link from "next/link";
import { BookOpen, Compass, Leaf, Salad, Shapes } from "lucide-react";

const paths = [
  {
    href: "/animals",
    label: "Animal library",
    description: "Big photos, quick facts, and bonus pages for every creature.",
    icon: BookOpen,
    tone: "forest",
  },
  {
    href: "/habitats",
    label: "Habitats",
    description: "Group animals by where they live — oceans, forests, grasslands, and more.",
    icon: Leaf,
    tone: "sky",
  },
  {
    href: "/diets",
    label: "Diets",
    description: "See who eats plants, meat, or a bit of everything.",
    icon: Salad,
    tone: "warm",
  },
  {
    href: "#featured-topics",
    label: "Categories",
    description: "Jump into mammals, birds, fish, reptiles, and insects.",
    icon: Shapes,
    tone: "forest",
  },
] as const;

const toneClass = {
  forest: "discovery-card--forest",
  sky: "discovery-card--sky",
  warm: "discovery-card--warm",
} as const;

export function DiscoveryStrip() {
  return (
    <nav className="discovery-strip" aria-label="Discovery paths">
      <span className="discovery-strip__rail" aria-hidden="true" />
      {paths.map((path, index) => {
        const Icon = path.icon;

        return (
          <Link
            key={path.href}
            href={path.href}
            className={`discovery-card ${toneClass[path.tone]} backdrop-blur-md shadow-[var(--shadow-elevated)] group`}
          >
            <span className="discovery-card__step" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="discovery-card__icon transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg" aria-hidden>
              {index === 0 ? (
                <Compass className="h-5 w-5" strokeWidth={2.25} />
              ) : (
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              )}
            </span>
            <span className="discovery-card__body">
              <span className="discovery-card__label">{path.label}</span>
              <span className="discovery-card__description">{path.description}</span>
            </span>
            <span className="discovery-card__cta">Explore →</span>
          </Link>
        );
      })}
    </nav>
  );
}
