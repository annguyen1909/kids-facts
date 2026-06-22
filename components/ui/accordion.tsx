import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-[1rem] border border-[var(--line)] bg-white p-4 shadow-[0_6px_16px_rgba(23,49,39,0.04)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-bold text-[var(--forest-deep)] marker:content-none sm:text-lg">
            <span>{item.question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-180",
              )}
            />
          </summary>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
