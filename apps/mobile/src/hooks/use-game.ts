import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "./use-auth";

export type Card = {
  id: string;
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: "3" | "4" | "5" | "6" | "7" | "8" | "9";
  playable: boolean;
};

export function useGame(gameId: string | null) {
  const { userId } = useAuth();
  const game = useQuery(api.games.getGame, gameId ? { gameId } : "skip");
  const myHand = useQuery(api.games.getMyHand, gameId ? { gameId } : "skip") as
    | Card[]
    | undefined;
  const currentPlays = useQuery(
    api.games.getPlaysByTurn,
    gameId && game ? { gameId, round: game.currentRound } : "skip",
  );
  const turnResults = useQuery(
    api.games.getTurnResults,
    gameId ? { gameId } : "skip",
  );
  const playMutation = useMutation(api.games.playCard);
  return {
    game,
    myHand: myHand ?? [],
    currentPlays: currentPlays ?? [],
    turnResults: turnResults ?? [],
    myUserId: userId,
    isMyTurn: Boolean(userId && game?.currentTurnPlayerId === userId),
    canPlayCard: (card: Card) =>
      Boolean(card.playable && game?.status === "PLAYING"),
    playCard: async (card: Card) => {
      if (!gameId || !card.playable) throw new Error("Carte non jouable");
      await playMutation({ gameId, cardId: card.id });
    },
  };
}
