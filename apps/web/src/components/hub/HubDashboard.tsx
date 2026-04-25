"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { CardBack } from "@/components/game/Card";
import { RankBadge } from "@/components/game/RankBadge";
import { Avatar } from "@/components/game/Avatar";
import { Topbar } from "@/components/shell/Topbar";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName, nextRankThreshold, prToRank } from "@/lib/rank";

const TOPBAR_TABS = [
  { label: "Accueil", href: "/play" },
  { label: "Jouer", href: "/play" },
  { label: "Saison", href: "/play" },
  { label: "Quêtes", href: "/play" },
];

export function HubDashboard() {
  const { user, userId } = useAuth();
  const router = useRouter();
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);

  const pr = user?.pr ?? 0;
  const balance = user?.kora ?? user?.balance ?? 0;
  const rankName = prToRank(pr);
  const { next, progress } = nextRankThreshold(pr);

  const stats = useQuery(
    api.users.getUserStats,
    userId ? { clerkUserId: userId } : "skip",
  );

  const createMatchVsAI = useMutation(api.matchmaking.createMatchVsAI);

  async function startVsAI() {
    if (!user?._id) return;
    setMatchmakingError(null);
    try {
      const result = await createMatchVsAI({
        playerId: user._id,
        difficulty: "medium",
        betAmount: 0,
        currency: "XAF",
      });
      const gameId = (result as any)?.gameId ?? (result as any)?.game?.gameId ?? (result as any);
      if (gameId) router.push(`/play/${gameId}`);
    } catch (e: any) {
      setMatchmakingError(e?.message ?? "Impossible de lancer la partie.");
    }
  }

  return (
    <>
      <Topbar tabs={TOPBAR_TABS} activeHref="/play" balance={balance} />

      <div style={{ padding: "32px 36px", flex: 1, position: "relative", overflow: "auto" }}>
        <GoldDust count={12} opacity={0.25} />

        {/* Hero play card */}
        <div
          style={{
            height: 240,
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(110deg, #6E2520 0%, #2C1A18 50%, #0F1620 100%)",
            border: "1px solid rgba(201,168,118,0.2)",
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <GoldDust count={10} opacity={0.5} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--or-2)",
              }}
            >
              SAISON 4 · KOMBA · J −12
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 44,
                color: "var(--cream)",
                marginTop: 10,
                letterSpacing: "-0.03em",
              }}
            >
              Une partie pour grimper.
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "rgba(245,242,237,0.7)",
                marginTop: 8,
                maxWidth: 480,
              }}
            >
              {next != null
                ? `${next - pr} PR avant ${prToRank(next)}.`
                : "Tu domines déjà l'échelle."}{" "}
              Continue sur ta lancée.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                onClick={startVsAI}
                style={{
                  padding: "14px 30px",
                  borderRadius: 99,
                  border: "none",
                  background: "linear-gradient(180deg, #E8C879, #A68258)",
                  color: "#1F1810",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 8px 22px rgba(232,200,121,0.3)",
                }}
              >
                ▶ Trouver une partie classée
              </button>
              <button
                style={{
                  padding: "14px 22px",
                  borderRadius: 99,
                  border: "1px solid rgba(201,168,118,0.4)",
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--cream)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Inviter un ami
              </button>
            </div>
            {matchmakingError && (
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--terre-2)",
                }}
              >
                {matchmakingError}
              </div>
            )}
          </div>
          <div style={{ position: "relative", width: 280, height: 200 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: i * 8,
                  right: i * 30,
                  transform: `rotate(${(i - 1) * 8}deg)`,
                }}
              >
                <CardBack size="lg" />
              </div>
            ))}
          </div>
        </div>

        {/* 3-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr",
            gap: 18,
            marginTop: 22,
          }}
        >
          {/* Modes */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--or-2)",
                marginBottom: 12,
              }}
            >
              MODES DE JEU
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "Classé", s: "Compte pour ton rang", icon: "♛", accent: "var(--terre-2)", onClick: startVsAI },
                { l: "Vs IA", s: "Entraînement libre", icon: "◆", accent: "rgba(245,242,237,0.7)", onClick: startVsAI },
                { l: "Mise Kora", s: "Pari : 100 K", icon: "K", accent: "var(--or-2)" },
                { l: "4 joueurs", s: "Table avec amis", icon: "⊕", accent: "var(--nuit-2)" },
              ].map((m, i) => (
                <button
                  key={i}
                  onClick={m.onClick}
                  style={{
                    textAlign: "left",
                    padding: 18,
                    borderRadius: 14,
                    background: "rgba(46,61,77,0.45)",
                    border: "1px solid rgba(201,168,118,0.12)",
                    cursor: m.onClick ? "pointer" : "default",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: "rgba(15,22,32,0.7)",
                      border: "1px solid rgba(201,168,118,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: m.accent,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "var(--cream)",
                      marginTop: 14,
                    }}
                  >
                    {m.l}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "rgba(245,242,237,0.55)",
                      marginTop: 2,
                    }}
                  >
                    {m.s}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Profil rapide */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--or-2)",
                marginBottom: 12,
              }}
            >
              TON RANG
            </div>
            <div
              style={{
                padding: 22,
                borderRadius: 14,
                background: "linear-gradient(180deg, rgba(180,68,62,0.18), rgba(46,61,77,0.4))",
                border: "1px solid rgba(180,68,62,0.3)",
                textAlign: "center",
              }}
            >
              <RankBadge rank={rankName} size={64} />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--cream)",
                  marginTop: 12,
                }}
              >
                {rankName}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--or-2)",
                  marginTop: 2,
                }}
              >
                {pr} PR{next != null ? ` · ${prToRank(next)} à ${next}` : ""}
              </div>
              <div
                style={{
                  height: 8,
                  marginTop: 14,
                  borderRadius: 99,
                  background: "rgba(166,130,88,0.15)",
                  border: "1px solid rgba(201,168,118,0.2)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${Math.round(progress * 100)}%`,
                    background: "linear-gradient(90deg, #B4443E, #C9A876)",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <ProfileStat value={stats?.wins ?? 0} label="VICTOIRES" />
                <ProfileStat value={`${Math.round(stats?.winRate ?? 0)}%`} label="WIN RATE" />
                <ProfileStat value={stats?.bestStreak ?? 0} label="SÉRIE" color="var(--or-2)" />
              </div>
            </div>
          </div>

          {/* Notifications / quick actions */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--or-2)",
                marginBottom: 12,
              }}
            >
              ACTIVITÉ
            </div>
            <ActivityList userId={user?._id} />
            <Link
              href="/rank"
              style={{
                marginTop: 12,
                display: "block",
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(46,61,77,0.35)",
                border: "1px solid rgba(201,168,118,0.08)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--cream)",
                textDecoration: "none",
              }}
            >
              Voir le classement →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileStat({ value, label, color }: { value: React.ReactNode; label: string; color?: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: color ?? "var(--cream)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 400,
          color: "rgba(245,242,237,0.5)",
          letterSpacing: "0.15em",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ActivityList({ userId }: { userId?: string }) {
  const { userId: clerkUserId } = useAuth();
  const recent = useQuery(
    api.games.getRecentGames,
    clerkUserId ? { clerkUserId, limit: 4 } : "skip",
  );
  if (!recent || recent.length === 0) {
    return (
      <div
        style={{
          padding: "20px 14px",
          borderRadius: 12,
          background: "rgba(46,61,77,0.35)",
          border: "1px solid rgba(201,168,118,0.08)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "rgba(245,242,237,0.5)",
          textAlign: "center",
        }}
      >
        Aucune partie récente.<br />Lance ta première manche.
      </div>
    );
  }
  return (
    <div>
      {recent.slice(0, 4).map((g: any) => {
        const opp =
          g.players?.find((p: any) => p.userId !== userId)?.username ?? "Adversaire";
        const won = g.winnerId === userId;
        return (
          <div
            key={g._id}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 6,
              background: "rgba(46,61,77,0.35)",
              border: "1px solid rgba(201,168,118,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ position: "relative" }}>
              <Avatar initials={initialsFromName(opp)} size={32} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--cream)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {opp}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: won ? "var(--or-2)" : "var(--terre-2)",
                }}
              >
                {won ? "VICTOIRE" : "DÉFAITE"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

