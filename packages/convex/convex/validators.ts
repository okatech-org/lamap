import { Infer, v } from "convex/values";

export const gameStatusValidator = v.union(
  v.literal("WAITING"),
  v.literal("PLAYING"),
  v.literal("ENDED"),
);

export const playerTypeValidator = v.union(v.literal("user"), v.literal("ai"));

export const aiDifficultyValidator = v.union(
  v.literal("easy"),
  v.literal("medium"),
  v.literal("hard"),
);

export const gameModeValidator = v.union(v.literal("AI"), v.literal("RANKED"));

export const suitValidator = v.union(
  v.literal("hearts"),
  v.literal("diamonds"),
  v.literal("clubs"),
  v.literal("spades"),
);

export const rankValidator = v.union(
  v.literal("3"),
  v.literal("4"),
  v.literal("5"),
  v.literal("6"),
  v.literal("7"),
  v.literal("8"),
  v.literal("9"),
);

export const victoryTypeValidator = v.union(
  v.literal("normal"),
  v.literal("simple_kora"),
  v.literal("double_kora"),
  v.literal("triple_kora"),
  v.literal("forfeit"),
  v.literal("technical"),
);

export const gameHistoryActionValidator = v.union(
  v.literal("game_created"),
  v.literal("game_started"),
  v.literal("card_played"),
  v.literal("round_won"),
  v.literal("kora_achieved"),
  v.literal("game_ended"),
);

export const cardValidator = v.object({
  id: v.string(),
  suit: suitValidator,
  rank: rankValidator,
  playable: v.boolean(),
});

export const playerValidator = v.object({
  userId: v.union(v.id("users"), v.null()),
  botId: v.optional(v.string()),
  username: v.string(),
  type: playerTypeValidator,
  isConnected: v.boolean(),
  avatarId: v.optional(v.string()),
  cardBackId: v.optional(v.string()),
  hand: v.optional(v.array(cardValidator)),
  aiDifficulty: v.optional(aiDifficultyValidator),
  isThinking: v.optional(v.boolean()),
});

export const playedCardValidator = v.object({
  card: cardValidator,
  playerId: v.union(v.id("users"), v.string()),
  round: v.number(),
  timestamp: v.number(),
});

export const gameHistoryValidator = v.object({
  action: gameHistoryActionValidator,
  timestamp: v.number(),
  playerId: v.optional(v.union(v.id("users"), v.string())),
  data: v.optional(
    v.object({
      cardId: v.optional(v.string()),
      cardSuit: v.optional(suitValidator),
      cardRank: v.optional(rankValidator),
      round: v.optional(v.number()),
      winnerId: v.optional(v.union(v.id("users"), v.string())),
      koraType: v.optional(v.string()),
      message: v.optional(v.string()),
    }),
  ),
});

export type Rank = Infer<typeof rankValidator>;
export type Suit = Infer<typeof suitValidator>;
export type VictoryType = Infer<typeof victoryTypeValidator>;
export type Card = Infer<typeof cardValidator>;
export type Player = Infer<typeof playerValidator>;
export type PlayedCard = Infer<typeof playedCardValidator>;
export type GameHistory = Infer<typeof gameHistoryValidator>;
