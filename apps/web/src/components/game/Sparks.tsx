"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { count?: number; palette?: string[] };

export function Sparks({
  count = 28,
  palette = ["#C9A876", "#E8C879", "#B4443E", "#F5F2ED"],
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const r = 60 + Math.random() * 80;
      return {
        cx: Math.cos(a) * r,
        cy: Math.sin(a) * r * 0.8 - 40,
        color: palette[i % palette.length],
        delay: Math.random() * 0.2,
        size: 6 + Math.random() * 6,
      };
    });
  }, [count, palette, mounted]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={
            {
              position: "absolute",
              width: it.size,
              height: it.size * 0.4,
              background: it.color,
              borderRadius: 1,
              animation: `lamap-confetti 1.4s ${it.delay}s cubic-bezier(0.2, 0.7, 0.3, 1) forwards`,
              "--cx": `${it.cx}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
