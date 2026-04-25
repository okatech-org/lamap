"use client";

import Link from "next/link";
import { GoldDust } from "@/components/game/GoldDust";

export function LandingCinematic() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 30%, #2C1A18 0%, #0A0E14 65%)",
      }}
    >
      <GoldDust count={30} opacity={0.5} />

      {/* Top nav */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
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
              letterSpacing: "-0.03em",
            }}
          >
            LaMap
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 30,
            color: "rgba(245,242,237,0.75)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <span>Le jeu</span>
          <span>Classement</span>
          <span>Saison 4</span>
          <span>Esport</span>
          <span>Communauté</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/auth/sign-in">
            <button
              style={{
                padding: "9px 18px",
                borderRadius: 99,
                border: "1px solid rgba(201,168,118,0.35)",
                background: "transparent",
                color: "var(--cream)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </Link>
          <Link href="/auth/sign-up">
            <button
              style={{
                padding: "9px 22px",
                borderRadius: 99,
                border: "none",
                background: "linear-gradient(180deg, #C95048, #8E2F2A)",
                color: "var(--cream)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(180,68,62,0.4)",
              }}
            >
              Jouer maintenant
            </button>
          </Link>
        </div>
      </div>

      {/* Hero card stack background */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 80 + i * 5,
              left: 200 + (i - 2) * 110,
              width: 180,
              height: 252,
              borderRadius: 14,
              background: "linear-gradient(135deg, #B4443E, #6E2520)",
              border: "2px solid rgba(201,168,118,0.4)",
              transform: `rotate(${(i - 2) * 8}deg)`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
            }}
          />
        ))}
      </div>

      {/* Hero text */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.5em",
            color: "var(--or-2)",
            marginBottom: 18,
          }}
        >
          · LE JEU DE CARTES DU CAMEROUN ·
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 124,
            color: "var(--cream)",
            letterSpacing: "-0.05em",
            lineHeight: 0.92,
            textShadow: "0 0 80px rgba(180,68,62,0.4)",
          }}
        >
          Joue. Domine.
          <br />
          <span
            style={{
              background: "linear-gradient(180deg, #E8C879 0%, #A68258 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
            }}
          >
            Devenu Légende.
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            color: "rgba(245,242,237,0.75)",
            maxWidth: 560,
            margin: "24px auto 0",
            lineHeight: 1.55,
          }}
        >
          La Map en ligne. Six rangs, des milliers de Bandi, et un seul vainqueur par soirée.
          Distribution réelle, mises en Kora, classement Elo.
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36 }}>
          <Link href="/auth/sign-up">
            <button
              style={{
                padding: "16px 38px",
                borderRadius: 99,
                border: "none",
                background: "linear-gradient(180deg, #C95048, #8E2F2A)",
                color: "var(--cream)",
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(180,68,62,0.5)",
              }}
            >
              ▶ Jouer gratuitement
            </button>
          </Link>
          <button
            style={{
              padding: "16px 26px",
              borderRadius: 99,
              border: "1px solid rgba(201,168,118,0.4)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--cream)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Regarder la bande-annonce
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 36px",
          borderRadius: 18,
          background: "rgba(15,22,32,0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(201,168,118,0.18)",
        }}
      >
        {[
          { v: "142K", l: "Joueurs actifs" },
          { v: "8.4M", l: "Parties jouées" },
          { v: "237", l: "Légendes" },
          { v: "S04", l: "Saison en cours" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              flex: 1,
              borderLeft: i > 0 ? "1px solid rgba(201,168,118,0.15)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 32,
                color: "var(--or-2)",
                letterSpacing: "-0.03em",
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "rgba(245,242,237,0.55)",
                marginTop: 4,
              }}
            >
              {s.l.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
