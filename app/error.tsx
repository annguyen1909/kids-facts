"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="section-shell flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-[rgba(199,122,56,0.14)]">
        <AlertTriangle className="h-7 w-7 text-[var(--warm)]" aria-hidden />
      </div>
      <p className="eyebrow eyebrow--light mt-6">Something went wrong</p>
      <h1 className="section-title mt-4 max-w-2xl text-[var(--forest-deep)]">
        We hit a snag loading this page
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">
        {error.message || "An unexpected error occurred. You can try again or head back to the library."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={cn(buttonVariants({ size: "lg" }))}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Try again
        </button>
        <Link href="/" className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}>
          <Home className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}
