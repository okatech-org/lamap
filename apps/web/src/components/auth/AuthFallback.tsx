"use client";

// Rendered when Clerk keys are missing/placeholder (dev mode).
// Mirrors the visual style of the Clerk box so the layout doesn't shift.

export function AuthFallback({ mode }: { mode: "sign-in" | "sign-up" }) {
  const providers = [
    { id: "google", label: "Continuer avec Google", bg: "var(--cream)", color: "#1A1A1A", icon: "G", iconBg: "#fff", iconColor: "#4285F4" },
    { id: "apple", label: "Continuer avec Apple", bg: "#1A1A1A", color: "var(--cream)", icon: "", iconBg: "rgba(255,255,255,0.15)", iconColor: "var(--cream)", border: "1px solid rgba(255,255,255,0.18)" },
  ];
  return (
    <div>
      <div
        style={{
          padding: 12,
          marginBottom: 18,
          borderRadius: 8,
          background: "rgba(180,68,62,0.15)",
          border: "1px solid rgba(180,68,62,0.4)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.05em",
          color: "var(--terre-2)",
        }}
      >
        ⚠ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY non défini — auth désactivé.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {providers.map((p) => (
          <button
            key={p.id}
            disabled
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 10,
              background: p.bg,
              color: p.color,
              border: p.border ?? "none",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.65,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: p.iconBg,
                color: p.iconColor,
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {p.icon || ""}
            </span>
            {p.label}
          </button>
        ))}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "rgba(245,242,237,0.45)",
          marginTop: 26,
          lineHeight: 1.5,
        }}
      >
        {mode === "sign-up"
          ? "Crée un compte pour rejoindre la table. Aucune carte bancaire requise pour les parties amicales."
          : "En continuant, tu acceptes les Conditions et reconnais avoir lu notre Politique de confidentialité."}
      </div>
    </div>
  );
}
