import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { requireAuthUserId } from "./authHelpers";

const reasonValidator = v.union(
  v.literal("inappropriate_username"),
  v.literal("harassment"),
  v.literal("cheating"),
  v.literal("other"),
);

export const reportUser = mutation({
  args: {
    targetUserId: v.id("users"),
    reason: reasonValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reporterId = await requireAuthUserId(ctx);
    if (reporterId === args.targetUserId)
      throw new ConvexError("CANNOT_REPORT_SELF");
    if (!(await ctx.db.get(args.targetUserId)))
      throw new ConvexError("USER_NOT_FOUND");
    const reportId = await ctx.db.insert("reports", {
      reporterId,
      targetUserId: args.targetUserId,
      reason: args.reason,
      note: args.note?.trim().slice(0, 500) || undefined,
      status: "open",
      createdAt: Date.now(),
    });
    return { reportId };
  },
});

export const blockUser = mutation({
  args: { blockedId: v.id("users") },
  handler: async (ctx, args) => {
    const blockerId = await requireAuthUserId(ctx);
    if (blockerId === args.blockedId)
      throw new ConvexError("CANNOT_BLOCK_SELF");
    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", blockerId).eq("blockedId", args.blockedId),
      )
      .first();
    if (existing) return { blockId: existing._id };
    return {
      blockId: await ctx.db.insert("blocks", {
        blockerId,
        blockedId: args.blockedId,
        createdAt: Date.now(),
      }),
    };
  },
});

export const unblockUser = mutation({
  args: { blockedId: v.id("users") },
  handler: async (ctx, args) => {
    const blockerId = await requireAuthUserId(ctx);
    const block = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) =>
        q.eq("blockerId", blockerId).eq("blockedId", args.blockedId),
      )
      .first();
    if (block) await ctx.db.delete(block._id);
    return { success: true };
  },
});

export const listBlockedUsers = query({
  args: {},
  handler: async (ctx) => {
    const blockerId = await requireAuthUserId(ctx);
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .collect();
    return (
      await Promise.all(
        blocks.map(async (block) => {
          const user = await ctx.db.get(block.blockedId);
          return user?.username
            ? {
                userId: user._id,
                username: user.username,
                avatarId: user.activeAvatarId ?? "initials",
                blockedAt: block.createdAt,
              }
            : null;
        }),
      )
    ).filter((user) => user !== null);
  },
});

export async function getBlockedIdsByUser(ctx: QueryCtx, userId: Id<"users">) {
  const outgoing = await ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
    .collect();
  const incoming = await ctx.db
    .query("blocks")
    .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
    .collect();
  return new Set<Id<"users">>([
    ...outgoing.map((block) => block.blockedId),
    ...incoming.map((block) => block.blockerId),
  ]);
}
