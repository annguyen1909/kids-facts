import Image from "next/image";
import Link from "next/link";
import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { siteConfig } from "@/lib/site-config";
import { CommandMenu, CommandMenuAnimal } from "@/components/layout/command-menu";
import { getPublishedAnimalCards } from "@/lib/content";
import { getAnimalImageForDisplay, getAnimalPrimaryImage } from "@/lib/images";

export function SiteHeader() {
  const animalCards = getPublishedAnimalCards();
  const animals: CommandMenuAnimal[] = animalCards.map(a => ({
    slug: a.core.slug,
    name: a.core.name,
    category: a.core.taxonomy.class,
    habitat: a.core.habitat,
    imageSrc: getAnimalImageForDisplay(getAnimalPrimaryImage(a)).src
  }));

  return (
    <header className="site-header">
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
          <SiteHeaderNav variant="desktop" />
        </nav>

        <div className="ml-auto flex items-center">
          <CommandMenu animals={animals} />
        </div>
      </div>

      <nav className="site-header__nav-mobile" aria-label="Main">
        <div className="site-header__nav-mobile-track">
          <SiteHeaderNav variant="mobile" />
        </div>
      </nav>
    </header>
  );
}
