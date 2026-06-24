export function FunFactsPanel({ facts }: { facts: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow)] sm:p-6">
      <p className="eyebrow eyebrow--light">Quick facts</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <li
            key={fact}
            className="rounded-[0.85rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 text-base leading-7 text-[var(--forest-deep)] sm:text-lg sm:leading-8"
          >
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
