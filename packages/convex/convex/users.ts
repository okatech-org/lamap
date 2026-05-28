import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const updateOrCreateUser = internalMutation({
  args: {
    clerkUser: v.any(),
  },
  handler: async (ctx, args) => {
    const { clerkUser } = args;

    const firstName = clerkUser.first_name || "";
    const lastName = clerkUser.last_name || "";

    const primaryEmail = clerkUser.email_addresses?.find?.(
      (email: any) => email.id === clerkUser.primary_email_address_id
    );
    const email =
      primaryEmail?.email_address ||
      clerkUser.email_addresses?.[0]?.email_address ||
      "";

    const avatarUrl =
      clerkUser.profile_image_url || clerkUser.image_url || null;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUser.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: clerkUser.username,
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      return existing._id;
    } else {
      const newUserId = await ctx.db.insert("users", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        bio: "",
        avatarUrl: avatarUrl || undefined,
        createdAt: Date.now(),
        isActive: true,
        username: clerkUser.username ?? email.split("@")[0],
        clerkUserId: clerkUser.id,
        metadata: { onboardingCompleted: false },
      });
      return newUserId;
    }
  },
});

export const deleteUser = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    } else {
      console.log(`User not found for deletion: ${args.clerkUserId}`);
    }
  },
});

const getUserQuery = {
  args: {
    clerkUserId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.string(),
      bio: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      createdAt: v.number(),
      isActive: v.boolean(),
      username: v.string(),
      clerkUserId: v.string(),
      balance: v.optional(v.number()),
      currency: v.optional(v.string()),
      country: v.optional(v.string()),
      metadata: v.optional(
        v.object({
          onboardingCompleted: v.optional(v.boolean()),
        }),
      ),

      pr: v.optional(v.number()),
      kora: v.optional(v.number()),
      rankHistory: v.optional(v.array(v.string())),
      ownedCardBacks: v.optional(v.array(v.string())),
      activeCardBack: v.optional(v.string()),
      cosmeticsGrantedDefaults: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx: QueryCtx, args: { clerkUserId: string }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
};

export const getUser = internalQuery(getUserQuery);
export const getCurrentUser = query(getUserQuery);

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      _id: user._id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      pr: user.pr,
      kora: user.kora,
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
  },
});

export const getPublicUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      createdAt: v.number(),
      isActive: v.boolean(),
      country: v.optional(v.string()),
      pr: v.optional(v.number()),
      rankHistory: v.optional(v.array(v.string())),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.metadata?.onboardingCompleted) return null;

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      isActive: user.isActive,
      country: user.country,
      pr: user.pr,
      rankHistory: user.rankHistory,
    };
  },
});

export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        username: args.username,
        email: args.email,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      firstName: "",
      lastName: "",
      email: args.email || "",
      bio: "",
      avatarUrl: undefined,
      createdAt: Date.now(),
      isActive: true,
      username: args.username,
      clerkUserId: args.clerkId,
      balance: 1000,
      currency: "XAF",
      metadata: { onboardingCompleted: false },
    });
  },
});

export const updateBalance = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const currentBalance = user.balance || 0;
    const newBalance = currentBalance + args.amount;

    if (newBalance < 0) {
      throw new Error("Insufficient balance");
    }

    await ctx.db.patch(args.userId, {
      balance: newBalance,
    });
  },
});

export const updateCurrency = internalMutation({
  args: {
    userId: v.id("users"),
    currency: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      currency: args.currency,
    });
  },
});

export const getUserBalance = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.object({
    balance: v.number(),
    currency: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      balance: user.balance || 0,
      currency: user.currency || "XAF",
    };
  },
});

export const getUserStats = query({
  args: {
    clerkUserId: v.string(),
  },
  returns: v.object({
    wins: v.number(),
    losses: v.number(),
    totalGames: v.number(),
    winRate: v.number(),
    currentStreak: v.number(),
    bestStreak: v.number(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) {
      return {
        wins: 0,
        losses: 0,
        totalGames: 0,
        winRate: 0,
        currentStreak: 0,
        bestStreak: 0,
      };
    }

    const allEndedGames = await ctx.db
      .query("games")
      .withIndex("by_status", (q) => q.eq("status", "ENDED"))
      .collect();

    const games = allEndedGames.filter((game) =>
      game.players.some((p) => p.userId === user._id)
    );

    const sortedGames = games.sort(
      (a, b) => (a.endedAt || 0) - (b.endedAt || 0)
    );

    let wins = 0;
    let losses = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (const game of sortedGames) {
      const isWinner = game.winnerId === user._id;

      if (isWinner) {
        wins++;
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        losses++;
        tempStreak = 0;
      }
    }

    const recentGames = sortedGames.slice(-10);
    for (let i = recentGames.length - 1; i >= 0; i--) {
      const game = recentGames[i];
      if (game.winnerId === user._id) {
        currentStreak++;
      } else {
        break;
      }
    }

    const totalGames = wins + losses;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    return {
      wins,
      losses,
      totalGames,
      winRate: Math.round(winRate * 10) / 10,
      currentStreak,
      bestStreak,
    };
  },
});

export const deleteAccount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return { success: true };

    // Transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const tx of transactions) await ctx.db.delete(tx._id);

    // PR history
    const prHistory = await ctx.db
      .query("prHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const row of prHistory) await ctx.db.delete(row._id);

    // IAP transactions (kept for audit, but unlink user)
    const iap = await ctx.db
      .query("iapTransactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const row of iap) await ctx.db.delete(row._id);

    // Matchmaking queue entries
    const queue = await ctx.db
      .query("matchmakingQueue")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const row of queue) await ctx.db.delete(row._id);

    // Friendships
    const friendships1 = await ctx.db
      .query("friendships")
      .withIndex("by_user1", (q) => q.eq("user1Id", userId))
      .collect();
    const friendships2 = await ctx.db
      .query("friendships")
      .withIndex("by_user2", (q) => q.eq("user2Id", userId))
      .collect();
    for (const row of [...friendships1, ...friendships2]) {
      await ctx.db.delete(row._id);
    }

    // Friend requests (sender or receiver)
    const requestsSent = await ctx.db
      .query("friendRequests")
      .withIndex("by_sender", (q) => q.eq("senderId", userId))
      .collect();
    const requestsReceived = await ctx.db
      .query("friendRequests")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .collect();
    for (const row of [...requestsSent, ...requestsReceived]) {
      await ctx.db.delete(row._id);
    }

    // Challenges (challenger or challenged)
    const challengesSent = await ctx.db
      .query("challenges")
      .withIndex("by_challenger", (q) => q.eq("challengerId", userId))
      .collect();
    const challengesReceived = await ctx.db
      .query("challenges")
      .withIndex("by_challenged", (q) => q.eq("challengedId", userId))
      .collect();
    for (const row of [...challengesSent, ...challengesReceived]) {
      await ctx.db.delete(row._id);
    }

    // Conversations + messages
    const conversations = await ctx.db.query("conversations").collect();
    for (const conv of conversations) {
      if (conv.participants.includes(userId)) {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();
        for (const m of messages) await ctx.db.delete(m._id);
        await ctx.db.delete(conv._id);
      }
    }

    // Pending or in-progress games where this user is host — delete.
    // Finished games are kept for leaderboard integrity (anonymized via the
    // user document removal).
    const hostedGames = await ctx.db
      .query("games")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();
    for (const game of hostedGames) {
      if (game.status !== "ENDED") {
        const messages = await ctx.db
          .query("gameMessages")
          .withIndex("by_game_id", (q) => q.eq("gameId", game.gameId))
          .collect();
        for (const m of messages) await ctx.db.delete(m._id);
        await ctx.db.delete(game._id);
      }
    }

    // Finally, the user document itself.
    await ctx.db.delete(userId);

    return { success: true };
  },
});
