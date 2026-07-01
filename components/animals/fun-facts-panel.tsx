export function FunFactsPanel({ facts }: { facts: string[] }) {
  return (
    <div className="group overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)]/30 p-6 sm:p-8 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-xl hover:ring-black/10 relative backdrop-blur-md">
      <div className="flex flex-col mb-8">
        <span className="inline-flex w-fit items-center rounded-full bg-[var(--forest-deep)]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--forest-deep)]/20 mb-3 backdrop-blur-sm">
          Did You Know?
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forest-deep)]">
          Fun Facts
        </h3>
      </div>
      
      <ul className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <li
            key={fact}
            className="group/fact flex flex-col gap-3 rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-[var(--line)] transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <span className="font-serif text-5xl font-bold text-[var(--forest)]/20 leading-none group-hover/fact:text-[var(--forest)]/40 transition-colors duration-500">
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] opacity-90">
              {fact}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
