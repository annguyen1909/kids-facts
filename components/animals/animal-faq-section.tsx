import { Accordion } from "@/components/ui/accordion";
import type { AnimalFaq } from "@/lib/types";

const PRIMARY_FAQ_COUNT = 6;

export function AnimalFaqSection({
  animalName,
  items,
}: {
  animalName: string;
  items: AnimalFaq[];
}) {
  const primary = items.slice(0, PRIMARY_FAQ_COUNT);
  const extra = items.slice(PRIMARY_FAQ_COUNT);

  return (
    <div className="group overflow-hidden rounded-[2rem] bg-white p-8 sm:p-12 shadow-xl ring-1 ring-black/5 transition-all hover:shadow-2xl">
      <span className="inline-flex rounded-full bg-[var(--forest-deep)]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--forest-deep)]/20 mb-4">
        Common Questions
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--forest-deep)]">
        FAQ about {animalName}
      </h2>
      <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
        Select a question to reveal the answer.
      </p>

      <div className="mt-8 border-y border-[var(--line)]">
        <Accordion items={primary} />
      </div>

      {extra.length > 0 ? (
        <details className="group/details mt-6 overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)]/10 ring-1 ring-black/5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-bold text-[var(--forest-deep)] marker:content-none transition-colors hover:bg-[var(--surface-strong)]/20">
            <span className="font-serif tracking-tight">Show {extra.length} more questions</span>
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--forest-deep)] shadow-sm ring-1 ring-black/10 group-open/details:bg-[var(--forest-deep)] group-open/details:text-white transition-colors">
              Expand
            </span>
          </summary>
          <div className="px-4 pb-4 pt-2">
            <Accordion items={extra} />
          </div>
        </details>
      ) : null}
    </div>
  );
}
