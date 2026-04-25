"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { id: string; href: string; icon: string; label: string };

const ITEMS: NavItem[] = [
  { id: "play",     href: "/play",     icon: "◆", label: "Jouer" },
  { id: "lobby",    href: "/play",     icon: "⚔", label: "Lobby" },
  { id: "rank",     href: "/rank",     icon: "♛", label: "Classement" },
  { id: "spectate", href: "/spectate", icon: "⊙", label: "Spectateur" },
  { id: "wallet",   href: "/wallet",   icon: "K", label: "Wallet" },
  { id: "shop",     href: "/shop",     icon: "◈", label: "Boutique" },
  { id: "friends",  href: "/u/me",     icon: "◐", label: "Amis" },
];

type Props = {
  player?: {
    initials: string;
    name: string;
    rank: string;
    points: number;
  };
};

export function AppSidebar({ player }: Props) {
  const pathname = usePathname();
  const activeId = matchActiveId(pathname);

  return (
    <div
      style={{
        width: 220,
        height: "100%",
        background: "#080C12",
        borderRight: "1px solid rgba(201,168,118,0.1)",
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link href="/play" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 22px" }}>
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
              boxShadow: "0 0 20px rgba(201,168,118,0.3)",
            }}
          >
            L
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--cream)",
                letterSpacing: "-0.02em",
              }}
            >
              LaMap
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--or-2)",
                letterSpacing: "0.15em",
              }}
            >
              S04 · LIGUE
            </div>
          </div>
        </div>
      </Link>

      <div style={{ flex: 1 }}>
        {ITEMS.map((it) => {
          const active = it.id === activeId;
          return (
            <Link
              key={it.id}
              href={it.href}
              style={{
                textDecoration: "none",
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: active ? "rgba(180,68,62,0.18)" : "transparent",
                border: active ? "1px solid rgba(180,68,62,0.4)" : "1px solid transparent",
                color: active ? "var(--cream)" : "rgba(245,242,237,0.65)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 22,
                  textAlign: "center",
                  color: active ? "var(--or-2)" : "rgba(201,168,118,0.5)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                }}
              >
                {it.icon}
              </div>
              {it.label}
            </Link>
          );
        })}
      </div>

      {/* Player chip */}
      {player && (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            background: "rgba(46,61,77,0.4)",
            border: "1px solid rgba(201,168,118,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B4443E, #6E2520)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--cream)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 12,
              border: "1.5px solid var(--or-2)",
            }}
          >
            {player.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--cream)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {player.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--or-2)" }}>
              {player.rank} · {player.points}
            </div>
          </div>
          <div style={{ color: "rgba(245,242,237,0.5)", fontSize: 16 }}>⋯</div>
        </div>
      )}
    </div>
  );
}

function matchActiveId(pathname: string): string {
  if (pathname.startsWith("/rank")) return "rank";
  if (pathname.startsWith("/spectate")) return "spectate";
  if (pathname.startsWith("/wallet")) return "wallet";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/u/")) return "friends";
  if (pathname.startsWith("/play")) return "play";
  return "play";
}
