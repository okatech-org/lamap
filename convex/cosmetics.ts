import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export type CardBackTheme = "red" | "blue" | "gold" | "dark";

export interface CardBackSkin {
  id: string;
  name: string;
  theme: CardBackTheme;
  price: number; // in Kora; 0 = default grant
  rare?: boolean;
  defaultGrant?: true;
}

/**
 * Static catalogue of card-back skins. Adding a new skin = one entry here +
 * one new theme key in `src/components/lamap/card-back-themed.tsx`.
 */
export const CARD_BACK_SKINS: Record<string, CardBackSkin> = {
  bandi_classic: {
    id: "bandi_classic",
    name: "Bandi Classique",
    theme: "red",
    price: 0,
    defaultGrant: true,
  },
  bleu_royal: {
    id: "bleu_royal",
    name: "Bleu Royal",
    theme: "blue",
    price: 500,
  },
  or_sable: {
    id: "or_sable",
    name: "Or Sable",
    theme: "gold",
    price: 850,
    rare: true,
  },
  ombre_tribale: {
    id: "ombre_tribale",
    name: "Ombre Tribale",
    theme: "dark",
    price: 1200,
    rare: true,
  },
};

const DEFAULT_GRANTS: string[] = Object.values(CARD_BACK_SKINS)
  .filter((s) => s.defaultGrant)
  .map((s) => s.id);

/**
 * List card-backs for a given user, with `owned` and `active` flags. Lazily
 * grants the default skins (and equips the first one) on the user's first
 * read, so existing accounts get the free starter set without a migration.
 */
export const listCardBacks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    const owned = new Set(user?.ownedCardBacks ?? []);
    DEFAULT_GRANTS.forEach((id) => owned.add(id));
    const active = user?.activeCardBack ?? DEFAULT_GRANTS[0] ?? null;

    return Object.values(CARD_BACK_SKINS).map((skin) => ({
      ...skin,
      owned: owned.has(skin.id),
      active: active === skin.id,
    }));
  },
});

/**
 * Default-grant + active-equip seeding. Idempotent — safe to call from any
 * client read path. Returns the active card-back id.
 */
export const ensureDefaults = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Utilisateur introuvable");
    if (user.cosmeticsGrantedDefaults) {
      return { activeCardBack: user.activeCardBack ?? DEFAULT_GRANTS[0] };
    }
    const owned = new Set(user.ownedCardBacks ?? []);
    DEFAULT_GRANTS.forEach((id) => owned.add(id));
    const active = user.activeCardBack ?? DEFAULT_GRANTS[0];
    await ctx.db.patch(userId, {
      ownedCardBacks: Array.from(owned),
      activeCardBack: active,
      cosmeticsGrantedDefaults: true,
    });
    return { activeCardBack: active };
  },
});

export const purchaseCardBack = mutation({
  args: { userId: v.id("users"), cardBackId: v.string() },
  handler: async (ctx, { userId, cardBackId }) => {
    const skin = CARD_BACK_SKINS[cardBackId];
    if (!skin) throw new Error("Skin introuvable");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Utilisateur introuvable");

    const owned = new Set(user.ownedCardBacks ?? []);
    DEFAULT_GRANTS.forEach((id) => owned.add(id));
    if (owned.has(cardBackId)) {
      throw new Error("Skin déjà acquis");
    }

    const balance = user.balance ?? 0;
    if (balance < skin.price) {
      throw new Error("Solde insuffisant");
    }

    owned.add(cardBackId);
    await ctx.db.patch(userId, {
      balance: balance - skin.price,
      ownedCardBacks: Array.from(owned),
      // Equip the new skin immediately for a one-tap UX.
      activeCardBack: cardBackId,
      cosmeticsGrantedDefaults: true,
    });
    await ctx.db.insert("transactions", {
      userId,
      type: "shop_purchase",
      amount: -skin.price,
      currency: user.currency ?? "XAF",
      description: `Achat — ${skin.name}`,
      createdAt: Date.now(),
    });

    return { activeCardBack: cardBackId, balance: balance - skin.price };
  },
});

export const setActiveCardBack = mutation({
  args: { userId: v.id("users"), cardBackId: v.string() },
  handler: async (ctx, { userId, cardBackId }) => {
    const skin = CARD_BACK_SKINS[cardBackId];
    if (!skin) throw new Error("Skin introuvable");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Utilisateur introuvable");

    const owned = new Set(user.ownedCardBacks ?? []);
    DEFAULT_GRANTS.forEach((id) => owned.add(id));
    if (!owned.has(cardBackId)) {
      throw new Error("Skin non possédé");
    }

    await ctx.db.patch(userId, {
      activeCardBack: cardBackId,
      ownedCardBacks: Array.from(owned),
      cosmeticsGrantedDefaults: true,
    });
    return { activeCardBack: cardBackId };
  },
});
