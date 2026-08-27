import { ConvexError } from "convex/values";
import { requireAuthUserId } from "./authHelpers";
import { mutation, query } from "./_generated/server";
import { createStartedGame } from "./games";
import { getBlockedIdsByUser } from "./moderation";

export const joinQueue = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user?.onboardingCompleted || !user.username) {
      throw new ConvexError("ONBOARDING_REQUIRED");
    }

    const myEntries = await ctx.db
      .query("matchmakingQueue")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const active = myEntries.find(
      (entry) => entry.status === "searching" || entry.status === "matched",
    );
    if (active) {
      return {
        matched: active.status === "matched",
        gameId: active.gameId ?? null,
      };
    }
    for (const entry of myEntries) await ctx.db.delete(entry._id);

    const blocked = await getBlockedIdsByUser(ctx, userId);
    const waiting = await ctx.db
      .query("matchmakingQueue")
      .withIndex("by_status", (q) => q.eq("status", "searching"))
      .collect();
    const candidates = [];
    for (const entry of waiting) {
      if (entry.userId === userId || blocked.has(entry.userId)) continue;
      const candidate = await ctx.db.get(entry.userId);
      if (candidate?.onboardingCompleted) {
        candidates.push({ entry, candidate });
      }
    }
    candidates.sort(
      (a, b) =>
        Math.abs(
          (a.candidate.rankingPoints ?? 500) - (user.rankingPoints ?? 500),
        ) -
        Math.abs(
          (b.candidate.rankingPoints ?? 500) - (user.rankingPoints ?? 500),
        ),
    );

    const now = Date.now();
    const queueId = await ctx.db.insert("matchmakingQueue", {
      userId,
      status: "searching",
      joinedAt: now,
    });
    const match = candidates[0];
    if (!match) return { matched: false, gameId: null };

    const { gameId } = await createStartedGame(ctx, {
      mode: "RANKED",
      firstUserId: userId,
      secondUserId: match.entry.userId,
    });
    await ctx.db.patch(queueId, {
      status: "matched",
      matchedWith: match.entry.userId,
      gameId,
    });
    await ctx.db.patch(match.entry._id, {
      status: "matched",
      matchedWith: userId,
      gameId,
    });
    return { matched: true, gameId };
  },
});

export const leaveQueue = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const entries = await ctx.db
      .query("matchmakingQueue")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const entry of entries) {
      if (entry.status === "searching") await ctx.db.delete(entry._id);
    }
    return { success: true };
  },
});

export const getMyStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const entries = await ctx.db
      .query("matchmakingQueue")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const entry = entries
      .filter((item) => item.status !== "cancelled")
      .sort((a, b) => b.joinedAt - a.joinedAt)[0];
    if (!entry) return { status: "idle" as const };
    if (entry.status === "searching") {
      return { status: "searching" as const, joinedAt: entry.joinedAt };
    }
    const opponent = entry.matchedWith
      ? await ctx.db.get(entry.matchedWith)
      : null;
    return {
      status: "matched" as const,
      joinedAt: entry.joinedAt,
      gameId: entry.gameId,
      opponent: opponent?.username
        ? {
            userId: opponent._id,
            username: opponent.username,
            avatarId: opponent.activeAvatarId ?? "initials",
            points: opponent.rankingPoints ?? 500,
          }
        : null,
    };
  },
});
