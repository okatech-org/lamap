"use client";

import { useState } from "react";

type Tab = { id: string; label: string; count?: number };

type Props = {
  tabs?: Tab[];
  defaultTab?: string;
  children: (activeId: string) => React.ReactNode;
};

export function GamePanel({
  tabs = [
    { id: "chat", label: "Chat" },
    { id: "spec", label: "Spectateurs" },
    { id: "hist", label: "Historique" },
  ],
  defaultTab = "chat",
  children,
}: Props) {
  const [active, setActive] = useState(defaultTab);
  return (
    <div
      style={{
        width: 320,
        height: "100%",
        background: "#0B1018",
        borderLeft: "1px solid rgba(201,168,118,0.12)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,168,118,0.1)" }}>
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? "var(--cream)" : "rgba(245,242,237,0.5)",
                borderBottom: isActive ? "2px solid var(--terre-2)" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {t.label}
              {t.count != null && (
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: 99,
                    background: isActive ? "var(--terre)" : "rgba(201,168,118,0.15)",
                    color: isActive ? "var(--cream)" : "rgba(201,168,118,0.7)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {children(active)}
    </div>
  );
}
