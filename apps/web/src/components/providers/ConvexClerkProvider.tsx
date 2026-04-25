"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convex } from "@/lib/convex";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isPlaceholderKey =
  !clerkKey || clerkKey === "pk_test_placeholder" || !clerkKey.startsWith("pk_");

export function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  if (isPlaceholderKey) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(
        "[lamap/web] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing or placeholder — Clerk disabled, Convex still active.",
      );
    }
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#B4443E",
          colorBackground: "#0A0E14",
          colorInputBackground: "rgba(46,61,77,0.4)",
          colorInputText: "#F5F2ED",
          colorText: "#F5F2ED",
          colorTextSecondary: "rgba(245,242,237,0.65)",
          colorNeutral: "#F5F2ED",
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: "12px",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
