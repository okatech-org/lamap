"use client";

import { useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { Avatar } from "@/components/game/Avatar";
import { RankBadge, RANKS } from "@/components/game/RankBadge";
import { StatTile } from "@/components/shell/StatTile";
import { Topbar } from "@/components/shell/Topbar";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName, nextRankThreshold, prToRank } from "@/lib/rank";

export function HubProfile() {
  const { user, userId } = useAuth();
  const stats = useQuery(
    api.users.getUserStats,
    userId ? { clerkUserId: userId } : "skip",
  );
  const recent = useQuery(
    api.games.getRecentGames,
    userId ? { clerkUserId: userId, limit: 5 } : "skip",
  );

  const pr = user?.pr ?? 0;
  const balance = user?.kora ?? user?.balance ?? 0;
  const myRank = prToRank(pr);
  const { next, progress } = nextRankThreshold(pr);

  const ranges = ["0–199", "200–399", "400–699", "700–999", "1000–1499", "1500+"];

  return (
    <>
      <Topbar tabs={[]} balance={balance} />
      <div style={{ padding: "36px 44px", flex: 1, position: "relative", overflow: "auto" }}>
        <GoldDust count={10} opacity={0.25} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: 28,
            borderRadius: 16,
            background:
              "linear-gradient(110deg, rgba(180,68,62,0.18), rgba(46,61,77,0.4))",
            border: "1px solid rgba(201,168,118,0.2)",
          }}
        >
          <div style={{ position: "relative" }}>
            <Avatar initials={initialsFromName(user?.username ?? "??")} size={104} />
            <div
              style={{
                position: "absolute",
                bottom: -8,
                right: -8,
                transform: "scale(0.85)",
              }}
            >
              <RankBadge rank={myRank} size={48} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--or-2)",
              }}
            >
              {myRank.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 38,
                color: "var(--cream)",
                letterSpacing: "-0.02em",
                marginTop: 4,
              }}
            >
              {user?.username ?? "Bandi"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "rgba(245,242,237,0.6)",
                marginTop: 4,
              }}
            >
              {stats?.totalGames ?? 0} parties · membre LaMap
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(245,242,237,0.5)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {pr} PR
                </span>
                {next != null && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "rgba(245,242,237,0.5)",
                    }}
                  >
                    {prToRank(next)} à {next}
                  </span>
                )}
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 99,
                  background: "rgba(166,130,88,0.15)",
                  border: "1px solid rgba(201,168,118,0.25)",
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
                    boxShadow: "0 0 16px rgba(201,168,118,0.5)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginTop: 22,
          }}
        >
          <StatTile label="Victoires" value={stats?.wins ?? 0} sub={`sur ${stats?.totalGames ?? 0}`} />
          <StatTile label="Win rate" value={`${Math.round(stats?.winRate ?? 0)}%`} />
          <StatTile label="Série" value={`${stats?.currentStreak ?? 0}W`} sub={`record: ${stats?.bestStreak ?? 0}`} />
          <StatTile label="Solde" value={`${balance.toLocaleString("fr-FR")} K`} color="var(--or-2)" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 18,
            marginTop: 22,
          }}
        >
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
              5 DERNIÈRES PARTIES
            </div>
            <div
              style={{
                background: "rgba(46,61,77,0.35)",
                borderRadius: 12,
                border: "1px solid rgba(201,168,118,0.1)",
                overflow: "hidden",
              }}
            >
              {(recent ?? []).slice(0, 5).map((m: any, i: number, arr: any[]) => {
                const won = m.winnerId === user?._id;
                const opp = m.players?.find((p: any) => p.userId !== user?._id);
                return (
                  <div
                    key={m._id}
                    style={{
                      padding: "12px 14px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(201,168,118,0.06)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 5,
                          height: 30,
                          borderRadius: 3,
                          background: won ? "var(--or)" : "var(--terre-2)",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--cream)",
                          }}
                        >
                          {opp?.username ?? "Adversaire"}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "rgba(245,242,237,0.5)",
                          }}
                        >
                          {prToRank(opp?.pr ?? 0)}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 16,
                        color: won ? "var(--or-2)" : "#D4635D",
                        minWidth: 40,
                        textAlign: "right",
                      }}
                    >
                      {won ? "VICT" : "DEF"}
                    </div>
                  </div>
                );
              })}
              {(!recent || recent.length === 0) && (
                <div
                  style={{
                    padding: 24,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "rgba(245,242,237,0.5)",
                    textAlign: "center",
                  }}
                >
                  Aucune partie jouée.
                </div>
              )}
            </div>
          </div>

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
              ÉCHELLE DES RANGS
            </div>
            <div
              style={{
                background: "rgba(46,61,77,0.35)",
                borderRadius: 12,
                border: "1px solid rgba(201,168,118,0.1)",
                padding: 8,
              }}
            >
              {RANKS.map((r, i) => {
                const isCurrent = r.name === myRank;
                return (
                  <div
                    key={r.name}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      marginBottom: 2,
                      background: isCurrent ? "rgba(180,68,62,0.18)" : "transparent",
                      border: isCurrent ? "1px solid var(--terre-2)" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 28,
                        borderRadius: 3,
                        background: r.color,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 13,
                          color: "var(--cream)",
                        }}
                      >
                        {r.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: r.color }}>
                        {ranges[i]} PR
                      </div>
                    </div>
                    {isCurrent && (
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: 99,
                          background: "var(--terre)",
                          color: "var(--cream)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                        }}
                      >
                        VOUS
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
