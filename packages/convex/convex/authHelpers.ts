import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

export async function requireAuthUserId(
  ctx: Parameters<typeof getAuthUserId>[0],
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("AUTH_REQUIRED");
  return userId;
}
