"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Command } from "cmdk";
import { Search, Map, Utensils, Info } from "lucide-react";

export type CommandMenuAnimal = {
  slug: string;
  name: string;
  category: string;
  imageSrc: string;
  habitat: string;
};

export function CommandMenu({ animals }: { animals: CommandMenuAnimal[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  return (
    <>
      {/* Trigger Button (Desktop) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center justify-between w-64 px-4 py-2 text-sm text-[var(--muted)] glass-panel hover:shadow-[var(--shadow-glow)] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--forest)] group"
      >
        <span className="flex items-center gap-2 group-hover:text-[var(--forest)] transition-colors duration-300">
          <Search className="h-4 w-4" />
          <span>Search animals...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Trigger Button (Mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="flex lg:hidden items-center justify-center h-10 w-10 text-[var(--forest)] hover:bg-black/5 rounded-full transition-colors focus:outline-none"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        overlayClassName="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        contentClassName="fixed left-[50%] top-[15%] z-[100] w-full max-w-2xl translate-x-[-50%] px-4 animate-in zoom-in-95 duration-200 outline-none"
        shouldFilter={true}
      >
        <div className="relative w-full glass-panel rounded-2xl shadow-[var(--shadow-elevated)] overflow-hidden">
          <Command.Input 
            placeholder="Search animals, habitats, diets..." 
            className="w-full px-5 py-4 text-lg bg-transparent border-b border-[var(--line)] focus:outline-none placeholder:text-[var(--muted)] text-[var(--foreground)]"
          />
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
            <Command.Empty className="py-12 text-center text-[var(--muted)]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Animals" className="px-3 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-[0.15em] font-sans">
              {animals.map((animal) => (
                <Command.Item
                  key={animal.slug}
                  value={animal.name + " " + animal.category + " " + animal.habitat}
                  onSelect={() => runCommand(() => router.push(`/animals/${animal.slug}`))}
                  className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--forest)]/10 aria-selected:shadow-sm transition-all duration-300"
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-full shrink-0 border border-[var(--line)] bg-[var(--surface)] transition-all duration-500 group-aria-selected:scale-110 group-aria-selected:border-[var(--forest)]/30 group-aria-selected:shadow-md">
                    <Image
                      src={animal.imageSrc}
                      alt={animal.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-medium text-[var(--foreground)] text-base sm:text-lg group-aria-selected:text-[var(--forest-deep)] transition-colors">{animal.name}</span>
                    <span className="text-xs text-[var(--muted)]/80 tracking-wide">{animal.category} &middot; {animal.habitat}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="h-px bg-[var(--line)] my-2" />

            <Command.Group heading="Quick Links" className="px-3 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-[0.15em] font-sans">
              <Command.Item
                value="Browse All Animals"
                onSelect={() => runCommand(() => router.push('/animals'))}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-all duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--line)] transition-colors duration-300 group-aria-selected:bg-white group-aria-selected:border-[var(--forest)]/30 group-aria-selected:shadow-sm">
                  <Search className="h-4 w-4 text-[var(--muted)] group-aria-selected:text-[var(--forest)] transition-colors" />
                </div>
                <span className="text-[var(--foreground)] font-serif font-medium text-base">Browse All Animals</span>
              </Command.Item>
              <Command.Item
                value="Explore by Habitat"
                onSelect={() => runCommand(() => router.push('/habitats'))}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-all duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--line)] transition-colors duration-300 group-aria-selected:bg-white group-aria-selected:border-[var(--sky)]/30 group-aria-selected:shadow-sm">
                  <Map className="h-4 w-4 text-[var(--muted)] group-aria-selected:text-[var(--sky)] transition-colors" />
                </div>
                <span className="text-[var(--foreground)] font-serif font-medium text-base">Explore by Habitat</span>
              </Command.Item>
              <Command.Item
                value="Explore by Diet"
                onSelect={() => runCommand(() => router.push('/diets'))}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-all duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--line)] transition-colors duration-300 group-aria-selected:bg-white group-aria-selected:border-[var(--warm)]/30 group-aria-selected:shadow-sm">
                  <Utensils className="h-4 w-4 text-[var(--muted)] group-aria-selected:text-[var(--warm)] transition-colors" />
                </div>
                <span className="text-[var(--foreground)] font-serif font-medium text-base">Explore by Diet</span>
              </Command.Item>
              <Command.Item
                value="About Us"
                onSelect={() => runCommand(() => router.push('/about'))}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-all duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--line)] transition-colors duration-300 group-aria-selected:bg-white group-aria-selected:border-[var(--forest)]/30 group-aria-selected:shadow-sm">
                  <Info className="h-4 w-4 text-[var(--muted)] group-aria-selected:text-[var(--forest)] transition-colors" />
                </div>
                <span className="text-[var(--foreground)] font-serif font-medium text-base">About Us</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
