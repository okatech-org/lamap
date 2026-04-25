import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn("Missing NEXT_PUBLIC_CONVEX_URL — Convex client will not work.");
}

export const convex = new ConvexReactClient(convexUrl ?? "https://placeholder.convex.cloud");
