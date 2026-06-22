import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[rgba(36,83,65,0.1)] px-3 py-1 text-sm font-semibold text-[var(--forest)]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
