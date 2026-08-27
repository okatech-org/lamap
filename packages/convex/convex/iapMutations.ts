import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { cosmeticForProduct } from "./cosmetics";

const environmentValidator = v.union(
  v.literal("Sandbox"),
  v.literal("Production"),
  v.literal("Xcode"),
  v.literal("LocalTesting"),
);

export const applyTransaction = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    transactionId: v.string(),
    originalTransactionId: v.optional(v.string()),
    productId: v.string(),
    environment: environmentValidator,
    purchaseDate: v.number(),
    signedDate: v.number(),
    revocationDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cosmetic = cosmeticForProduct(args.productId);
    if (!cosmetic) throw new ConvexError("COSMETIC_PRODUCT_UNKNOWN");

    const byTransaction = await ctx.db
      .query("storeTransactions")
      .withIndex("by_transaction", (q) =>
        q.eq("transactionId", args.transactionId),
      )
      .first();
    const byOriginal = args.originalTransactionId
      ? await ctx.db
          .query("storeTransactions")
          .withIndex("by_original_transaction", (q) =>
            q.eq("originalTransactionId", args.originalTransactionId),
          )
          .first()
      : null;
    const existing = byTransaction ?? byOriginal;
    if (existing && existing.productId !== args.productId) {
      throw new ConvexError("TRANSACTION_PRODUCT_MISMATCH");
    }
    if (existing?.userId && args.userId && existing.userId !== args.userId) {
      throw new ConvexError("TRANSACTION_ALREADY_LINKED");
    }
    const ownerId = args.userId ?? existing?.userId;
    const now = Date.now();
    const status = args.revocationDate ? "revoked" : "verified";

    if (existing) {
      await ctx.db.patch(existing._id, {
        userId: ownerId,
        status,
        signedDate: args.signedDate,
        revokedAt: args.revocationDate,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("storeTransactions", {
        userId: ownerId,
        antiFraudKey: crypto.randomUUID(),
        transactionId: args.transactionId,
        originalTransactionId: args.originalTransactionId,
        productId: args.productId,
        environment: args.environment,
        status,
        purchaseDate: args.purchaseDate,
        signedDate: args.signedDate,
        revokedAt: args.revocationDate,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!ownerId)
      return { granted: false, revoked: Boolean(args.revocationDate) };
    const entitlement = await ctx.db
      .query("cosmeticEntitlements")
      .withIndex("by_user_cosmetic", (q) =>
        q.eq("userId", ownerId).eq("cosmeticId", cosmetic.id),
      )
      .first();
    if (args.revocationDate) {
      if (entitlement)
        await ctx.db.patch(entitlement._id, { revokedAt: args.revocationDate });
      const user = await ctx.db.get(ownerId);
      if (user?.activeAvatarId === cosmetic.id) {
        await ctx.db.patch(ownerId, { activeAvatarId: "initials" });
      }
      if (user?.activeCardBackId === cosmetic.id) {
        await ctx.db.patch(ownerId, { activeCardBackId: "bandi_classic" });
      }
      return { granted: false, revoked: true };
    }
    if (entitlement) {
      await ctx.db.patch(entitlement._id, {
        productId: args.productId,
        source: "app_store",
        revokedAt: undefined,
      });
      return { granted: false, revoked: false, cosmeticId: cosmetic.id };
    }
    await ctx.db.insert("cosmeticEntitlements", {
      userId: ownerId,
      cosmeticId: cosmetic.id,
      productId: args.productId,
      source: "app_store",
      grantedAt: now,
    });
    return { granted: true, revoked: false, cosmeticId: cosmetic.id };
  },
});
