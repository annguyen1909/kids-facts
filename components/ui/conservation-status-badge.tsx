import { cn } from "@/lib/utils";
import { getConservationTone } from "@/lib/conservation-status";

type ConservationStatusBadgeProps = {
  status: string;
  className?: string;
};

export function ConservationStatusBadge({ status, className }: ConservationStatusBadgeProps) {
  const tone = getConservationTone(status);

  return (
    <span className={cn("conservation-badge", `conservation-badge--${tone}`, className)}>
      {status}
    </span>
  );
}
