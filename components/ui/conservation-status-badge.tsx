import { cn } from "@/lib/utils";
import { getConservationTone } from "@/lib/conservation-status";
import { ShieldCheck, Eye, AlertCircle, AlertTriangle, AlertOctagon, Skull, HelpCircle } from "lucide-react";

type ConservationStatusBadgeProps = {
  status: string;
  className?: string;
};

export function ConservationStatusBadge({ status, className }: ConservationStatusBadgeProps) {
  const tone = getConservationTone(status);

  // Editorial Dark Glass Style
  // Ultra-transparent dark glass ensures bright white text is ALWAYS legible over any image.
  // We bring back the glowing colored dot to indicate status elegantly without muddying the text.
  const StatusIcon = {
    safe: ShieldCheck,
    watch: Eye,
    vulnerable: AlertCircle,
    endangered: AlertTriangle,
    critical: AlertOctagon,
    extinct: Skull,
    unknown: HelpCircle,
  }[tone];

  const iconColors = {
    safe: "text-blue-400",
    watch: "text-amber-400",
    vulnerable: "text-orange-400",
    endangered: "text-red-500",
    critical: "text-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]",
    extinct: "text-slate-400",
    unknown: "text-purple-400",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-3 py-1.5",
        "border border-white/15 rounded-sm",
        "bg-black/30 backdrop-blur-md", // Deep, subtle dark glass
        "shadow-lg transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      <StatusIcon className={cn("w-3.5 h-3.5", iconColors)} strokeWidth={2.5} />
      <span className="font-serif font-bold italic tracking-widest text-[0.65rem] uppercase text-white drop-shadow-md">
        {status}
      </span>
    </span>
  );
}
