import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const creditValidatedPurchase = internalMutation({
  args: {
    userId: v.id("users"),
    productId: v.string(),
    transactionId: v.string(),
    originalTransactionId: v.optional(v.string()),
    koraAmount: v.number(),
  },
  handler: async (ctx, args): Promise<number> => {
    const existing = await ctx.db
      .query("iapTransactions")
      .withIndex("by_transaction", (q) =>
        q.eq("platform", "ios").eq("transactionId", args.transactionId),
      )
      .first();
    if (existing && existing.status === "validated") {
      return 0;
    }

    const user = await ctx.db.get(args.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const newBalance = (user.balance ?? 0) + args.koraAmount;
    await ctx.db.patch(args.userId, { balance: newBalance });

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "validated",
        validatedAt: Date.now(),
        koraCredited: args.koraAmount,
      });
    } else {
      await ctx.db.insert("iapTransactions", {
        userId: args.userId,
        platform: "ios",
        productId: args.productId,
        transactionId: args.transactionId,
        originalTransactionId: args.originalTransactionId,
        koraCredited: args.koraAmount,
        status: "validated",
        createdAt: Date.now(),
        validatedAt: Date.now(),
      });
    }

    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "iap",
      amount: args.koraAmount,
      currency: "KORA",
      description: `Achat Kora (${args.productId})`,
      createdAt: Date.now(),
    });

    return args.koraAmount;
  },
});
