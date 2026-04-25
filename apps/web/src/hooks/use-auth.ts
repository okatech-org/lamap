"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkDisabled =
  !clerkKey || clerkKey === "pk_test_placeholder" || !clerkKey.startsWith("pk_");

type UseAuthReturn = {
  userId: string | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: any;
  convexUser: any;
  clerkUser: any;
  needsOnboarding: boolean | undefined;
  isConvexUserLoaded: boolean;
};

export function useAuth(): UseAuthReturn {
  if (clerkDisabled) {
    return useDisabledAuth();
  }
  return useEnabledAuth();
}

// eslint-disable-next-line react-hooks/rules-of-hooks
function useEnabledAuth(): UseAuthReturn {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    userId && isLoaded && isSignedIn ? { clerkUserId: userId } : "skip",
  );

  const needsOnboarding =
    convexUser === null
      ? undefined
      : convexUser !== undefined
        ? !convexUser.onboardingCompleted
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

function useDisabledAuth(): UseAuthReturn {
  return {
    userId: null,
    isLoaded: true,
    isSignedIn: false,
    user: null,
    convexUser: null,
    clerkUser: null,
    needsOnboarding: undefined,
    isConvexUserLoaded: true,
  };
}
