import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  aiDifficultyValidator,
  gameHistoryValidator,
  gameModeValidator,
  gameStatusValidator,
  playedCardValidator,
  playerValidator,
  victoryTypeValidator,
} from "./validators";

const users = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  username: v.optional(v.string()),
  usernameKey: v.optional(v.string()),
  rankingPoints: v.optional(v.number()),
  rankedGames: v.optional(v.number()),
  rankedWins: v.optional(v.number()),
  activeCardBackId: v.optional(v.string()),
  activeAvatarId: v.optional(v.string()),
  onboardingCompleted: v.optional(v.boolean()),
})
  .index("email", ["email"])
  .index("phone", ["phone"])
  .index("by_username_key", ["usernameKey"])
  .index("by_ranking_points", ["rankingPoints"]);

const ratingPlayerValidator = v.object({
  userId: v.id("users"),
  oldPoints: v.number(),
  newPoints: v.number(),
  delta: v.number(),
});

const games = defineTable({
  gameId: v.string(),
  seed: v.string(),
  version: v.number(),
  status: gameStatusValidator,
  mode: gameModeValidator,
  currentRound: v.number(),
  maxRounds: v.number(),
  hasHandPlayerId: v.union(v.id("users"), v.string(), v.null()),
  currentTurnPlayerId: v.union(v.id("users"), v.string(), v.null()),
  players: v.array(playerValidator),
  playedCards: v.array(playedCardValidator),
  history: v.array(gameHistoryValidator),
  winnerId: v.union(v.id("users"), v.string(), v.null()),
  endReason: v.union(v.string(), v.null()),
  victoryType: v.union(victoryTypeValidator, v.null()),
  aiDifficulty: v.union(aiDifficultyValidator, v.null()),
  hostId: v.id("users"),
  startedAt: v.number(),
  endedAt: v.union(v.number(), v.null()),
  lastUpdatedAt: v.number(),
  ratingResult: v.optional(
    v.object({
      winner: ratingPlayerValidator,
      loser: ratingPlayerValidator,
      appliedAt: v.number(),
    }),
  ),
})
  .index("by_game_id", ["gameId"])
  .index("by_host", ["hostId"])
  .index("by_status", ["status"]);

const matchmakingQueue = defineTable({
  userId: v.id("users"),
  status: v.union(
    v.literal("searching"),
    v.literal("matched"),
    v.literal("cancelled"),
  ),
  matchedWith: v.optional(v.id("users")),
  gameId: v.optional(v.string()),
  joinedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_status", ["status"]);

const cosmeticEntitlements = defineTable({
  userId: v.id("users"),
  cosmeticId: v.string(),
  productId: v.optional(v.string()),
  source: v.union(v.literal("default"), v.literal("app_store")),
  grantedAt: v.number(),
  revokedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_cosmetic", ["userId", "cosmeticId"])
  .index("by_product", ["productId"]);

const storeTransactions = defineTable({
  userId: v.optional(v.id("users")),
  antiFraudKey: v.string(),
  transactionId: v.string(),
  originalTransactionId: v.optional(v.string()),
  productId: v.string(),
  environment: v.union(
    v.literal("Sandbox"),
    v.literal("Production"),
    v.literal("Xcode"),
    v.literal("LocalTesting"),
  ),
  status: v.union(v.literal("verified"), v.literal("revoked")),
  purchaseDate: v.number(),
  signedDate: v.number(),
  revokedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_transaction", ["transactionId"])
  .index("by_original_transaction", ["originalTransactionId"])
  .index("by_user", ["userId"]);

const reports = defineTable({
  reporterId: v.id("users"),
  targetUserId: v.id("users"),
  reason: v.union(
    v.literal("inappropriate_username"),
    v.literal("harassment"),
    v.literal("cheating"),
    v.literal("other"),
  ),
  note: v.optional(v.string()),
  status: v.union(v.literal("open"), v.literal("resolved")),
  createdAt: v.number(),
  resolvedAt: v.optional(v.number()),
})
  .index("by_reporter", ["reporterId"])
  .index("by_target", ["targetUserId"])
  .index("by_status", ["status"]);

const blocks = defineTable({
  blockerId: v.id("users"),
  blockedId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_blocker", ["blockerId"])
  .index("by_blocked", ["blockedId"])
  .index("by_pair", ["blockerId", "blockedId"]);

export default defineSchema({
  ...authTables,
  users,
  games,
  matchmakingQueue,
  cosmeticEntitlements,
  storeTransactions,
  reports,
  blocks,
});
