"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/hooks/use-auth";
import { initialsFromName, prToRank } from "@/lib/rank";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user, isConvexUserLoaded, needsOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn === false) {
      router.replace("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (needsOnboarding === true) {
      router.replace("/onboarding");
    }
  }, [needsOnboarding, router]);

  const player = user
    ? {
        initials: initialsFromName(user.username || user.firstName || "??"),
        name: user.username || user.firstName || "Bandi",
        rank: prToRank(user.pr ?? 0),
        points: user.pr ?? 0,
      }
    : undefined;

  if (!isLoaded || !isConvexUserLoaded) {
    return <ShellLoading />;
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#0A0E14" }}>
      <AppSidebar player={player} />
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function ShellLoading() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0E14",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "var(--or-2)",
          animation: "lamap-pulse 1.6s ease-in-out infinite",
        }}
      >
        · CHARGEMENT ·
      </div>
    </div>
  );
}
