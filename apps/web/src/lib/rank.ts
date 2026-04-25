import type { RankName } from "@/components/game/RankBadge";

export type ConvexRankTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "LEGEND";

const TIER_TO_NAME: Record<ConvexRankTier, RankName> = {
  BRONZE: "Apprenti",
  SILVER: "Initié",
  GOLD: "Tacticien",
  PLATINUM: "Maître",
  DIAMOND: "Maître",
  MASTER: "Grand Bandi",
  LEGEND: "Légende",
};

const TIER_RANGES: Record<ConvexRankTier, { min: number; max: number; next?: number }> = {
  BRONZE:   { min: 0,    max: 199,  next: 200  },
  SILVER:   { min: 200,  max: 399,  next: 400  },
  GOLD:     { min: 400,  max: 699,  next: 700  },
  PLATINUM: { min: 700,  max: 999,  next: 1000 },
  DIAMOND:  { min: 1000, max: 1499, next: 1500 },
  MASTER:   { min: 1500, max: 1999, next: 2000 },
  LEGEND:   { min: 2000, max: 9999 },
};

export function tierToRank(tier?: ConvexRankTier | null): RankName {
  if (!tier) return "Apprenti";
  return TIER_TO_NAME[tier];
}

export function prToRank(pr: number): RankName {
  if (pr >= 2000) return "Légende";
  if (pr >= 1500) return "Grand Bandi";
  if (pr >= 700) return "Maître";
  if (pr >= 400) return "Tacticien";
  if (pr >= 200) return "Initié";
  return "Apprenti";
}

export function nextRankThreshold(pr: number): { next?: number; nextName?: RankName; progress: number } {
  if (pr >= 2000) return { progress: 1 };
  const tier =
    pr >= 1500 ? "MASTER"
    : pr >= 1000 ? "DIAMOND"
    : pr >= 700 ? "PLATINUM"
    : pr >= 400 ? "GOLD"
    : pr >= 200 ? "SILVER"
    : "BRONZE";
  const range = TIER_RANGES[tier];
  const min = range.min;
  const next = range.next ?? range.max;
  const progress = Math.max(0, Math.min(1, (pr - min) / (next - min)));
  return { next, nextName: prToRank(next), progress };
}

export function initialsFromName(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
