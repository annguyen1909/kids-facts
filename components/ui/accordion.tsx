import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { parseFaqAnswer } from "@/lib/faq-markdown";
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
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left font-serif text-xl font-bold text-[var(--forest-deep)] marker:content-none sm:text-2xl leading-snug">
            <span>{item.question}</span>
            <ChevronDown
              className={cn(
                "mt-1 h-6 w-6 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-180",
              )}
            />
          </summary>
          <p className="mt-3 text-base leading-7 text-[var(--muted)] sm:text-lg">
            {parseFaqAnswer(item.answer).map((segment, index) => {
              if (segment.type === "text") {
                return <span key={`${item.question}-text-${index}`}>{segment.value}</span>;
              }

              const isExternal =
                segment.href.startsWith("http://") || segment.href.startsWith("https://");

              return isExternal ? (
                <a
                  key={`${item.question}-link-${index}`}
                  href={segment.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="font-semibold text-[var(--forest)] underline decoration-[rgba(36,83,65,0.35)] underline-offset-4"
                >
                  {segment.label}
                </a>
              ) : (
                <Link
                  key={`${item.question}-link-${index}`}
                  href={segment.href}
                  className="font-semibold text-[var(--forest)] underline decoration-[rgba(36,83,65,0.35)] underline-offset-4"
                >
                  {segment.label}
                </Link>
              );
            })}
          </p>
        </details>
      ))}
    </div>
  );
}
