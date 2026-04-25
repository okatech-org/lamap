"use client";

import { useMemo } from "react";

type Props = { count?: number; opacity?: number };

export function GoldDust({ count = 18, opacity = 0.6 }: Props) {
  const dots = useMemo(() => {
    const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }).map((_, i) => ({
      x: seed(i + 1) * 100,
      y: seed(i + 7) * 100,
      size: 2 + seed(i + 13) * 4,
      delay: seed(i + 19) * 6,
      dur: 5 + seed(i + 23) * 5,
    }));
  }, [count]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,118,0.9) 0%, rgba(201,168,118,0) 70%)",
            opacity,
            animation: `lamap-float ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
