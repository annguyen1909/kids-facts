import Link from "next/link";
import { BookOpen, Leaf, Salad, Shapes } from "lucide-react";

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
    <div className="discovery-strip">
      {paths.map((path) => {
        const Icon = path.icon;

        return (
          <Link
            key={path.href}
            href={path.href}
            className={`discovery-card ${toneClass[path.tone]}`}
          >
            <span className="discovery-card__icon" aria-hidden>
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="discovery-card__body">
              <span className="discovery-card__label">{path.label}</span>
              <span className="discovery-card__description">{path.description}</span>
            </span>
            <span className="discovery-card__cta">Explore →</span>
          </Link>
        );
      })}
    </div>
  );
}
