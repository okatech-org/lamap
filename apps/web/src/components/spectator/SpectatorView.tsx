"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { Topbar } from "@/components/shell/Topbar";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName } from "@/lib/rank";
import { Avatar } from "@/components/game/Avatar";

export function SpectatorView() {
  const { user } = useAuth();
  const balance = user?.kora ?? user?.balance ?? 0;
  // Reuse available games as a proxy for "live matches"
  const matches =
    useQuery(
      api.games.getAvailableGames,
      user?._id ? { userId: user._id } : {},
    ) ?? [];

  return (
    <>
      <Topbar tabs={[]} balance={balance} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Match list */}
        <div
          style={{
            width: 360,
            borderRight: "1px solid rgba(201,168,118,0.1)",
            padding: 22,
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--or-2)",
              marginBottom: 14,
            }}
          >
            EN ATTENTE · {matches.length} {matches.length === 1 ? "PARTIE" : "PARTIES"}
          </div>
          {matches.length === 0 && (
            <div
              style={{
                padding: 24,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "rgba(245,242,237,0.5)",
                background: "rgba(46,61,77,0.35)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              Aucune partie publique pour l&apos;instant.
            </div>
          )}
          {matches.map((m: any, i: number) => {
            const players = m.players ?? [];
            const p1 = players[0]?.username ?? "Joueur 1";
            const p2 = players[1]?.username ?? "En attente";
            return (
              <Link key={m._id} href={`/play/${m.gameId}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 12,
                    background: i === 0 ? "rgba(180,68,62,0.18)" : "rgba(46,61,77,0.4)",
                    border:
                      i === 0
                        ? "1.5px solid var(--terre-2)"
                        : "1px solid rgba(201,168,118,0.1)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--cream)",
                      }}
                    >
                      {p1}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--or-2)" }}>
                      {players[0]?.pr ?? "—"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: "rgba(245,242,237,0.4)",
                      letterSpacing: "0.2em",
                      textAlign: "center",
                      margin: "4px 0",
                    }}
                  >
                    VS
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--cream)",
                      }}
                    >
                      {p2}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--or-2)" }}>
                      {players[1]?.pr ?? "—"}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: "1px solid rgba(201,168,118,0.08)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "rgba(245,242,237,0.5)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {(m.mode ?? "ONLINE").toUpperCase()}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#5EAA62" }}>
                      ● {m.status ?? "WAITING"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Live preview placeholder */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "radial-gradient(ellipse at 50% 50%, #5A7A96 0%, #2E3D4D 50%, #0F1620 100%)",
          }}
        >
          <GoldDust count={20} opacity={0.4} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              maxWidth: 480,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "var(--or-2)",
              }}
            >
              · MODE SPECTATEUR ·
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 56,
                color: "var(--cream)",
                marginTop: 18,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Choisis une partie<br />
              à regarder.
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "rgba(245,242,237,0.6)",
                marginTop: 16,
                lineHeight: 1.5,
              }}
            >
              Les parties publiques apparaissent à gauche en temps réel. Clique sur l&apos;une d&apos;entre
              elles pour rejoindre la table en spectateur.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
