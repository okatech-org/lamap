type Props = { current?: number; total?: number; won?: number[] };

export function MancheDots({ current = 1, total = 5, won = [] }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 600,
          color: "rgba(245, 242, 237, 0.55)",
          letterSpacing: "0.18em",
          marginRight: 6,
        }}
      >
        MANCHE
      </div>
      {Array.from({ length: total }).map((_, i) => {
        const isWon = won.includes(i);
        const isCurrent = i === current;
        const isPast = i < current;
        const bg = isWon
          ? "#C9A876"
          : isCurrent
            ? "#B4443E"
            : isPast
              ? "rgba(245,242,237,0.5)"
              : "rgba(245,242,237,0.18)";
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: bg,
              boxShadow: isCurrent ? "0 0 8px rgba(180,68,62,0.6)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
