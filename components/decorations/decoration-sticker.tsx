import Image from "next/image";
import { getDecorationById } from "@/lib/decorations/content";
import { cn } from "@/lib/utils";

type DecorationStickerProps = {
  id: string;
  className?: string;
  size?: "xs" | "sm" | "md";
};

const sizeClass = {
  xs: "decoration-sticker--xs",
  sm: "decoration-sticker--sm",
  md: "decoration-sticker--md",
} as const;

/** Renders an approved manifest sticker only — no placeholder art on the live site. */
export function DecorationSticker({ id, className, size = "sm" }: DecorationStickerProps) {
  const item = getDecorationById(id);
  const src = item?.status === "approved" && item.src ? item.src : null;

  if (!src || !item) {
    return null;
  }

  return (
    <div className={cn("decoration-sticker", sizeClass[size], className)} aria-hidden>
      <Image
        src={src}
        alt=""
        width={item.width ?? 72}
        height={item.height ?? 72}
        className="decoration-sticker__image"
      />
    </div>
  );
}
