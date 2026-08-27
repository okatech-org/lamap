import { ConvexError, v } from "convex/values";
import { requireAuthUserId } from "./authHelpers";
import { mutation, query } from "./_generated/server";

export const COSMETICS = [
  {
    id: "bandi_classic",
    type: "card_back",
    name: "Bandi Classique",
    productId: null,
  },
  {
    id: "bleu_royal",
    type: "card_back",
    name: "Dos Bleu Royal",
    productId: "com.okatech.lamap.cosmetic.cardback.bleu_royal",
  },
  {
    id: "or_sable",
    type: "card_back",
    name: "Dos Or Sable",
    productId: "com.okatech.lamap.cosmetic.cardback.or_sable",
  },
  {
    id: "ombre_tribale",
    type: "card_back",
    name: "Dos Ombre Tribale",
    productId: "com.okatech.lamap.cosmetic.cardback.ombre_tribale",
  },
  { id: "initials", type: "avatar", name: "Initiales", productId: null },
  {
    id: "la_stratege",
    type: "avatar",
    name: "La Stratège",
    productId: "com.okatech.lamap.cosmetic.avatar.la_stratege",
  },
  {
    id: "le_bandi",
    type: "avatar",
    name: "Le Bandi",
    productId: "com.okatech.lamap.cosmetic.avatar.le_bandi",
  },
  {
    id: "la_gardienne",
    type: "avatar",
    name: "La Gardienne",
    productId: "com.okatech.lamap.cosmetic.avatar.la_gardienne",
  },
  {
    id: "le_tacticien",
    type: "avatar",
    name: "Le Tacticien",
    productId: "com.okatech.lamap.cosmetic.avatar.le_tacticien",
  },
  {
    id: "maitresse_cartes",
    type: "avatar",
    name: "La Maîtresse des cartes",
    productId: "com.okatech.lamap.cosmetic.avatar.maitresse_cartes",
  },
  {
    id: "la_legende",
    type: "avatar",
    name: "La Légende",
    productId: "com.okatech.lamap.cosmetic.avatar.la_legende",
  },
] as const;

export const PAID_PRODUCT_IDS: ReadonlySet<string> = new Set(
  COSMETICS.flatMap((item) => (item.productId ? [item.productId] : [])),
);

export function cosmeticForProduct(productId: string) {
  return COSMETICS.find((item) => item.productId === productId);
}

export const listCatalog = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    const entitlements = await ctx.db
      .query("cosmeticEntitlements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const owned = new Set(
      entitlements
        .filter((entitlement) => entitlement.revokedAt === undefined)
        .map((entitlement) => entitlement.cosmeticId),
    );
    owned.add("bandi_classic");
    owned.add("initials");
    return COSMETICS.map((item) => ({
      ...item,
      owned: owned.has(item.id),
      active:
        item.type === "card_back"
          ? (user?.activeCardBackId ?? "bandi_classic") === item.id
          : (user?.activeAvatarId ?? "initials") === item.id,
    }));
  },
});

export const equip = mutation({
  args: { cosmeticId: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthUserId(ctx);
    const cosmetic = COSMETICS.find((item) => item.id === args.cosmeticId);
    if (!cosmetic) throw new ConvexError("COSMETIC_NOT_FOUND");
    if (cosmetic.productId) {
      const entitlement = await ctx.db
        .query("cosmeticEntitlements")
        .withIndex("by_user_cosmetic", (q) =>
          q.eq("userId", userId).eq("cosmeticId", cosmetic.id),
        )
        .first();
      if (!entitlement || entitlement.revokedAt !== undefined) {
        throw new ConvexError("COSMETIC_NOT_OWNED");
      }
    }
    if (cosmetic.type === "card_back") {
      await ctx.db.patch(userId, { activeCardBackId: cosmetic.id });
    } else {
      await ctx.db.patch(userId, { activeAvatarId: cosmetic.id });
    }
    return { success: true };
  },
});
