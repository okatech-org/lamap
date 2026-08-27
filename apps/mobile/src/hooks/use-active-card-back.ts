import type { CardBackTheme } from "@/components/game/card-back";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";

export const CARD_BACK_THEMES: Record<string, CardBackTheme> = {
  bandi_classic: "red",
  bleu_royal: "blue",
  or_sable: "gold",
  ombre_tribale: "dark",
};

export function useActiveCardBackTheme(): CardBackTheme {
  const user = useQuery(api.users.getCurrentUser, {});
  return CARD_BACK_THEMES[user?.activeCardBackId ?? "bandi_classic"] ?? "red";
}
