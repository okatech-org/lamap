"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { useAuth } from "./use-auth";

export type Card = {
  id: string;
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  playable: boolean;
};

export function useGame(gameId: string | null) {
  const { user } = useAuth();
  const myUserId = user?._id;

  const game = useQuery(
    api.games.getGame,
    gameId ? { gameId } : "skip",
  );

  const myHand = useQuery(
    api.games.getMyHand,
    gameId && myUserId ? { gameId, playerId: myUserId } : "skip",
  ) as Card[] | undefined;

  const currentPlays = useQuery(
    api.games.getPlaysByTurn,
    gameId && (game as any)?.currentRound
      ? { gameId, round: (game as any).currentRound }
      : "skip",
  );

  const turnResults = useQuery(
    api.games.getTurnResults,
    gameId ? { gameId } : "skip",
  );

  const playCardMutation = useMutation(api.games.playCard);
  const concedeMutation = useMutation(api.games.concedeGame);
  const { userId: clerkUserId } = useAuth();

  const isMyTurn = (game as any)?.currentTurnPlayerId === myUserId;

  function canPlayCard(card: Card) {
    if (!myHand || !game) return false;
    return card.playable === true;
  }

  async function playCard(card: Card) {
    if (!myUserId || !gameId) throw new Error("not ready");
    if (!canPlayCard(card)) throw new Error("Cannot play this card");
    return playCardMutation({ gameId, cardId: card.id, playerId: myUserId });
  }

  async function concede() {
    if (!gameId || !clerkUserId) throw new Error("not ready");
    return concedeMutation({ gameId, clerkUserId });
  }

  return {
    game,
    myHand: myHand ?? [],
    currentPlays: currentPlays ?? [],
    turnResults: turnResults ?? [],
    playCard,
    concede,
    isMyTurn,
    canPlayCard,
    myUserId,
  };
}
