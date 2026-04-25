"use client";

import { Avatar } from "@/components/game/Avatar";
import { CardBack } from "@/components/game/Card";

type Props = {
  name: string;
  rank?: string;
  pts?: number;
  initials: string;
  hasMain?: boolean;
  cards?: number;
  orientation: "top" | "left" | "right" | "bottom";
  thinking?: boolean;
};

export function PlayerSeat({
  name,
  rank,
  pts,
  initials,
  hasMain = false,
  cards = 4,
  orientation,
  thinking,
}: Props) {
  const isHorizontal = orientation === "top" || orientation === "bottom";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isHorizontal
          ? "column"
          : orientation === "left"
            ? "row"
            : "row-reverse",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          background: "rgba(15,22,32,0.75)",
          backdropFilter: "blur(12px)",
          border: hasMain ? "1.5px solid var(--or-2)" : "1px solid rgba(201,168,118,0.15)",
          boxShadow: hasMain ? "0 0 22px rgba(232,200,121,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 200,
        }}
      >
        <div style={{ position: "relative" }}>
          <Avatar initials={initials} size={36} />
          {thinking && (
            <div
              style={{
                position: "absolute",
                top: -4,
                right: -10,
                padding: "2px 6px",
                borderRadius: 99,
                background: "#0B1018",
                border: "1px solid rgba(201,168,118,0.3)",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--or-2)",
                letterSpacing: "0.1em",
                animation: "lamap-pulse 1.2s ease-in-out infinite",
              }}
            >
              ...
            </div>
          )}
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--cream)",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: hasMain ? "var(--or-2)" : "rgba(245,242,237,0.5)",
            }}
          >
            {hasMain ? "♔ A LA MAIN" : `${rank ?? ""}${pts != null ? ` · ${pts}` : ""}`}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 1,
          transform: isHorizontal
            ? "none"
            : orientation === "left"
              ? "rotate(90deg)"
              : "rotate(-90deg)",
        }}
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} style={{ transform: `rotate(${(i - (cards - 1) / 2) * 4}deg)` }}>
            <CardBack size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
