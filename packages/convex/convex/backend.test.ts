/// <reference types="vite/client" />

import { convexTest, type TestConvex } from "convex-test";
import { describe, expect, test } from "vitest";
import type { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob([
  "./_generated/*.js",
  "./authHelpers.ts",
  "./cosmetics.ts",
  "./gameEngine.ts",
  "./games.ts",
  "./iapMutations.ts",
  "./matchmaking.ts",
  "./moderation.ts",
  "./onboarding.ts",
  "./ranking.ts",
  "./users.ts",
  "./validators.ts",
]);

type LamapTest = TestConvex<typeof schema>;

async function seedUser(t: LamapTest, username: string) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username,
      usernameKey: username.toLocaleLowerCase("fr-FR"),
      rankingPoints: 500,
      rankedGames: 0,
      rankedWins: 0,
      activeCardBackId: "bandi_classic",
      activeAvatarId: "initials",
      onboardingCompleted: true,
    });
  });
}

function asUser(t: LamapTest, userId: Id<"users">) {
  return t.withIdentity({ subject: userId });
}

describe("sécurité backend", () => {
  test("une fonction personnelle rejette une requête sans session", async () => {
    const t = convexTest(schema, modules);
    await expect(t.query(api.users.getCurrentUser, {})).rejects.toThrow(
      "AUTH_REQUIRED",
    );
    await expect(t.mutation(api.matchmaking.joinQueue, {})).rejects.toThrow(
      "AUTH_REQUIRED",
    );
  });

  test("un troisième joueur ne peut ni lire ni jouer une partie", async () => {
    const t = convexTest(schema, modules);
    const firstId = await seedUser(t, "Biyick");
    const secondId = await seedUser(t, "Ndolo");
    const outsiderId = await seedUser(t, "Muna");
    await asUser(t, firstId).mutation(api.matchmaking.joinQueue, {});
    const match = await asUser(t, secondId).mutation(
      api.matchmaking.joinQueue,
      {},
    );
    expect(match.gameId).toBeTruthy();

    await expect(
      asUser(t, outsiderId).query(api.games.getGame, { gameId: match.gameId! }),
    ).rejects.toThrow("GAME_ACCESS_DENIED");
    await expect(
      asUser(t, outsiderId).mutation(api.games.playCard, {
        gameId: match.gameId!,
        cardId: "carte-usurpée",
      }),
    ).rejects.toThrow("GAME_ACCESS_DENIED");
  });
});

describe("matchmaking et classement", () => {
  test("les égalités partagent une position mondiale stable malgré les blocages", async () => {
    const t = convexTest(schema, modules);
    const firstId = await seedUser(t, "Song");
    const secondId = await seedUser(t, "Milla");
    const thirdId = await seedUser(t, "Eto");
    await t.run(async (ctx) => {
      await ctx.db.patch(firstId, { rankingPoints: 600, rankedGames: 1 });
      await ctx.db.patch(secondId, { rankingPoints: 600, rankedGames: 1 });
      await ctx.db.patch(thirdId, { rankingPoints: 500, rankedGames: 1 });
      await ctx.db.insert("blocks", {
        blockerId: thirdId,
        blockedId: firstId,
        createdAt: Date.now(),
      });
    });

    const leaderboard = await asUser(t, thirdId).query(
      api.ranking.getGlobalLeaderboard,
      {},
    );
    expect(
      leaderboard.page.map(({ username, position }) => [username, position]),
    ).toEqual([
      ["Milla", 1],
      ["Eto", 3],
    ]);
    await expect(
      asUser(t, thirdId).query(api.ranking.getMyPosition, {}),
    ).resolves.toEqual({ points: 500, position: 3 });
    await expect(
      asUser(t, thirdId).query(api.users.getMyStats, {}),
    ).resolves.toEqual({ points: 500, position: 3 });
  });

  test("rejoindre plusieurs fois ne crée qu’une entrée de file", async () => {
    const t = convexTest(schema, modules);
    const userId = await seedUser(t, "Etame");
    const user = asUser(t, userId);
    await user.mutation(api.matchmaking.joinQueue, {});
    await user.mutation(api.matchmaking.joinQueue, {});

    const entries = await t.run(async (ctx) => {
      return await ctx.db
        .query("matchmakingQueue")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.status).toBe("searching");
  });

  test("un abandon classé applique le résultat une seule fois", async () => {
    const t = convexTest(schema, modules);
    const firstId = await seedUser(t, "Abanda");
    const secondId = await seedUser(t, "Essomba");
    await asUser(t, firstId).mutation(api.matchmaking.joinQueue, {});
    const match = await asUser(t, secondId).mutation(
      api.matchmaking.joinQueue,
      {},
    );

    await asUser(t, firstId).mutation(api.games.concedeGame, {
      gameId: match.gameId!,
    });
    await expect(
      asUser(t, firstId).mutation(api.games.concedeGame, {
        gameId: match.gameId!,
      }),
    ).rejects.toThrow("GAME_NOT_ACTIVE");

    const [first, second, game] = await t.run(async (ctx) => [
      await ctx.db.get(firstId),
      await ctx.db.get(secondId),
      await ctx.db
        .query("games")
        .withIndex("by_game_id", (q) => q.eq("gameId", match.gameId!))
        .unique(),
    ]);
    expect(first).toMatchObject({
      rankingPoints: 484,
      rankedGames: 1,
      rankedWins: 0,
    });
    expect(second).toMatchObject({
      rankingPoints: 516,
      rankedGames: 1,
      rankedWins: 1,
    });
    expect(game?.ratingResult?.appliedAt).toEqual(expect.any(Number));
  });

  test("l’entraînement ne change jamais les points", async () => {
    const t = convexTest(schema, modules);
    const userId = await seedUser(t, "Mballa");
    const user = asUser(t, userId);
    const { gameId } = await user.mutation(api.games.createTraining, {
      difficulty: "easy",
    });
    await user.mutation(api.games.concedeGame, { gameId });
    const account = await t.run(async (ctx) => await ctx.db.get(userId));
    expect(account).toMatchObject({
      rankingPoints: 500,
      rankedGames: 0,
      rankedWins: 0,
    });
  });
});

describe("transactions StoreKit", () => {
  test("une transaction est idempotente et ne peut pas changer de compte", async () => {
    const t = convexTest(schema, modules);
    const ownerId = await seedUser(t, "Owono");
    const otherId = await seedUser(t, "Foe");
    const transaction = {
      transactionId: "200000000000001",
      originalTransactionId: "200000000000001",
      productId: "com.okatech.lamap.cosmetic.avatar.la_stratege",
      environment: "Sandbox" as const,
      purchaseDate: 1_700_000_000_000,
      signedDate: 1_700_000_000_100,
    };

    const first = await t.mutation(internal.iapMutations.applyTransaction, {
      ...transaction,
      userId: ownerId,
    });
    const replay = await t.mutation(internal.iapMutations.applyTransaction, {
      ...transaction,
      userId: ownerId,
    });
    expect(first).toMatchObject({ granted: true, revoked: false });
    expect(replay).toMatchObject({ granted: false, revoked: false });

    await expect(
      t.mutation(internal.iapMutations.applyTransaction, {
        ...transaction,
        userId: otherId,
      }),
    ).rejects.toThrow("TRANSACTION_ALREADY_LINKED");

    const counts = await t.run(async (ctx) => ({
      transactions: (await ctx.db.query("storeTransactions").collect()).length,
      entitlements: (await ctx.db.query("cosmeticEntitlements").collect())
        .length,
    }));
    expect(counts).toEqual({ transactions: 1, entitlements: 1 });
  });
});
