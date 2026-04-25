"use client";

import { useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { SectionTitle } from "@/components/shell/SectionTitle";
import { Avatar } from "@/components/game/Avatar";
import { Topbar } from "@/components/shell/Topbar";
import { initialsFromName, tierToRank } from "@/lib/rank";
import { useAuth } from "@/hooks/use-auth";

export function HubLeaderboard() {
  const { user } = useAuth();
  const top = useQuery(api.leaderboard.getGlobalLeaderboard, { limit: 50 }) ?? [];
  const balance = user?.kora ?? user?.balance ?? 0;
  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  return (
    <>
      <Topbar tabs={[]} balance={balance} />
      <div style={{ padding: "36px 44px", flex: 1, position: "relative", overflow: "auto" }}>
        <GoldDust count={10} opacity={0.25} />
        <SectionTitle
          kicker="SAISON 4 · KOMBA"
          title="Classement mondial"
          action={
            <div style={{ display: "flex", gap: 8 }}>
              {["Mondial", "Cameroun", "Amis"].map((f, i) => (
                <div
                  key={f}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 99,
                    background: i === 0 ? "var(--terre)" : "rgba(46,61,77,0.5)",
                    color: i === 0 ? "var(--cream)" : "rgba(245,242,237,0.6)",
                    border: i === 0 ? "none" : "1px solid rgba(201,168,118,0.2)",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          }
        />

        {/* Podium */}
        {podium.length === 3 && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 14,
              marginTop: 18,
              marginBottom: 30,
            }}
          >
            {[
              { p: podium[1], h: 140, color: "#8B95A3", rk: 2 },
              { p: podium[0], h: 180, color: "#E8C879", rk: 1 },
              { p: podium[2], h: 110, color: "#C9722F", rk: 3 },
            ].map(({ p, h, color, rk }) => (
              <div key={p.userId} style={{ width: 200, textAlign: "center" }}>
                <Avatar initials={initialsFromName(p.username ?? "??")} size={56} />
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--cream)",
                    marginTop: 8,
                  }}
                >
                  {p.username}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color, marginTop: 2 }}>
                  {p.pr} PR
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: h,
                    background: `linear-gradient(180deg, ${color}80, ${color}30)`,
                    border: `1px solid ${color}80`,
                    borderBottom: "none",
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 48,
                    color,
                    boxShadow: rk === 1 ? `0 0 40px ${color}80` : "none",
                  }}
                >
                  {rk}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            background: "rgba(46,61,77,0.35)",
            borderRadius: 14,
            border: "1px solid rgba(201,168,118,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 2fr 1fr 1fr 80px 100px",
              padding: "10px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "rgba(245,242,237,0.5)",
              borderBottom: "1px solid rgba(201,168,118,0.12)",
              background: "rgba(15,22,32,0.4)",
            }}
          >
            <div>RG</div>
            <div>JOUEUR</div>
            <div>RANG</div>
            <div>PAYS</div>
            <div>±</div>
            <div style={{ textAlign: "right" }}>PR</div>
          </div>
          {rest.map((p, i) => (
            <div
              key={p.userId}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 1fr 80px 100px",
                padding: "12px 18px",
                alignItems: "center",
                borderBottom: i < rest.length - 1 ? "1px solid rgba(201,168,118,0.06)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "rgba(245,242,237,0.5)",
                }}
              >
                {p.rank}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={initialsFromName(p.username ?? "??")} size={28} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--cream)",
                  }}
                >
                  {p.username}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--or-2)" }}>
                {tierToRank(p.rankTier as any)}
              </div>
              <div style={{ fontSize: 18 }}>{p.country ?? "—"}</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(245,242,237,0.5)",
                }}
              >
                —
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--cream)",
                  textAlign: "right",
                }}
              >
                {p.pr}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
