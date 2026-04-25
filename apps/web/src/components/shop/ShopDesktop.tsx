"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { SectionTitle } from "@/components/shell/SectionTitle";
import { Topbar } from "@/components/shell/Topbar";
import { useAuth } from "@/hooks/use-auth";

type CardBack = {
  id: string;
  name: string;
  price?: number;
  rarity?: string;
  description?: string;
  patternColors?: string[];
  ownership?: { owned: boolean; active: boolean };
};

export function ShopDesktop() {
  const { user } = useAuth();
  const balance = user?.kora ?? user?.balance ?? 0;
  const cardBacks = useQuery(
    api.cosmetics.listCardBacks,
    user?._id ? { userId: user._id } : "skip",
  ) as CardBack[] | undefined;
  const purchase = useMutation(api.cosmetics.purchaseCardBack);
  const setActive = useMutation(api.cosmetics.setActiveCardBack);
  const [error, setError] = useState<string | null>(null);

  async function handlePurchase(skinId: string) {
    if (!user?._id) return;
    setError(null);
    try {
      await purchase({ userId: user._id, cardBackId: skinId });
    } catch (e: any) {
      setError(e?.message ?? "Achat impossible.");
    }
  }
  async function handleActivate(skinId: string) {
    if (!user?._id) return;
    try {
      await setActive({ userId: user._id, cardBackId: skinId });
    } catch {
      // swallow
    }
  }

  return (
    <>
      <Topbar tabs={[]} balance={balance} />
      <div style={{ padding: "36px 44px", flex: 1, position: "relative", overflow: "auto" }}>
        <GoldDust count={12} opacity={0.3} />
        <SectionTitle kicker="BOUTIQUE · SAISON 4" title="Personnalise ton style" />

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(180,68,62,0.18)",
              border: "1px solid rgba(180,68,62,0.4)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--terre-2)",
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {(cardBacks ?? []).map((cb) => {
            const owned = cb.ownership?.owned;
            const active = cb.ownership?.active;
            const accent = cb.patternColors?.[0] ?? "#C9A876";
            const bg = `linear-gradient(135deg, ${cb.patternColors?.[1] ?? "#B4443E"}, ${cb.patternColors?.[2] ?? "#6E2520"})`;
            return (
              <div
                key={cb.id}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  position: "relative",
                  background: "rgba(46,61,77,0.4)",
                  border: active
                    ? "1.5px solid var(--or)"
                    : owned
                      ? "1.5px solid rgba(201,168,118,0.4)"
                      : "1px solid rgba(201,168,118,0.12)",
                }}
              >
                {cb.rarity && cb.rarity !== "COMMON" && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "rgba(157,91,210,0.25)",
                      border: "1px solid rgba(157,91,210,0.5)",
                      color: "#C898E5",
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {cb.rarity}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
                  <div
                    style={{
                      width: 100,
                      height: 140,
                      borderRadius: 12,
                      padding: 8,
                      background: bg,
                      border: "2px solid rgba(0,0,0,0.4)",
                      boxShadow: "0 16px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 6,
                        border: `1px solid ${accent}80`,
                        background: `repeating-linear-gradient(45deg, ${accent}30 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, ${accent}30 0 1px, transparent 1px 8px)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 18,
                          color: accent,
                        }}
                      >
                        LM
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--cream)",
                    marginTop: 4,
                  }}
                >
                  {cb.name}
                </div>
                <button
                  onClick={() =>
                    owned ? (active ? null : handleActivate(cb.id)) : handlePurchase(cb.id)
                  }
                  disabled={!!active}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 99,
                    background: active
                      ? "transparent"
                      : owned
                        ? "rgba(201,168,118,0.18)"
                        : "var(--terre)",
                    border: active
                      ? "1px solid var(--or)"
                      : owned
                        ? "1px solid rgba(201,168,118,0.5)"
                        : "none",
                    color: active ? "var(--or)" : owned ? "var(--or-2)" : "var(--cream)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textAlign: "center",
                    cursor: active ? "default" : "pointer",
                  }}
                >
                  {active
                    ? "ACTIF"
                    : owned
                      ? "ACTIVER"
                      : `${(cb.price ?? 0).toLocaleString("fr-FR")} K`}
                </button>
              </div>
            );
          })}
          {!cardBacks && (
            <div
              style={{
                gridColumn: "1 / -1",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--or-2)",
                textAlign: "center",
                padding: 40,
              }}
            >
              Chargement de la boutique…
            </div>
          )}
        </div>
      </div>
    </>
  );
}
