import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();
auth.addHttpRoutes(http);

http.route({
  path: "/apple/storekit/notifications",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as { signedPayload?: string };
    if (!body.signedPayload)
      return new Response("Bad request", { status: 400 });
    await ctx.runAction(internal.iap.processNotification, {
      signedPayload: body.signedPayload,
    });
    return new Response(null, { status: 200 });
  }),
});

export default http;
