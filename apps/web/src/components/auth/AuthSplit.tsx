"use client";

import { GoldDust } from "@/components/game/GoldDust";

type Props = {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthSplit({ kicker, title, subtitle, children }: Props) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", background: "#0A0E14" }}>
      {/* Left poster */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 30% 70%, #2C1A18 0%, #0A0E14 70%)",
          padding: "60px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <GoldDust count={14} opacity={0.4} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                background: "linear-gradient(135deg, #C9A876, #6E5536)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1F1810",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              L
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 22,
                color: "var(--cream)",
              }}
            >
              LaMap
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 64,
              color: "var(--cream)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            Bienvenue
            <br />
            <span style={{ color: "var(--or-2)", fontStyle: "italic" }}>Bandi.</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "rgba(245,242,237,0.7)",
              maxWidth: 400,
              marginTop: 22,
              lineHeight: 1.5,
            }}
          >
            Trois minutes pour rejoindre la table. Aucune carte bancaire pour les parties amicales.
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--or-2)",
          }}
        >
          SAISON 4 · KOMBA · 142K JOUEURS
        </div>
      </div>

      {/* Right form */}
      <div
        style={{
          flex: 1,
          background: "#0F1620",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--or-2)",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              color: "var(--cream)",
              marginTop: 8,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "rgba(245,242,237,0.6)",
              marginTop: 10,
            }}
          >
            {subtitle}
          </div>

          <div style={{ marginTop: 32 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
