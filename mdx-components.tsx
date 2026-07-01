import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-10 text-3xl font-semibold tracking-tight text-[var(--forest-deep)]"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-8 text-2xl font-semibold tracking-tight text-[var(--forest-deep)]"
        {...props}
      />
    ),
    p: (props) => (
      <p className="mt-4 text-lg leading-8 text-[var(--foreground)]" {...props} />
    ),
    ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
    li: (props) => <li className="text-lg leading-8 text-[var(--foreground)]" {...props} />,
    a: ({ href = "#", ...props }) => {
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            href={href}
            className="font-semibold text-[var(--forest)] underline decoration-[rgba(36,83,65,0.35)] underline-offset-4 hover:underline"
            {...props}
          />
        );
      }

      return (
        <a
          href={href}
          className="font-semibold text-[var(--forest)] underline decoration-[rgba(36,83,65,0.35)] underline-offset-4 hover:underline"
          rel="noreferrer"
          target="_blank"
          {...props}
        />
      );
    },
    ...components,
  };
}
