import Link from "next/link";
import { Compass, Home } from "lucide-react";
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
        The animal or page you wanted may have moved, or the link might be mistyped. Head back to
        the library and keep exploring.
      </p>
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
    </div>
  );
}
