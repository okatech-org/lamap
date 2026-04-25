"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GoldDust } from "@/components/game/GoldDust";
import { CardFace, CardBack } from "@/components/game/Card";
import { Avatar } from "@/components/game/Avatar";
import { MancheDots } from "@/components/game/MancheDots";
import { GamePanel } from "./GamePanel";
import { PlayerSeat } from "./PlayerSeat";
import { SidePanelChat } from "./SidePanelChat";
import { useGame, type Card } from "@/hooks/use-game";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName, prToRank } from "@/lib/rank";

const SEAT_ORIENTATIONS = ["bottom", "left", "top", "right"] as const;

export function TableImmersive({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const myUserId = user?._id;
  const { game, myHand, currentPlays, isMyTurn, playCard, concede } = useGame(gameId);

  // When match ends, route to /match/[gameId]
  useEffect(() => {
    const status = (game as any)?.status;
    if (status === "FINISHED" || status === "ENDED" || status === "COMPLETED") {
      router.replace(`/match/${gameId}`);
    }
  }, [game, gameId, router]);

  const playersBySeat = useMemo(() => {
    const players = ((game as any)?.players ?? []) as any[];
    const meIdx = players.findIndex((p) => p.userId === myUserId);
    if (meIdx < 0) return players.map((p, i) => ({ player: p, seat: SEAT_ORIENTATIONS[i % 4] }));
    const ordered = [...players.slice(meIdx), ...players.slice(0, meIdx)];
    return ordered.map((p, i) => ({ player: p, seat: SEAT_ORIENTATIONS[i % 4] }));
  }, [game, myUserId]);

  const wonRounds = (game as any)?.wonRounds ?? [];
  const currentRound = ((game as any)?.currentRound ?? 1) - 1;

  if (!game) return <TableLoading />;

  const me = playersBySeat.find((s) => s.seat === "bottom")?.player;
  const top = playersBySeat.find((s) => s.seat === "top");
  const left = playersBySeat.find((s) => s.seat === "left");
  const right = playersBySeat.find((s) => s.seat === "right");

  const playedCenter = (currentPlays ?? []) as any[];

  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", background: "#0A0E14" }}>
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 50%, #5A7A96 0%, #2E3D4D 45%, #0F1620 95%)",
        }}
      >
        <GoldDust count={26} opacity={0.5} />

        {/* Top HUD */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            right: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: "rgba(15,22,32,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(201,168,118,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#5EAA62",
                  boxShadow: "0 0 6px #5EAA62",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "rgba(245,242,237,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                EN DIRECT
              </span>
            </div>
            <div style={{ width: 1, height: 16, background: "rgba(201,168,118,0.2)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--or-2)",
                letterSpacing: "0.1em",
              }}
            >
              {playersBySeat.length} JOUEURS · {(game as any)?.mode ?? "CLASSÉ"}
            </span>
          </div>

          <MancheDots current={currentRound} won={wonRounds.map((_: any, i: number) => i).filter((i: number) => wonRounds[i]?.winnerId === myUserId)} />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                if (confirm("Abandonner la partie ?")) concede();
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                background: "rgba(180,68,62,0.25)",
                border: "1px solid var(--terre-2)",
                color: "var(--cream)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Abandonner
            </button>
          </div>
        </div>

        {/* Top opponent */}
        {top && (
          <div
            style={{
              position: "absolute",
              top: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
            }}
          >
            <PlayerSeat
              orientation="top"
              name={top.player.username ?? "Adversaire"}
              rank={prToRank(top.player.pr ?? 0)}
              pts={top.player.pr ?? 0}
              initials={initialsFromName(top.player.username ?? "??")}
              hasMain={(game as any)?.currentTurnPlayerId === top.player.userId}
              cards={top.player.handSize ?? 4}
            />
          </div>
        )}
        {left && (
          <div
            style={{
              position: "absolute",
              left: 60,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
            }}
          >
            <PlayerSeat
              orientation="left"
              name={left.player.username ?? "Adversaire"}
              rank={prToRank(left.player.pr ?? 0)}
              pts={left.player.pr ?? 0}
              initials={initialsFromName(left.player.username ?? "??")}
              hasMain={(game as any)?.currentTurnPlayerId === left.player.userId}
              cards={left.player.handSize ?? 4}
            />
          </div>
        )}
        {right && (
          <div
            style={{
              position: "absolute",
              right: 60,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
            }}
          >
            <PlayerSeat
              orientation="right"
              name={right.player.username ?? "Adversaire"}
              rank={prToRank(right.player.pr ?? 0)}
              pts={right.player.pr ?? 0}
              initials={initialsFromName(right.player.username ?? "??")}
              hasMain={(game as any)?.currentTurnPlayerId === right.player.userId}
              cards={right.player.handSize ?? 4}
            />
          </div>
        )}

        {/* Center play area */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,118,0.1), transparent 70%)",
            border: "1px dashed rgba(201,168,118,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: 280, height: 280 }}>
            {playedCenter.length === 0 ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "rgba(245,242,237,0.4)",
                }}
              >
                · MANCHE {currentRound + 1} ·
              </div>
            ) : (
              playedCenter.slice(0, 4).map((play: any, i: number) => {
                const orient = SEAT_ORIENTATIONS[i] ?? "top";
                const pos =
                  orient === "top"
                    ? { top: 0, left: "50%", transform: "translateX(-50%)" }
                    : orient === "left"
                      ? { left: 0, top: "50%", transform: "translateY(-50%) rotate(-90deg)" }
                      : orient === "right"
                        ? { right: 0, top: "50%", transform: "translateY(-50%) rotate(90deg)" }
                        : { bottom: 0, left: "50%", transform: "translateX(-50%) rotate(180deg)" };
                return (
                  <div key={i} style={{ position: "absolute", ...pos } as any}>
                    <CardFace rank={play.rank} suit={play.suit} size="lg" />
                  </div>
                );
              })
            )}
            {/* Center round badge */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C9A876, #6E5536)",
                border: "3px solid #6E5536",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1F1810",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 14,
                boxShadow: "0 0 30px rgba(232,200,121,0.5)",
              }}
            >
              M{currentRound + 1}
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 270px)",
            padding: "10px 22px",
            borderRadius: 99,
            background: isMyTurn
              ? "linear-gradient(180deg, #C95048, #A93934)"
              : "rgba(15,22,32,0.7)",
            border: isMyTurn ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(201,168,118,0.2)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--cream)",
            boxShadow: isMyTurn ? "0 8px 22px rgba(180,68,62,0.4)" : "none",
            zIndex: 6,
          }}
        >
          {isMyTurn ? "♛ À toi de jouer" : "En attente de l'adversaire…"}
        </div>

        {/* Player hand bottom */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 5,
          }}
        >
          {(myHand as Card[]).map((card, i) => {
            const totalCards = myHand.length;
            const offset = (i - (totalCards - 1) / 2) * 160;
            const playable = isMyTurn && card.playable;
            return (
              <button
                key={card.id}
                disabled={!playable}
                onClick={() => playCard(card).catch(() => {})}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${offset}px)`,
                  transform: `translateX(-50%) rotate(${(i - (totalCards - 1) / 2) * 5}deg) translateY(${playable ? -16 : 0}px)`,
                  filter: playable
                    ? "drop-shadow(0 0 16px rgba(232,200,121,0.4))"
                    : "brightness(0.6) saturate(0.5)",
                  transition: "transform 200ms ease, filter 200ms ease",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: playable ? "pointer" : "not-allowed",
                }}
              >
                <CardFace rank={card.rank} suit={card.suit} size="xl" />
              </button>
            );
          })}
        </div>

        {/* Bottom self info */}
        {me && (
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(15,22,32,0.75)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid var(--or-2)",
              boxShadow: "0 0 30px rgba(232,200,121,0.25)",
              zIndex: 10,
            }}
          >
            <Avatar initials={initialsFromName(me.username ?? user?.username ?? "??")} size={42} />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--cream)",
                }}
              >
                {me.username ?? user?.username}{" "}
                <span style={{ color: "var(--or-2)", fontSize: 12, fontWeight: 500 }}>(toi)</span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--or-2)",
                  letterSpacing: "0.1em",
                }}
              >
                {prToRank(user?.pr ?? 0).toUpperCase()} · {user?.pr ?? 0}
              </div>
            </div>
            <div style={{ width: 1, height: 30, background: "rgba(201,168,118,0.2)", margin: "0 4px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #E8C879, #6E5536)",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--or-2)" }}>
                {(user?.kora ?? user?.balance ?? 0).toLocaleString("fr-FR")} K
              </span>
            </div>
          </div>
        )}

        {/* Quick emotes */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 18,
            display: "flex",
            gap: 6,
            padding: 6,
            borderRadius: 12,
            background: "rgba(15,22,32,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(201,168,118,0.15)",
            zIndex: 10,
          }}
        >
          {["👏", "🔥", "😅", "💪", "🤝", "😤"].map((e) => (
            <div
              key={e}
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "rgba(46,61,77,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                cursor: "pointer",
                border: "1px solid rgba(201,168,118,0.08)",
              }}
            >
              {e}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <GamePanel
        defaultTab="chat"
        tabs={[
          { id: "chat", label: "Chat" },
          { id: "spec", label: "Spectateurs" },
          { id: "hist", label: "Historique" },
        ]}
      >
        {(active) => {
          if (active === "chat") {
            return <SidePanelChat gameId={gameId} myUserId={myUserId as any} myUsername={user?.username} />;
          }
          if (active === "hist") {
            return <RoundsList wonRounds={wonRounds} myUserId={myUserId as any} />;
          }
          return (
            <div
              style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                color: "rgba(245,242,237,0.55)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              Aucun spectateur pour l&apos;instant.
            </div>
          );
        }}
      </GamePanel>
    </div>
  );
}

function RoundsList({ wonRounds, myUserId }: { wonRounds: any[]; myUserId?: string }) {
  return (
    <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "var(--or-2)",
          marginBottom: 12,
        }}
      >
        {wonRounds.length} MANCHE{wonRounds.length > 1 ? "S" : ""} JOUÉE{wonRounds.length > 1 ? "S" : ""}
      </div>
      {wonRounds.map((r: any, i: number) => {
        const won = r?.winnerId === myUserId;
        return (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              marginBottom: 6,
              borderRadius: 10,
              background: r?.kora ? "rgba(201,168,118,0.15)" : "rgba(46,61,77,0.4)",
              border: r?.kora ? "1px solid var(--or-2)" : "1px solid rgba(201,168,118,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(245,242,237,0.5)",
                  letterSpacing: "0.1em",
                }}
              >
                MANCHE {i + 1}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: won ? "var(--or-2)" : "var(--cream)",
                  marginTop: 2,
                }}
              >
                {won ? "Toi" : (r?.winnerUsername ?? "Adversaire")}
              </div>
            </div>
            {r?.kora && (
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: 6,
                  background: "var(--or)",
                  color: "#1F1810",
                  fontSize: 9,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                KORA
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TableLoading() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 50%, #5A7A96 0%, #2E3D4D 45%, #0F1620 95%)",
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
        · DISTRIBUTION ·
      </div>
    </div>
  );
}
