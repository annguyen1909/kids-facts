import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow eyebrow--light">404</p>
      <h1 className="section-title mt-4 max-w-2xl text-[var(--forest-deep)]">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">
        The animal or page you wanted may have moved, or the link might be mistyped. Search the
        library or head back home to keep exploring.
      </p>

      <form action="/animals" className="not-found-search mt-8 w-full max-w-md">
        <label htmlFor="not-found-search" className="sr-only">
          Search animals
        </label>
        <Search className="not-found-search__icon" aria-hidden />
        <input
          id="not-found-search"
          name="query"
          type="search"
          placeholder="Search lions, dolphins, whales…"
          className="not-found-search__input"
        />
        <button type="submit" className="not-found-search__button">
          Search
        </button>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          <Home className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        <Link href="/animals" className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}>
          <Compass className="h-4 w-4" aria-hidden />
          Browse animals
        </Link>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Popular starts:{" "}
        <Link href="/animals/lion" className="font-semibold text-[var(--forest)] hover:underline">
          Lion
        </Link>
        {" · "}
        <Link
          href="/animals/african-elephant"
          className="font-semibold text-[var(--forest)] hover:underline"
        >
          Elephant
        </Link>
        {" · "}
        <Link href="/habitats/savanna" className="font-semibold text-[var(--forest)] hover:underline">
          Savanna
        </Link>
      </p>
    </div>
  );
}
