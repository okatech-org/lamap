"use client";

import { useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { SectionTitle } from "@/components/shell/SectionTitle";
import { Topbar } from "@/components/shell/Topbar";
import { useAuth } from "@/hooks/use-auth";

const PACKS = [
  { k: 500, x: 5000, b: "" },
  { k: 1200, x: 10000, b: "+200 bonus", popular: true },
  { k: 2500, x: 20000, b: "+500 bonus" },
  { k: 6500, x: 50000, b: "+1500 bonus · meilleur deal" },
];

export function WalletDesktop() {
  const { user } = useAuth();
  const balance = user?.kora ?? user?.balance ?? 0;
  const transactions =
    useQuery(
      api.economy.getTransactions,
      user?._id ? { userId: user._id, limit: 12 } : "skip",
    ) ?? [];

  return (
    <>
      <Topbar tabs={[]} balance={balance} />
      <div style={{ padding: "36px 44px", flex: 1, position: "relative", overflow: "auto" }}>
        <GoldDust count={14} opacity={0.4} />
        <SectionTitle kicker="WALLET KORA" title="Ton solde de jetons" />

        {/* Hero balance */}
        <div
          style={{
            padding: 36,
            borderRadius: 18,
            background:
              "linear-gradient(110deg, rgba(166,130,88,0.2), rgba(46,61,77,0.4))",
            border: "1px solid rgba(201,168,118,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 30%, #F2DA9A 0%, #C9A876 50%, #6E5536 100%)",
                border: "4px solid #6E5536",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1F1810",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 42,
                boxShadow:
                  "0 0 50px rgba(232,200,121,0.5), inset 0 -4px 12px rgba(0,0,0,0.4)",
              }}
            >
              K
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--or-2)",
                }}
              >
                SOLDE ACTUEL
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 72,
                  color: "var(--cream)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginTop: 6,
                }}
              >
                {balance.toLocaleString("fr-FR")}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "rgba(245,242,237,0.6)",
                  marginTop: 4,
                }}
              >
                ≈ {(balance * 10).toLocaleString("fr-FR")} XAF · 1 K = 10 XAF
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 220 }}>
            <button
              style={{
                padding: "14px 22px",
                borderRadius: 99,
                background: "linear-gradient(180deg, #C95048, #8E2F2A)",
                color: "var(--cream)",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Recharger
            </button>
            <button
              style={{
                padding: "14px 22px",
                borderRadius: 99,
                background: "transparent",
                color: "var(--cream)",
                border: "1px solid rgba(201,168,118,0.4)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Retirer
            </button>
          </div>
        </div>

        {/* Packs + History */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginTop: 26 }}>
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
              PACKS DE RECHARGE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {PACKS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    position: "relative",
                    background: p.popular ? "rgba(180,68,62,0.18)" : "rgba(46,61,77,0.45)",
                    border: p.popular
                      ? "1.5px solid var(--terre-2)"
                      : "1px solid rgba(201,168,118,0.12)",
                  }}
                >
                  {p.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: 14,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: "var(--terre-2)",
                        color: "var(--cream)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                      }}
                    >
                      POPULAIRE
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #E8C879, #6E5536)",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: 26,
                        color: "var(--cream)",
                      }}
                    >
                      {p.k.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  {p.b && (
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--or-2)",
                        marginTop: 6,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {p.b.toUpperCase()}
                    </div>
                  )}
                  <button
                    style={{
                      width: "100%",
                      marginTop: 14,
                      padding: "10px",
                      borderRadius: 99,
                      background: p.popular ? "var(--cream)" : "transparent",
                      color: p.popular ? "#1F1810" : "var(--cream)",
                      border: p.popular ? "none" : "1px solid rgba(201,168,118,0.3)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {p.x.toLocaleString("fr-FR")} XAF
                  </button>
                </div>
              ))}
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
              HISTORIQUE
            </div>
            <div
              style={{
                background: "rgba(46,61,77,0.35)",
                borderRadius: 12,
                border: "1px solid rgba(201,168,118,0.1)",
                padding: 6,
              }}
            >
              {transactions.length === 0 && (
                <div
                  style={{
                    padding: 18,
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "rgba(245,242,237,0.5)",
                  }}
                >
                  Aucune transaction.
                </div>
              )}
              {transactions.map((t: any) => {
                const positive = (t.amount ?? 0) > 0;
                return (
                  <div
                    key={t._id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--cream)",
                        }}
                      >
                        {t.label ?? t.reason ?? t.type ?? "Transaction"}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "rgba(245,242,237,0.45)",
                        }}
                      >
                        {formatRelative(t._creationTime)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: positive ? "var(--or-2)" : "#D4635D",
                      }}
                    >
                      {positive ? "+" : ""}
                      {(t.amount ?? 0).toLocaleString("fr-FR")} K
                    </div>
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

function formatRelative(t: number): string {
  const d = Date.now() - t;
  const m = Math.floor(d / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  return `il y a ${days} j`;
}
