import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const reasonValidator = v.union(
  v.literal("spam"),
  v.literal("harassment"),
  v.literal("sexual"),
  v.literal("other")
);

const targetTypeValidator = v.union(
  v.literal("message"),
  v.literal("user")
);

export const reportContent = mutation({
  args: {
    reporterId: v.id("users"),
    targetType: targetTypeValidator,
    targetId: v.string(),
    reason: reasonValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reporter = await ctx.db.get(args.reporterId);
    if (!reporter) {
      throw new Error("Reporter not found");
    }

    const reportId = await ctx.db.insert("reports", {
      reporterId: args.reporterId,
      targetType: args.targetType,
      targetId: args.targetId,
      reason: args.reason,
      note: args.note,
      status: "open",
      createdAt: Date.now(),
    });

    return { success: true, reportId };
  },
});

export const blockUser = mutation({
  args: {
    blockerId: v.id("users"),
    blockedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (args.blockerId === args.blockedId) {
      throw new Error("Cannot block yourself");
    }

    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", args.blockerId).eq("blockedId", args.blockedId)
      )
      .first();

    if (existing) {
      return { success: true, blockId: existing._id, alreadyBlocked: true };
    }

    const blockId = await ctx.db.insert("blocks", {
      blockerId: args.blockerId,
      blockedId: args.blockedId,
      createdAt: Date.now(),
    });

    return { success: true, blockId, alreadyBlocked: false };
  },
});

export const unblockUser = mutation({
  args: {
    blockerId: v.id("users"),
    blockedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", args.blockerId).eq("blockedId", args.blockedId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { success: true };
  },
});

export const listBlockedUsers = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", args.userId))
      .collect();

    const users = await Promise.all(
      blocks.map(async (block) => {
        const user = await ctx.db.get(block.blockedId);
        if (!user) return null;
        return {
          _id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          blockedAt: block.createdAt,
        };
      })
    );

    return users.filter((u): u is NonNullable<typeof u> => u !== null);
  },
});

export const isBlocked = query({
  args: {
    userA: v.id("users"),
    userB: v.id("users"),
  },
  handler: async (ctx, args) => {
    const aBlockedB = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", args.userA).eq("blockedId", args.userB)
      )
      .first();

    const bBlockedA = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", args.userB).eq("blockedId", args.userA)
      )
      .first();

    return {
      aBlockedB: !!aBlockedB,
      bBlockedA: !!bBlockedA,
      anyBlock: !!aBlockedB || !!bBlockedA,
    };
  },
});

export async function getBlockedIdsByUser(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<Set<string>> {
  const outgoing = await ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
    .collect();
  const incoming = await ctx.db
    .query("blocks")
    .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
    .collect();

  const ids = new Set<string>();
  for (const b of outgoing) ids.add(b.blockedId);
  for (const b of incoming) ids.add(b.blockerId);
  return ids;
}
