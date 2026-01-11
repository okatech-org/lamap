import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export function useAuth() {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    userId && isLoaded && isSignedIn ? { clerkUserId: userId } : "skip"
  );

  const needsOnboarding =
    convexUser === null ? undefined
    : convexUser !== undefined ? !convexUser.onboardingCompleted
    : undefined;

  const isConvexUserLoaded = !isSignedIn || convexUser !== undefined;

  return {
    userId,
    isLoaded,
    isSignedIn,
    user: convexUser,
    convexUser,
    clerkUser,
    needsOnboarding,
    isConvexUserLoaded,
  };
}
