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
        className="hidden lg:flex items-center justify-between w-64 px-4 py-2 text-sm text-[var(--muted)] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full border border-[var(--line)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search animals...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-medium opacity-70">
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
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-4 sm:px-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        shouldFilter={true}
      >
        <div className="relative w-full max-w-2xl bg-[var(--surface-strong)] rounded-2xl shadow-2xl border border-[var(--line)] overflow-hidden animate-in zoom-in-95 duration-200">
          <Command.Input 
            placeholder="Search animals, habitats, diets..." 
            className="w-full px-5 py-4 text-lg bg-transparent border-b border-[var(--line)] focus:outline-none placeholder:text-[var(--muted)] text-[var(--foreground)]"
          />
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
            <Command.Empty className="py-12 text-center text-[var(--muted)]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Animals" className="px-2 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              {animals.map((animal) => (
                <Command.Item
                  key={animal.slug}
                  value={animal.name + " " + animal.category + " " + animal.habitat}
                  onSelect={() => runCommand(() => router.push(`/animals/${animal.slug}`))}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--forest)]/10 aria-selected:text-[var(--forest-deep)] transition-colors"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full shrink-0 border border-[var(--line)] bg-[var(--surface)]">
                    <Image
                      src={animal.imageSrc}
                      alt={animal.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--foreground)] text-sm sm:text-base">{animal.name}</span>
                    <span className="text-xs text-[var(--muted)]">{animal.category} • {animal.habitat}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="h-px bg-[var(--line)] my-2" />

            <Command.Group heading="Quick Links" className="px-2 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              <Command.Item
                value="Browse All Animals"
                onSelect={() => runCommand(() => router.push('/animals'))}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-colors"
              >
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--foreground)] font-medium">Browse All Animals</span>
              </Command.Item>
              <Command.Item
                value="Explore by Habitat"
                onSelect={() => runCommand(() => router.push('/habitats'))}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-colors"
              >
                <Map className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--foreground)] font-medium">Explore by Habitat</span>
              </Command.Item>
              <Command.Item
                value="Explore by Diet"
                onSelect={() => runCommand(() => router.push('/diets'))}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-colors"
              >
                <Utensils className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--foreground)] font-medium">Explore by Diet</span>
              </Command.Item>
              <Command.Item
                value="About Us"
                onSelect={() => runCommand(() => router.push('/about'))}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/5 transition-colors"
              >
                <Info className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--foreground)] font-medium">About Us</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
