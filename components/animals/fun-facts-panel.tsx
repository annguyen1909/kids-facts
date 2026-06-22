import { Sparkles } from "lucide-react";

const DISPLAY_LIMIT = 4;

export function FunFactsPanel({ facts }: { facts: string[] }) {
  const displayed = facts.slice(0, DISPLAY_LIMIT);
  const remaining = facts.length - displayed.length;

  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/95 p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(199,122,56,0.14)] text-[var(--warm)]">
          <Sparkles className="h-4 w-4" />
        </span>
        <p className="eyebrow mb-0 bg-transparent p-0">Fun facts</p>
      </div>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {displayed.map((fact) => (
          <li
            key={fact}
            className="rounded-[0.85rem] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-6 text-[var(--forest-deep)]"
          >
            {fact}
          </li>
        ))}
      </ul>
      {remaining > 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          +{remaining} more in the FAQ section below.
        </p>
      ) : null}
    </div>
  );
}
