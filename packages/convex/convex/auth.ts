import { convexAuth } from "@convex-dev/auth/server";
import Apple from "@auth/core/providers/apple";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Apple({
      profile: (appleInfo) => ({
        id: appleInfo.sub,
        name: appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined,
        email: appleInfo.email,
      }),
    }),
    Google,
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      if (!redirectTo.startsWith("lamap://")) {
        throw new Error("Adresse de retour OAuth non autorisée");
      }
      return redirectTo;
    },
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!user) return;
      await ctx.db.patch(userId, {
        rankingPoints: user.rankingPoints ?? 500,
        rankedGames: user.rankedGames ?? 0,
        rankedWins: user.rankedWins ?? 0,
        activeCardBackId: user.activeCardBackId ?? "bandi_classic",
        activeAvatarId: user.activeAvatarId ?? "initials",
        onboardingCompleted: user.onboardingCompleted ?? false,
      });
    },
  },
});
