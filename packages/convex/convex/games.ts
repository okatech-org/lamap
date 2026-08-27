import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { requireAuthUserId } from "./authHelpers";
import {
  addHistoryEntry,
  createDeck,
  determineRoundWinner,
  getAIBotId,
  getAIBotUsername,
  getCardValue,
  getKoraType,
  getPlayerId,
  updatePlayableCards,
  updatePlayerTurn,
  validatePlayCardAction,
  type Game,
} from "./gameEngine";
import { calculateGameRating, INITIAL_RANKING_POINTS } from "./ranking";
import { aiDifficultyValidator, type Card, type Player } from "./validators";

type Difficulty = "easy" | "medium" | "hard";

async function gameByPublicId(
  ctx: { db: QueryCtx["db"] | MutationCtx["db"] },
  gameId: string,
) {
  return await ctx.db
    .query("games")
    .withIndex("by_game_id", (q) => q.eq("gameId", gameId))
    .first();
}

function isParticipant(game: Doc<"games">, userId: Id<"users">) {
  return game.players.some((player) => player.userId === userId);
}

async function requireParticipant(
  ctx: { auth: QueryCtx["auth"]; db: QueryCtx["db"] | MutationCtx["db"] },
  gameId: string,
) {
  const userId = await requireAuthUserId(ctx);
  const game = await gameByPublicId(ctx, gameId);
  if (!game) throw new ConvexError("GAME_NOT_FOUND");
  if (!isParticipant(game, userId)) throw new ConvexError("GAME_ACCESS_DENIED");
  return { game, userId };
}

async function cleanupQueue(ctx: MutationCtx, gameId: string) {
  const entries = (await ctx.db.query("matchmakingQueue").collect()).filter(
    (entry) => entry.gameId === gameId,
  );
  for (const entry of entries) await ctx.db.delete(entry._id);
}

async function applyRankedResult(
  ctx: MutationCtx,
  game: Game,
  winnerId: Id<"users"> | string,
) {
  if (game.mode !== "RANKED" || game.ratingResult) return game.ratingResult;
  const winnerPlayer = game.players.find(
    (player) => getPlayerId(player) === winnerId && player.userId,
  );
  const loserPlayer = game.players.find(
    (player) => getPlayerId(player) !== winnerId && player.userId,
  );
  if (!winnerPlayer?.userId || !loserPlayer?.userId) {
    throw new ConvexError("INVALID_RANKED_PLAYERS");
  }
  const winner = await ctx.db.get(winnerPlayer.userId);
  const loser = await ctx.db.get(loserPlayer.userId);
  if (!winner || !loser) throw new ConvexError("PLAYER_NOT_FOUND");

  const result = calculateGameRating(
    game.mode,
    Boolean(game.ratingResult),
    winner.rankingPoints ?? INITIAL_RANKING_POINTS,
    loser.rankingPoints ?? INITIAL_RANKING_POINTS,
  );
  if (!result) return game.ratingResult;
  await ctx.db.patch(winner._id, {
    rankingPoints: result.winner.newPoints,
    rankedGames: (winner.rankedGames ?? 0) + 1,
    rankedWins: (winner.rankedWins ?? 0) + 1,
  });
  await ctx.db.patch(loser._id, {
    rankingPoints: result.loser.newPoints,
    rankedGames: (loser.rankedGames ?? 0) + 1,
    rankedWins: loser.rankedWins ?? 0,
  });
  return {
    winner: { userId: winner._id, ...result.winner },
    loser: { userId: loser._id, ...result.loser },
    appliedAt: Date.now(),
  };
}

async function finishGame(
  ctx: MutationCtx,
  game: Game,
  winnerId: Id<"users"> | string,
  endReason: string,
  victoryType: Doc<"games">["victoryType"],
) {
  if (game.status === "ENDED") return game;
  const ratingResult = await applyRankedResult(ctx, game, winnerId);
  let ended: Game = {
    ...game,
    status: "ENDED",
    winnerId,
    endReason,
    victoryType,
    endedAt: Date.now(),
    currentTurnPlayerId: null,
    lastUpdatedAt: Date.now(),
    ratingResult,
  };
  ended = addHistoryEntry(ended, "game_ended", winnerId, {
    winnerId,
    message: endReason,
  });
  await cleanupQueue(ctx, game.gameId);
  return ended;
}

function buildPlayer(user: Doc<"users">): Player {
  if (!user.username) throw new ConvexError("ONBOARDING_REQUIRED");
  return {
    userId: user._id,
    username: user.username,
    type: "user",
    isConnected: true,
    avatarId: user.activeAvatarId ?? "initials",
    cardBackId: user.activeCardBackId ?? "bandi_classic",
  };
}

export async function createStartedGame(
  ctx: MutationCtx,
  args:
    | { mode: "RANKED"; firstUserId: Id<"users">; secondUserId: Id<"users"> }
    | { mode: "AI"; firstUserId: Id<"users">; difficulty: Difficulty },
) {
  const firstUser = await ctx.db.get(args.firstUserId);
  if (!firstUser) throw new ConvexError("PLAYER_NOT_FOUND");
  const players: Player[] = [buildPlayer(firstUser)];
  let difficulty: Difficulty | null = null;
  if (args.mode === "RANKED") {
    const secondUser = await ctx.db.get(args.secondUserId);
    if (!secondUser) throw new ConvexError("PLAYER_NOT_FOUND");
    players.push(buildPlayer(secondUser));
  } else {
    difficulty = args.difficulty;
    players.push({
      userId: null,
      botId: getAIBotId(difficulty),
      username: getAIBotUsername(difficulty),
      type: "ai",
      isConnected: true,
      avatarId: "initials",
      cardBackId: "bandi_classic",
      aiDifficulty: difficulty,
    });
  }

  const seed = crypto.randomUUID();
  const gameId = `game-${seed}`;
  const now = Date.now();
  const gameDocId = await ctx.db.insert("games", {
    gameId,
    seed,
    version: 1,
    status: "WAITING",
    mode: args.mode,
    currentRound: 1,
    maxRounds: 5,
    hasHandPlayerId: null,
    currentTurnPlayerId: null,
    players,
    playedCards: [],
    history: [{ action: "game_created", timestamp: now }],
    winnerId: null,
    endReason: null,
    victoryType: null,
    aiDifficulty: difficulty,
    hostId: args.firstUserId,
    startedAt: now,
    endedAt: null,
    lastUpdatedAt: now,
  });
  const game = await ctx.db.get(gameDocId);
  if (!game) throw new ConvexError("GAME_CREATION_FAILED");

  const deck = createDeck(seed);
  const firstHand = deck.slice(0, 5);
  const secondHand = deck.slice(5, 10);
  const startingPlayerId = getPlayerId(players[Math.random() < 0.5 ? 0 : 1]!);
  const dealtPlayers = players.map((player, index) => ({
    ...player,
    hand: index === 0 ? firstHand : secondHand,
  }));
  let state: Game = {
    ...game,
    status: "PLAYING",
    players: dealtPlayers,
    hasHandPlayerId: startingPlayerId,
    currentTurnPlayerId: startingPlayerId,
    lastUpdatedAt: Date.now(),
  };
  state = addHistoryEntry(state, "game_started", startingPlayerId, {
    message: "Partie commencée",
  });
  state = updatePlayableCards(state);

  await ctx.db.patch(gameDocId, state);
  await scheduleAiIfNeeded(ctx, state);
  return { gameId };
}

function publicGame(game: Doc<"games">) {
  return {
    ...game,
    players: game.players.map(({ hand, ...player }) => ({
      ...player,
      handCount: hand?.length ?? 0,
    })),
  };
}

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const { game } = await requireParticipant(ctx, args.gameId);
    return publicGame(game);
  },
});

export const getActiveMatch = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const games = await ctx.db.query("games").collect();
    const active = games
      .filter((game) => game.status !== "ENDED" && isParticipant(game, userId))
      .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)[0];
    return active ? publicGame(active) : null;
  },
});

export const getMyHand = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const { game, userId } = await requireParticipant(ctx, args.gameId);
    return game.players.find((player) => player.userId === userId)?.hand ?? [];
  },
});

export const getPlaysByTurn = query({
  args: { gameId: v.string(), round: v.number() },
  handler: async (ctx, args) => {
    const { game } = await requireParticipant(ctx, args.gameId);
    return game.playedCards.filter((card) => card.round === args.round);
  },
});

export const getTurnResults = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const { game } = await requireParticipant(ctx, args.gameId);
    return game.history
      .filter((entry) => entry.action === "round_won")
      .map((entry) => ({
        turn: entry.data?.round ?? 0,
        winnerId: entry.playerId ?? "",
        winningCard: {
          suit: entry.data?.cardSuit ?? "hearts",
          rank: entry.data?.cardRank ?? "3",
        },
      }));
  },
});

function koraVictoryType(
  cards: Doc<"games">["playedCards"],
  winnerId: Id<"users"> | string,
) {
  let consecutive = 0;
  for (let round = 5; round >= 3; round -= 1) {
    const card = cards.find(
      (played) => played.round === round && played.playerId === winnerId,
    );
    if (card?.card.rank !== "3") break;
    consecutive += 1;
  }
  return getKoraType(consecutive);
}

async function applyCard(
  ctx: MutationCtx,
  game: Game,
  cardId: string,
  playerId: Id<"users"> | string,
) {
  const validation = validatePlayCardAction(cardId, playerId, game);
  if (!validation.valid)
    throw new ConvexError(validation.error ?? "INVALID_MOVE");
  const player = game.players.find(
    (candidate) => getPlayerId(candidate) === playerId,
  )!;
  const card = player.hand!.find((candidate) => candidate.id === cardId)!;
  const playedCards = [
    ...game.playedCards,
    { card, playerId, round: game.currentRound, timestamp: Date.now() },
  ];
  let state: Game = {
    ...game,
    playedCards,
    players: game.players.map((candidate) =>
      getPlayerId(candidate) === playerId
        ? {
            ...candidate,
            hand: candidate.hand?.filter((item) => item.id !== cardId),
            isThinking: false,
          }
        : candidate,
    ),
  };
  state = addHistoryEntry(state, "card_played", playerId, {
    cardId: card.id,
    cardSuit: card.suit,
    cardRank: card.rank,
    round: game.currentRound,
  });

  const roundCards = playedCards.filter(
    (played) => played.round === game.currentRound,
  );
  if (roundCards.length === 2) {
    const winnerId = determineRoundWinner(
      roundCards[0]!,
      roundCards[1]!,
      game.hasHandPlayerId!,
    );
    const winningCard = roundCards.find(
      (played) => played.playerId === winnerId,
    )!.card;
    state.hasHandPlayerId = winnerId;
    state = addHistoryEntry(state, "round_won", winnerId, {
      winnerId,
      round: game.currentRound,
      cardSuit: winningCard.suit,
      cardRank: winningCard.rank,
    });

    if (game.currentRound >= game.maxRounds) {
      const specialType = koraVictoryType(playedCards, winnerId);
      if (specialType !== "normal") {
        state = addHistoryEntry(state, "kora_achieved", winnerId, {
          winnerId,
          koraType: specialType,
          message: "Victoire Kora",
        });
      }
      state = await finishGame(
        ctx,
        state,
        winnerId,
        "Partie terminée",
        specialType,
      );
    } else {
      state.currentRound += 1;
      state.currentTurnPlayerId = updatePlayerTurn(state);
    }
  } else {
    state.currentTurnPlayerId = updatePlayerTurn(state);
  }
  state.lastUpdatedAt = Date.now();
  state.version += 1;
  return state.status === "PLAYING" ? updatePlayableCards(state) : state;
}

async function scheduleAiIfNeeded(ctx: MutationCtx, game: Game) {
  if (game.mode !== "AI" || game.status !== "PLAYING") return;
  const ai = game.players.find((player) => player.type === "ai");
  if (!ai || game.currentTurnPlayerId !== getPlayerId(ai)) return;
  const delay =
    ai.aiDifficulty === "hard" ? 800 : ai.aiDifficulty === "medium" ? 600 : 400;
  await ctx.scheduler.runAfter(delay, internal.games.triggerAITurn, {
    gameId: game.gameId,
  });
}

export const playCard = mutation({
  args: { gameId: v.string(), cardId: v.string() },
  handler: async (ctx, args) => {
    const { game, userId } = await requireParticipant(ctx, args.gameId);
    const state = await applyCard(ctx, game, args.cardId, userId);
    await ctx.db.patch(game._id, state);
    await scheduleAiIfNeeded(ctx, state);
    return { success: true };
  },
});

function chooseAiCard(game: Game, difficulty: Difficulty): Card | undefined {
  const ai = game.players.find((player) => player.type === "ai");
  const playable = ai?.hand?.filter((card) => card.playable) ?? [];
  if (playable.length === 0) return undefined;
  if (difficulty === "easy") {
    return playable[Math.floor(Math.random() * playable.length)];
  }
  const lead = game.playedCards.find(
    (played) =>
      played.round === game.currentRound &&
      played.playerId !== getPlayerId(ai!),
  );
  const ordered = [...playable].sort(
    (a, b) => getCardValue(a.rank) - getCardValue(b.rank),
  );
  if (!lead) return difficulty === "hard" ? ordered.at(-1) : ordered[0];
  const winning = ordered.filter(
    (card) =>
      card.suit === lead.card.suit &&
      getCardValue(card.rank) > getCardValue(lead.card.rank),
  );
  return winning[0] ?? ordered[0];
}

export const triggerAITurn = internalMutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const game = await gameByPublicId(ctx, args.gameId);
    if (!game || game.mode !== "AI" || game.status !== "PLAYING") return;
    const ai = game.players.find((player) => player.type === "ai");
    if (!ai || game.currentTurnPlayerId !== getPlayerId(ai)) return;
    const card = chooseAiCard(game, ai.aiDifficulty ?? "medium");
    if (!card) return;
    const state = await applyCard(ctx, game, card.id, getPlayerId(ai));
    await ctx.db.patch(game._id, state);
    await scheduleAiIfNeeded(ctx, state);
  },
});

export const concedeGame = mutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const { game, userId } = await requireParticipant(ctx, args.gameId);
    if (game.status !== "PLAYING") throw new ConvexError("GAME_NOT_ACTIVE");
    const winner = game.players.find(
      (player) => getPlayerId(player) !== userId,
    );
    if (!winner) throw new ConvexError("OPPONENT_NOT_FOUND");
    const state = await finishGame(
      ctx,
      game,
      getPlayerId(winner),
      "Abandon",
      "forfeit",
    );
    await ctx.db.patch(game._id, state);
    return { success: true };
  },
});

export const endTechnicalGame = internalMutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const game = await gameByPublicId(ctx, args.gameId);
    if (!game || game.status === "ENDED") return;
    await cleanupQueue(ctx, game.gameId);
    await ctx.db.patch(game._id, {
      status: "ENDED",
      winnerId: null,
      endReason: "Erreur technique",
      victoryType: "technical",
      endedAt: Date.now(),
      currentTurnPlayerId: null,
      lastUpdatedAt: Date.now(),
      version: game.version + 1,
    });
  },
});

export const createTraining = mutation({
  args: { difficulty: aiDifficultyValidator },
  handler: async (ctx, args) => {
    const userId = await requireAuthUserId(ctx);
    return await createStartedGame(ctx, {
      mode: "AI",
      firstUserId: userId,
      difficulty: args.difficulty,
    });
  },
});
