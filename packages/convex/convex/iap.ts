"use node";

import {
  Environment,
  SignedDataVerifier,
  type JWSTransactionDecodedPayload,
} from "@apple/app-store-server-library";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import { requireAuthUserId } from "./authHelpers";
import { PAID_PRODUCT_IDS } from "./cosmetics";

const BUNDLE_ID = "com.okatech.lamap";

function rootCertificates() {
  const configured = process.env.APPLE_ROOT_CERTIFICATES_BASE64;
  if (!configured) throw new ConvexError("APPLE_ROOT_CERTIFICATES_MISSING");
  let values: string[];
  try {
    values = JSON.parse(configured) as string[];
  } catch {
    throw new ConvexError("APPLE_ROOT_CERTIFICATES_INVALID");
  }
  if (!Array.isArray(values) || values.length === 0) {
    throw new ConvexError("APPLE_ROOT_CERTIFICATES_INVALID");
  }
  return values.map((certificate) => Buffer.from(certificate, "base64"));
}

function untrustedEnvironment(jws: string): Environment {
  try {
    const payload = JSON.parse(
      Buffer.from(jws.split(".")[1]!, "base64url").toString(),
    );
    if (payload.environment === Environment.PRODUCTION)
      return Environment.PRODUCTION;
    if (payload.environment === Environment.XCODE) return Environment.XCODE;
    if (payload.environment === Environment.LOCAL_TESTING)
      return Environment.LOCAL_TESTING;
  } catch {
    // The full signature verification below remains authoritative.
  }
  return Environment.SANDBOX;
}

function verifier(jws: string) {
  const environment = untrustedEnvironment(jws);
  const configuredAppId = Number(process.env.APPLE_APP_ID);
  if (
    environment === Environment.PRODUCTION &&
    !Number.isSafeInteger(configuredAppId)
  ) {
    throw new ConvexError("APPLE_APP_ID_MISSING");
  }
  return new SignedDataVerifier(
    rootCertificates(),
    true,
    environment,
    BUNDLE_ID,
    environment === Environment.PRODUCTION ? configuredAppId : undefined,
  );
}

function validatedPayload(payload: JWSTransactionDecodedPayload) {
  if (
    !payload.transactionId ||
    !payload.productId ||
    !payload.purchaseDate ||
    !payload.signedDate ||
    !payload.environment
  ) {
    throw new ConvexError("APPLE_TRANSACTION_INCOMPLETE");
  }
  if (payload.bundleId !== BUNDLE_ID)
    throw new ConvexError("APPLE_BUNDLE_MISMATCH");
  if (!PAID_PRODUCT_IDS.has(payload.productId))
    throw new ConvexError("APPLE_PRODUCT_UNKNOWN");
  if (
    !Object.values(Environment).includes(payload.environment as Environment)
  ) {
    throw new ConvexError("APPLE_ENVIRONMENT_INVALID");
  }
  return {
    transactionId: payload.transactionId,
    originalTransactionId: payload.originalTransactionId,
    productId: payload.productId,
    environment: payload.environment as Environment,
    purchaseDate: payload.purchaseDate,
    signedDate: payload.signedDate,
    revocationDate: payload.revocationDate,
  };
}

export const validateIosPurchase = action({
  args: { signedTransaction: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    granted: boolean;
    revoked: boolean;
    cosmeticId?: string;
  }> => {
    const userId = await requireAuthUserId(ctx);
    const decoded = await verifier(
      args.signedTransaction,
    ).verifyAndDecodeTransaction(args.signedTransaction);
    const transaction = validatedPayload(decoded);
    return await ctx.runMutation(internal.iapMutations.applyTransaction, {
      userId,
      ...transaction,
    });
  },
});

export const processNotification = internalAction({
  args: { signedPayload: v.string() },
  handler: async (ctx, args) => {
    const decodedNotification = await verifier(
      args.signedPayload,
    ).verifyAndDecodeNotification(args.signedPayload);
    const signedTransaction = decodedNotification.data?.signedTransactionInfo;
    if (!signedTransaction) return { accepted: true, transaction: false };
    const decoded =
      await verifier(signedTransaction).verifyAndDecodeTransaction(
        signedTransaction,
      );
    const transaction = validatedPayload(decoded);
    await ctx.runMutation(internal.iapMutations.applyTransaction, transaction);
    return { accepted: true, transaction: true };
  },
});
