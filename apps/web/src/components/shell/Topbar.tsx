"use client";

import Link from "next/link";

type Props = {
  tabs?: { label: string; href: string }[];
  activeHref?: string;
  balance?: number;
  unreadCount?: number;
};

export function Topbar({ tabs = [], activeHref, balance, unreadCount = 0 }: Props) {
  return (
    <div
      style={{
        height: 64,
        padding: "0 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(201,168,118,0.1)",
      }}
    >
      <div style={{ display: "flex", gap: 22 }}>
        {tabs.map((t) => {
          const active = t.href === activeHref;
          return (
            <Link
              key={t.label}
              href={t.href}
              style={{
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: active ? "var(--cream)" : "rgba(245,242,237,0.55)",
                paddingBottom: 22,
                marginTop: 22,
                borderBottom: active ? "2px solid var(--terre-2)" : "2px solid transparent",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {balance != null && (
          <Link href="/wallet" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                background: "rgba(166,130,88,0.15)",
                border: "1px solid rgba(201,168,118,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #E8C879, #6E5536)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--or-2)",
                }}
              >
                {formatBalance(balance)} K
              </span>
            </div>
          </Link>
        )}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(46,61,77,0.4)",
              border: "1px solid rgba(201,168,118,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--or-2)",
            }}
          >
            🔔
          </div>
          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--terre-2)",
                boxShadow: "0 0 6px rgba(212,99,93,0.7)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function formatBalance(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}
