import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireAuthUserId } from "./authHelpers";
import { query, type QueryCtx } from "./_generated/server";

export const INITIAL_RANKING_POINTS = 500;
export const ELO_K_FACTOR = 32;
export const MIN_RANKING_POINTS = 0;

export type EloResult = {
  winner: { oldPoints: number; newPoints: number; delta: number };
  loser: { oldPoints: number; newPoints: number; delta: number };
};

export function calculateEloResult(
  winnerPoints: number,
  loserPoints: number,
): EloResult {
  const winnerExpected = 1 / (1 + 10 ** ((loserPoints - winnerPoints) / 400));
  const loserExpected = 1 - winnerExpected;
  const winnerNew = Math.max(
    MIN_RANKING_POINTS,
    Math.round(winnerPoints + ELO_K_FACTOR * (1 - winnerExpected)),
  );
  const loserNew = Math.max(
    MIN_RANKING_POINTS,
    Math.round(loserPoints + ELO_K_FACTOR * (0 - loserExpected)),
  );

  return {
    winner: {
      oldPoints: winnerPoints,
      newPoints: winnerNew,
      delta: winnerNew - winnerPoints,
    },
    loser: {
      oldPoints: loserPoints,
      newPoints: loserNew,
      delta: loserNew - loserPoints,
    },
  };
}

export function calculateGameRating(
  mode: "RANKED" | "AI",
  alreadyApplied: boolean,
  winnerPoints: number,
  loserPoints: number,
) {
  if (mode !== "RANKED" || alreadyApplied) return null;
  return calculateEloResult(winnerPoints, loserPoints);
}

async function blockedUserIds(ctx: QueryCtx, userId: Id<"users">) {
  const outgoing = await ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
    .collect();
  const incoming = await ctx.db
    .query("blocks")
    .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
    .collect();
  return new Set([
    ...outgoing.map((block) => String(block.blockedId)),
    ...incoming.map((block) => String(block.blockerId)),
  ]);
}

export const getGlobalLeaderboard = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await requireAuthUserId(ctx);
    const hidden = await blockedUserIds(ctx, currentUserId);
    const users = (await ctx.db.query("users").collect())
      .filter((user) => (user.rankedGames ?? 0) > 0 && user.username)
      .sort(
        (a, b) =>
          (b.rankingPoints ?? INITIAL_RANKING_POINTS) -
            (a.rankingPoints ?? INITIAL_RANKING_POINTS) ||
          a._creationTime - b._creationTime,
      );

    let previousPoints: number | undefined;
    let sharedPosition = 0;
    const ranked = users.map((user, index) => {
      const points = user.rankingPoints ?? INITIAL_RANKING_POINTS;
      if (points !== previousPoints) sharedPosition = index + 1;
      previousPoints = points;
      return {
        userId: user._id,
        username: user.username!,
        avatarId: user.activeAvatarId ?? "initials",
        points,
        position: sharedPosition,
        isCurrentUser: user._id === currentUserId,
      };
    });

    const visible = ranked.filter((entry) => !hidden.has(String(entry.userId)));
    const start = Math.max(0, Number.parseInt(args.cursor ?? "0", 10) || 0);
    const limit = Math.min(100, Math.max(1, args.limit ?? 50));
    const page = visible.slice(start, start + limit);
    return {
      page,
      nextCursor: start + limit < visible.length ? String(start + limit) : null,
      isDone: start + limit >= visible.length,
    };
  },
});

export const getMyPosition = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user || (user.rankedGames ?? 0) === 0) return null;
    const points = user.rankingPoints ?? INITIAL_RANKING_POINTS;
    const higherPlayers = (await ctx.db.query("users").collect()).filter(
      (candidate) =>
        (candidate.rankedGames ?? 0) > 0 &&
        (candidate.rankingPoints ?? INITIAL_RANKING_POINTS) > points,
    );
    return { points, position: higherPlayers.length + 1 };
  },
});
