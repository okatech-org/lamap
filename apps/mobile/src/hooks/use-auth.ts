import { useConvexAuth } from "@convex-dev/auth/react";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const convexUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );
  const isConvexUserLoaded = !isAuthenticated || convexUser !== undefined;
  const needsOnboarding =
    convexUser === undefined
      ? undefined
      : convexUser?.onboardingCompleted !== true;

  return {
    userId: convexUser?._id ?? null,
    isLoaded: !isLoading,
    isSignedIn: isAuthenticated,
    isConvexUserLoaded,
    needsOnboarding,
    user: convexUser,
    convexUser,
  };
}
