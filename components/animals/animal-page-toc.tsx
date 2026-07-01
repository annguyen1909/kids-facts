export type AnimalTocItem = {
  id: string;
  label: string;
};

export function AnimalPageToc({ items }: { items: AnimalTocItem[] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="On this page" className="sticky top-6 z-40 mx-auto max-w-fit px-4 mb-10">
      <div className="flex items-center gap-4 rounded-full bg-[var(--surface)]/80 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
        <span className="hidden px-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)] sm:block">
          On this page
        </span>
        <div className="h-4 w-px bg-[var(--line)] hidden sm:block" />
        <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-center rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--forest-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/50 whitespace-nowrap"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
