export type SectionVariant = "default" | "hero" | "sky" | "forest" | "warm" | "cream";

const patternIds = {
  hero: "pat-hero-paws",
  sky: "pat-sky-dots",
  forest: "pat-forest-leaves",
  warm: "pat-warm-grass",
  cream: "pat-cream-grid",
  default: "pat-default-waves",
} as const;

export function SectionPattern({ variant }: { variant: SectionVariant }) {
  const id = patternIds[variant];

  return (
    <div className="section-pattern" aria-hidden="true">
      <svg
        className="section-pattern__svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Hero — soft paw trail */}
          <pattern
            id="pat-hero-paws"
            width="88"
            height="88"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            <circle cx="22" cy="22" r="3" fill="#245341" opacity="0.07" />
            <circle cx="32" cy="18" r="2.2" fill="#245341" opacity="0.06" />
            <circle cx="40" cy="24" r="2.2" fill="#245341" opacity="0.06" />
            <circle cx="36" cy="32" r="2.2" fill="#245341" opacity="0.06" />
            <ellipse cx="66" cy="58" rx="5" ry="4" fill="#7aa8c4" opacity="0.06" />
            <circle cx="60" cy="52" r="1.8" fill="#7aa8c4" opacity="0.05" />
            <circle cx="70" cy="52" r="1.8" fill="#7aa8c4" opacity="0.05" />
            <circle cx="74" cy="58" r="1.8" fill="#7aa8c4" opacity="0.05" />
            <circle cx="64" cy="60" r="1.8" fill="#7aa8c4" opacity="0.05" />
          </pattern>

          {/* Sky — airy bubbles */}
          <pattern
            id="pat-sky-dots"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="8" cy="8" r="2.5" fill="#7aa8c4" opacity="0.14" />
            <circle cx="32" cy="20" r="1.5" fill="#4f7c98" opacity="0.1" />
            <circle cx="20" cy="36" r="2" fill="#7aa8c4" opacity="0.08" />
            <circle cx="42" cy="40" r="1.2" fill="#4f7c98" opacity="0.12" />
          </pattern>

          {/* Forest — leaf sprigs */}
          <pattern
            id="pat-forest-leaves"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(12)"
          >
            <path
              d="M12 36 C18 28 26 26 30 34 C26 42 18 44 12 36Z"
              fill="#245341"
              opacity="0.09"
            />
            <path
              d="M48 14 C54 8 62 10 60 18 C56 22 50 20 48 14Z"
              fill="#245341"
              opacity="0.07"
            />
            <path
              d="M56 52 C62 46 68 50 64 58 C58 60 54 56 56 52Z"
              fill="#173127"
              opacity="0.06"
            />
            <line
              x1="12"
              y1="36"
              x2="30"
              y2="34"
              stroke="#245341"
              strokeWidth="0.8"
              opacity="0.08"
            />
          </pattern>

          {/* Warm — savanna grass */}
          <pattern
            id="pat-warm-grass"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M8 48 Q10 32 12 20"
              stroke="#c77a38"
              strokeWidth="1.2"
              fill="none"
              opacity="0.16"
              strokeLinecap="round"
            />
            <path
              d="M14 48 Q16 34 18 24"
              stroke="#c77a38"
              strokeWidth="1"
              fill="none"
              opacity="0.12"
              strokeLinecap="round"
            />
            <path
              d="M36 48 Q38 30 40 18"
              stroke="#c77a38"
              strokeWidth="1.2"
              fill="none"
              opacity="0.14"
              strokeLinecap="round"
            />
            <path
              d="M42 48 Q44 36 46 28"
              stroke="#efd6bb"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
              strokeLinecap="round"
            />
            <circle cx="28" cy="12" r="2" fill="#c77a38" opacity="0.1" />
          </pattern>

          {/* Cream — soft notebook dots */}
          <pattern
            id="pat-cream-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#245341" opacity="0.07" />
            <circle cx="14" cy="14" r="0.8" fill="#607066" opacity="0.06" />
          </pattern>

          {/* Default — gentle waves */}
          <pattern
            id="pat-default-waves"
            width="80"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 Q20 8 40 20 T80 20"
              stroke="#7aa8c4"
              strokeWidth="1"
              fill="none"
              opacity="0.12"
            />
            <path
              d="M0 32 Q20 22 40 32 T80 32"
              stroke="#245341"
              strokeWidth="0.8"
              fill="none"
              opacity="0.07"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
