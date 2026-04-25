import { type CardBackTheme } from "@/components/game/card-back";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

const ID_TO_THEME: Record<string, CardBackTheme> = {
  bandi_classic: "red",
  bleu_royal: "blue",
  or_sable: "gold",
  ombre_tribale: "dark",
};

/**
 * Returns the card-back theme the user has equipped via the shop, defaulting
 * to "red" (Bandi Classique) when nothing is set or the user isn't loaded.
 */
export function useActiveCardBackTheme(): CardBackTheme {
  const { userId } = useAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const id = user?.activeCardBack;
  if (id && ID_TO_THEME[id]) return ID_TO_THEME[id];
  return "red";
}
