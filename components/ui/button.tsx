import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--forest)] text-white shadow-[0_12px_24px_rgba(61,143,110,0.28)] hover:-translate-y-0.5 hover:bg-[color:color-mix(in_srgb,var(--forest)_86%,white)]",
        secondary:
          "bg-white/90 text-[var(--forest-deep)] ring-1 ring-[var(--line)] hover:-translate-y-0.5 hover:bg-white",
        ghost:
          "text-[var(--forest)] hover:bg-[rgba(36,83,65,0.08)]",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
