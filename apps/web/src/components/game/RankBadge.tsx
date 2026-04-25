export type RankName =
  | "Apprenti"
  | "Initié"
  | "Tacticien"
  | "Maître"
  | "Grand Bandi"
  | "Légende";

export const RANKS: {
  name: RankName;
  short: string;
  color: string;
  glow: string;
}[] = [
  { name: "Apprenti",    short: "A", color: "#8B95A3", glow: "rgba(139,149,163,0.5)" },
  { name: "Initié",      short: "I", color: "#C9A876", glow: "rgba(201,168,118,0.6)" },
  { name: "Tacticien",   short: "T", color: "#5AA3C9", glow: "rgba(90,163,201,0.6)" },
  { name: "Maître",      short: "M", color: "#C95048", glow: "rgba(201,80,72,0.65)" },
  { name: "Grand Bandi", short: "G", color: "#E8C879", glow: "rgba(232,200,121,0.7)" },
  { name: "Légende",     short: "L", color: "#9D5BD2", glow: "rgba(157,91,210,0.7)" },
];

type Props = {
  rank?: RankName;
  size?: number;
  showName?: boolean;
  points?: number;
};

export function RankBadge({ rank = "Initié", size = 56, showName = false, points }: Props) {
  const r = RANKS.find((x) => x.name === rank) ?? RANKS[1];
  const id = `rk-${r.short}`;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 60 64" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={r.color} stopOpacity="1" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M30 2 L56 16 L56 48 L30 62 L4 48 L4 16 Z"
            fill={`url(#${id})`}
            stroke={r.color}
            strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 6px ${r.glow})` }}
          />
          <path
            d="M30 6 L52 18 L52 46 L30 58 L8 46 L8 18 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: size * 0.42,
            color: "rgba(20,26,34,0.85)",
            textShadow: "0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {r.short}
        </div>
      </div>
      {showName && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--cream)",
              letterSpacing: "-0.01em",
            }}
          >
            {r.name}
          </div>
          {points != null && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: r.color,
                marginTop: 2,
              }}
            >
              {points} PR
            </div>
          )}
        </div>
      )}
    </div>
  );
}
