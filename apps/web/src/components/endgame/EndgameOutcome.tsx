"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { Sparks } from "@/components/game/Sparks";
import { Avatar } from "@/components/game/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName, prToRank } from "@/lib/rank";

export function EndgameOutcome({ gameId }: { gameId: string }) {
  const { user } = useAuth();
  const game = useQuery(api.games.getGame, { gameId });

  if (!game) return <EndgameLoading />;

  const players = ((game as any).players ?? []) as any[];
  const me = players.find((p) => p.userId === user?._id);
  const opp = players.find((p) => p.userId !== user?._id);
  const myWon = (game as any).winnerId === user?._id;
  const isKora = (game as any).koraType && (game as any).koraType !== "NONE";
  const koraMult = (game as any).koraMultiplier ?? ((game as any).koraType === "DOUBLE_KORA" ? 4 : 2);

  if (isKora && myWon) return <EndgameKora multiplier={koraMult} />;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: myWon
          ? "radial-gradient(ellipse at 50% 0%, rgba(94,170,98,0.25) 0%, #0F1A14 40%, #0A0E14 100%)"
          : "radial-gradient(ellipse at 50% 0%, rgba(180,68,62,0.18) 0%, #1A0F0E 40%, #0A0E14 100%)",
      }}
    >
      <GoldDust count={26} opacity={0.5} />

      <div
        style={{
          position: "absolute",
          top: 36,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.4em",
            color: myWon ? "#9DD49E" : "#D4635D",
          }}
        >
          · {myWon ? "VICTOIRE" : "DÉFAITE"} ·
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 96,
            color: "var(--cream)",
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            marginTop: 14,
            textShadow: myWon ? "0 0 50px rgba(94,170,98,0.3)" : "0 0 50px rgba(180,68,62,0.3)",
          }}
        >
          {myWon ? "GAGNÉ " : "PERDU "}
          <span style={{ color: myWon ? "#9DD49E" : "#D4635D", fontStyle: "italic" }}>
            {myWon ? "nett." : "ce coup-ci."}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 80,
        }}
      >
        <PlayerCard
          username={(myWon ? me : opp)?.username ?? "Joueur"}
          pr={(myWon ? me : opp)?.pr ?? 0}
          delta={myWon ? "+18" : "+12"}
          large
          glowing
        />

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 200,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              background: "linear-gradient(180deg, #F5F2ED 0%, #C9A876 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span>{myWon ? 3 : 2}</span>
            <span
              style={{
                color: "rgba(245,242,237,0.25)",
                WebkitTextFillColor: "rgba(245,242,237,0.25)",
                fontSize: 130,
                verticalAlign: "super",
                margin: "0 14px",
              }}
            >
              —
            </span>
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(245,242,237,0.5) 0%, rgba(201,168,118,0.4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {myWon ? 2 : 3}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "rgba(245,242,237,0.5)",
              marginTop: 12,
            }}
          >
            5 MANCHES
          </div>
        </div>

        <PlayerCard
          username={(myWon ? opp : me)?.username ?? "Joueur"}
          pr={(myWon ? opp : me)?.pr ?? 0}
          delta={myWon ? "−14" : "−10"}
          dim
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 14,
        }}
      >
        <Link href="/play">
          <button
            style={{
              padding: "14px 32px",
              borderRadius: 99,
              border: "none",
              background: "var(--cream)",
              color: "#1F1810",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Retour au hub →
          </button>
        </Link>
        <Link href="/play">
          <button
            style={{
              padding: "14px 32px",
              borderRadius: 99,
              border: "1px solid rgba(201,168,118,0.5)",
              background: "rgba(255,255,255,0.06)",
              color: "var(--cream)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Rejouer
          </button>
        </Link>
      </div>
    </div>
  );
}

function PlayerCard({
  username,
  pr,
  delta,
  large,
  dim,
  glowing,
}: {
  username: string;
  pr: number;
  delta: string;
  large?: boolean;
  dim?: boolean;
  glowing?: boolean;
}) {
  return (
    <div style={{ textAlign: "center", opacity: dim ? 0.55 : 1 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {glowing && (
          <div
            style={{
              position: "absolute",
              inset: -14,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,200,121,0.4), transparent 70%)",
              filter: "blur(14px)",
            }}
          />
        )}
        <Avatar initials={initialsFromName(username)} size={large ? 140 : 110} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: large ? 800 : 700,
          fontSize: large ? 32 : 22,
          color: "var(--cream)",
          marginTop: 18,
          letterSpacing: "-0.02em",
        }}
      >
        {username}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: dim ? "rgba(245,242,237,0.4)" : "var(--or-2)",
          marginTop: 4,
        }}
      >
        ♔ {prToRank(pr).toUpperCase()}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginTop: 14,
          padding: "6px 14px",
          borderRadius: 99,
          background: dim ? "rgba(212,99,93,0.12)" : "rgba(94,170,98,0.18)",
          border: dim ? "1px solid rgba(212,99,93,0.3)" : "1px solid rgba(94,170,98,0.5)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            color: dim ? "#D4635D" : "#9DD49E",
          }}
        >
          {pr}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: dim ? "#D4635D" : "#9DD49E",
          }}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}

function EndgameKora({ multiplier }: { multiplier: number }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse at center, #6E2520 0%, #2C1A18 50%, #0A0E14 100%)",
      }}
    >
      <Sparks count={60} />
      <GoldDust count={30} opacity={0.7} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            letterSpacing: "0.5em",
            color: "var(--or-2)",
            marginBottom: 24,
          }}
        >
          · VICTOIRE SPÉCIALE ·
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 240,
            color: "var(--or-2)",
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            textShadow: "0 0 60px rgba(232,200,121,0.6)",
            background: "linear-gradient(180deg, #E8C879 0%, #A68258 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          KORA
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginTop: 24,
            padding: "14px 38px",
            borderRadius: 99,
            background: "linear-gradient(135deg, #C9A876, #6E5536)",
            border: "2px solid #E8C879",
            boxShadow: "0 0 50px rgba(232,200,121,0.6)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 56,
              color: "#1F1810",
              letterSpacing: "-0.04em",
            }}
          >
            ×{multiplier}
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 38 }}>
          <Link href="/play">
            <button
              style={{
                padding: "14px 32px",
                borderRadius: 99,
                border: "none",
                background: "var(--cream)",
                color: "#1F1810",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Retour au hub
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function EndgameLoading() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0E14",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "var(--or-2)",
          animation: "lamap-pulse 1.6s ease-in-out infinite",
        }}
      >
        · CALCUL DU SCORE ·
      </div>
    </div>
  );
}
