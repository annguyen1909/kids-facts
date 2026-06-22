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
    <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/95 px-5 py-7 shadow-[var(--shadow)] backdrop-blur-sm sm:px-8">
      <p className="eyebrow">Questions kids ask</p>
      <h2 className="section-title mt-3 text-[var(--forest-deep)]">
        FAQ about {animalName}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
        Tap a question to reveal the answer.
      </p>

      <div className="mt-5">
        <Accordion items={primary} />
      </div>

      {extra.length > 0 ? (
        <details className="group mt-4 overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-base font-bold text-[var(--forest-deep)] marker:content-none">
            <span>Show {extra.length} more questions</span>
            <span className="rounded-full bg-[rgba(36,83,65,0.08)] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--forest)]">
              Expand
            </span>
          </summary>
          <div className="border-t border-[var(--line)] px-3 pb-3 pt-1">
            <Accordion items={extra} />
          </div>
        </details>
      ) : null}
    </div>
  );
}
