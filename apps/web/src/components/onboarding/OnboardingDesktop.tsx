"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@lamap/convex/_generated/api";
import { GoldDust } from "@/components/game/GoldDust";
import { CardFace } from "@/components/game/Card";
import { useAuth } from "@/hooks/use-auth";

const STEPS = [
  {
    kicker: "RÈGLE 1 SUR 4 · BIENVENUE",
    title: "La Map.",
    accent: "Le jeu national.",
    body: (
      <>
        Quatre joueurs autour d&apos;une table, une dizaine de cartes par main, cinq manches.
        <br />
        <br />
        À chaque tour, joue plus haut que la carte précédente — ou laisse passer.
      </>
    ),
  },
  {
    kicker: "RÈGLE 2 SUR 4 · LA HIÉRARCHIE",
    title: "Plus haut,",
    accent: "tu domines.",
    body: (
      <>
        Le Roi bat le Valet, le Valet bat le 10, et ainsi de suite jusqu&apos;au 3 — qui d&apos;ordinaire
        vaut peu.
      </>
    ),
  },
  {
    kicker: "RÈGLE 3 SUR 4 · LE MOMENT CLÉ",
    title: "Le 3 vaut peu —",
    accent: "sauf à la fin.",
    body: (
      <>
        Remporter la <strong style={{ color: "var(--cream)" }}>5ème manche</strong> avec un 3
        déclenche un <span style={{ color: "var(--or-2)", fontWeight: 600 }}>Kora</span> — multiplie
        ton gain.
        <br />
        <br />
        Doublé si tu gagnes aussi la 4ème. Triplé en 3+4+5. Le coup de grâce du Bandi expérimenté.
      </>
    ),
  },
  {
    kicker: "RÈGLE 4 SUR 4 · TON PARCOURS",
    title: "Six rangs.",
    accent: "Une légende.",
    body: (
      <>
        Apprenti, Initié, Tacticien, Maître, Grand Bandi, Légende. Chaque victoire compte.
        <br />
        <br />
        Prêt ? Lance ta première partie.
      </>
    ),
  },
];

export function OnboardingDesktop() {
  const router = useRouter();
  const { user } = useAuth();
  const completeOnboarding = useMutation(api.onboarding.completeOnboarding);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const total = STEPS.length;
  const current = STEPS[step];
  const isLast = step === total - 1;

  async function next() {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    if (!user?._id) return;
    setSubmitting(true);
    try {
      await completeOnboarding({ userId: user._id });
      router.replace("/play");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 30%, #2C1A18 0%, #0A0E14 70%)",
      }}
    >
      <GoldDust count={16} opacity={0.4} />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #C9A876, #6E5536)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1F1810",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            L
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--cream)",
            }}
          >
            LaMap
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 5,
                borderRadius: 99,
                background: i <= step ? "var(--terre-2)" : "rgba(245,242,237,0.15)",
              }}
            />
          ))}
        </div>
        <button
          onClick={async () => {
            if (!user?._id) return;
            await completeOnboarding({ userId: user._id });
            router.replace("/play");
          }}
          style={{
            background: "transparent",
            border: "none",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "rgba(245,242,237,0.55)",
            cursor: "pointer",
          }}
        >
          Passer
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: 100,
          left: 80,
          right: 80,
          bottom: 100,
          display: "flex",
          alignItems: "center",
          gap: 80,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--or-2)",
            }}
          >
            {current.kicker}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 84,
              color: "var(--cream)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginTop: 18,
            }}
          >
            {current.title}
            <br />
            <span style={{ color: "var(--terre-2)", fontStyle: "italic" }}>{current.accent}</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              color: "rgba(245,242,237,0.7)",
              marginTop: 22,
              lineHeight: 1.55,
              maxWidth: 460,
            }}
          >
            {current.body}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            <button
              onClick={next}
              disabled={submitting}
              style={{
                padding: "14px 32px",
                borderRadius: 99,
                background: "linear-gradient(180deg, #C95048, #8E2F2A)",
                color: "var(--cream)",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? "wait" : "pointer",
                boxShadow: "0 6px 18px rgba(180,68,62,0.4)",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {isLast ? "Commencer →" : "Suivant →"}
            </button>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  padding: "14px 22px",
                  borderRadius: 99,
                  background: "transparent",
                  color: "rgba(245,242,237,0.7)",
                  border: "1px solid rgba(201,168,118,0.3)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                ← Retour
              </button>
            )}
          </div>
        </div>

        {/* Demo: 5 manches visualization */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const won = i >= 2;
              const isKora = i >= 3;
              const r = isKora ? 3 : i === 0 ? 7 : i === 1 ? 6 : 9;
              const s = isKora ? "hearts" : "spades";
              return (
                <div key={i} style={{ textAlign: "center", position: "relative" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      filter: isKora
                        ? "drop-shadow(0 0 20px rgba(232,200,121,0.5))"
                        : "none",
                    }}
                  >
                    <CardFace rank={r} suit={s as any} size="md" />
                    {isKora && (
                      <div
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -14,
                          padding: "3px 9px",
                          borderRadius: 99,
                          background: "var(--or)",
                          color: "#1F1810",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          boxShadow: "0 0 12px rgba(232,200,121,0.6)",
                        }}
                      >
                        ×{i === 3 ? "2" : "4"}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "rgba(245,242,237,0.5)",
                      marginTop: 12,
                    }}
                  >
                    M{i + 1}
                  </div>
                  <div
                    style={{
                      width: 24,
                      height: 5,
                      borderRadius: 3,
                      margin: "6px auto 0",
                      background: won
                        ? isKora
                          ? "var(--or)"
                          : "var(--cream)"
                        : "rgba(245,242,237,0.15)",
                      boxShadow: isKora ? "0 0 10px rgba(232,200,121,0.6)" : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
