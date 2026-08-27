import { ConvexError, v } from "convex/values";
import { containsBadWord } from "./badWords";
import { requireAuthUserId } from "./authHelpers";
import { mutation, query } from "./_generated/server";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;

export function normalizeUsername(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

export function usernameKey(value: string) {
  return normalizeUsername(value).toLocaleLowerCase("fr-FR");
}

function validateUsername(value: string) {
  const normalized = normalizeUsername(value);
  if (normalized.length < USERNAME_MIN || normalized.length > USERNAME_MAX) {
    throw new ConvexError("USERNAME_LENGTH");
  }
  if (!/^[\p{L}\p{N}_ -]+$/u.test(normalized)) {
    throw new ConvexError("USERNAME_CHARACTERS");
  }
  if (containsBadWord(normalized)) {
    throw new ConvexError("USERNAME_INAPPROPRIATE");
  }
  return normalized;
}

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const currentUserId = await requireAuthUserId(ctx);
    try {
      const normalized = validateUsername(args.username);
      const existing = await ctx.db
        .query("users")
        .withIndex("by_username_key", (q) =>
          q.eq("usernameKey", usernameKey(normalized)),
        )
        .first();
      return {
        available: !existing || existing._id === currentUserId,
        normalized,
      };
    } catch (error) {
      return {
        available: false,
        normalized: normalizeUsername(args.username),
        reason: error instanceof Error ? error.message : "USERNAME_INVALID",
      };
    }
  },
});

export const finalizeUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthUserId(ctx);
    const normalized = validateUsername(args.username);
    const key = usernameKey(normalized);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username_key", (q) => q.eq("usernameKey", key))
      .first();
    if (existing && existing._id !== userId)
      throw new ConvexError("USERNAME_TAKEN");

    await ctx.db.patch(userId, {
      username: normalized,
      usernameKey: key,
      rankingPoints: INITIAL_POINTS,
      rankedGames: 0,
      rankedWins: 0,
      activeCardBackId: "bandi_classic",
      activeAvatarId: "initials",
      onboardingCompleted: true,
    });

    for (const cosmeticId of ["bandi_classic", "initials"]) {
      const entitlement = await ctx.db
        .query("cosmeticEntitlements")
        .withIndex("by_user_cosmetic", (q) =>
          q.eq("userId", userId).eq("cosmeticId", cosmeticId),
        )
        .first();
      if (!entitlement) {
        await ctx.db.insert("cosmeticEntitlements", {
          userId,
          cosmeticId,
          source: "default",
          grantedAt: Date.now(),
        });
      }
    }
    return { username: normalized };
  },
});

const INITIAL_POINTS = 500;

export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthUserId(ctx);
    const user = await ctx.db.get(userId);
    return { completed: user?.onboardingCompleted === true };
  },
});
