import { getAuthSessionId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { requireAuthUserId } from "./authHelpers";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    return await ctx.db.get(userId);
  },
});

export const getPublicUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuthUserId(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user?.username || (user.rankedGames ?? 0) === 0) return null;
    return {
      userId: user._id,
      username: user.username,
      avatarId: user.activeAvatarId ?? "initials",
      points: user.rankingPoints ?? 500,
      rankedGames: user.rankedGames ?? 0,
      rankedWins: user.rankedWins ?? 0,
    };
  },
});

export const getMyStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("USER_NOT_FOUND");
    const rankedGames = user.rankedGames ?? 0;
    const points = user.rankingPoints ?? 500;
    const higherPlayers = (await ctx.db.query("users").collect()).filter(
      (candidate) =>
        (candidate.rankedGames ?? 0) > 0 &&
        (candidate.rankingPoints ?? 500) > points,
    );
    return {
      points,
      position: rankedGames === 0 ? null : higherPlayers.length + 1,
    };
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const currentSessionId = await getAuthSessionId(ctx);
    if (!currentSessionId) throw new ConvexError("RECENT_SESSION_REQUIRED");
    const currentSession = await ctx.db.get(currentSessionId);
    if (
      !currentSession ||
      Date.now() - currentSession._creationTime > 15 * 60 * 1000
    ) {
      throw new ConvexError("RECENT_SESSION_REQUIRED");
    }

    const games = (await ctx.db.query("games").collect()).filter((game) =>
      game.players.some((player) => player.userId === userId),
    );
    for (const game of games) await ctx.db.delete(game._id);

    const queueEntries = await ctx.db
      .query("matchmakingQueue")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const entry of queueEntries) await ctx.db.delete(entry._id);

    const entitlements = await ctx.db
      .query("cosmeticEntitlements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const entitlement of entitlements)
      await ctx.db.delete(entitlement._id);

    const transactions = await ctx.db
      .query("storeTransactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const transaction of transactions) {
      await ctx.db.patch(transaction._id, { userId: undefined });
    }

    const reportsByUser = await ctx.db
      .query("reports")
      .withIndex("by_reporter", (q) => q.eq("reporterId", userId))
      .collect();
    const reportsAboutUser = await ctx.db
      .query("reports")
      .withIndex("by_target", (q) => q.eq("targetUserId", userId))
      .collect();
    for (const report of [...reportsByUser, ...reportsAboutUser]) {
      await ctx.db.delete(report._id);
    }

    const outgoingBlocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
      .collect();
    const incomingBlocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
      .collect();
    for (const block of [...outgoingBlocks, ...incomingBlocks]) {
      await ctx.db.delete(block._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) await ctx.db.delete(code._id);
      await ctx.db.delete(account._id);
    }

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    const sessionIds = new Set(sessions.map((session) => String(session._id)));
    const verifiers = await ctx.db.query("authVerifiers").collect();
    for (const verifier of verifiers) {
      if (verifier.sessionId && sessionIds.has(String(verifier.sessionId))) {
        await ctx.db.delete(verifier._id);
      }
    }
    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of refreshTokens) await ctx.db.delete(token._id);
      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(userId);
    return { success: true };
  },
});
