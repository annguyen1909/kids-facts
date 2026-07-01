import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchEmptyStateProps = {
  query: string;
  context?: string;
  clearHref?: string;
  onClear?: () => void;
};

export function SearchEmptyState({
  query,
  context = "animals",
  clearHref,
  onClear,
}: SearchEmptyStateProps) {
  return (
    <div className="py-24 px-6 text-center border-y border-[var(--line)]">
      <h3 className="font-serif text-4xl sm:text-5xl italic text-[var(--forest-deep)] mb-4">
        Nothing found.
      </h3>
      <p className="text-lg text-[var(--muted)] max-w-md mx-auto">
        We couldn&apos;t find any {context} matching <span className="font-serif italic text-[var(--foreground)]">&ldquo;{query}&rdquo;</span>. Try a different term or explore the index.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {clearHref ? (
          <Link href={clearHref} className="text-xs font-bold uppercase tracking-widest text-[var(--forest)] hover:text-[var(--forest-deep)] transition-colors underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--forest)]">
            Clear search
          </Link>
        ) : onClear ? (
          <button type="button" onClick={onClear} className="text-xs font-bold uppercase tracking-widest text-[var(--forest)] hover:text-[var(--forest-deep)] transition-colors underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--forest)]">
            Clear search
          </button>
        ) : null}
        <Link href="/animals" className="text-xs font-bold uppercase tracking-widest text-[var(--forest)] hover:text-[var(--forest-deep)] transition-colors underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--forest)]">
          Browse all animals
        </Link>
      </div>
    </div>
  );
}
