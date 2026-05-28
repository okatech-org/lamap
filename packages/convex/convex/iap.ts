"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const KORA_PACKS: Record<string, number> = {
  kora_pack_small: 500,
  kora_pack_medium: 1500,
  kora_pack_large: 5000,
  kora_pack_xlarge: 15000,
};

const APPLE_VERIFY_PROD = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_VERIFY_SANDBOX = "https://sandbox.itunes.apple.com/verifyReceipt";
const EXPECTED_BUNDLE_ID = "com.okatech.lamap";

interface AppleVerifyResponse {
  status: number;
  environment?: string;
  receipt?: {
    bundle_id?: string;
    in_app?: Array<{
      product_id: string;
      transaction_id: string;
      original_transaction_id?: string;
    }>;
  };
  latest_receipt_info?: Array<{
    product_id: string;
    transaction_id: string;
    original_transaction_id?: string;
  }>;
}

async function verifyWithApple(
  receipt: string,
  sharedSecret: string,
): Promise<AppleVerifyResponse> {
  const body = JSON.stringify({
    "receipt-data": receipt,
    password: sharedSecret,
    "exclude-old-transactions": true,
  });

  const prodRes = await fetch(APPLE_VERIFY_PROD, { method: "POST", body });
  const prodJson = (await prodRes.json()) as AppleVerifyResponse;

  // 21007 = sandbox receipt sent to production endpoint -> retry sandbox.
  if (prodJson.status === 21007) {
    const sandboxRes = await fetch(APPLE_VERIFY_SANDBOX, {
      method: "POST",
      body,
    });
    return (await sandboxRes.json()) as AppleVerifyResponse;
  }
  return prodJson;
}

export const validateIosPurchase = action({
  args: {
    userId: v.id("users"),
    receipt: v.string(),
    productId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: true; koraCredited: number }> => {
    const sharedSecret = process.env.IAP_APPLE_SHARED_SECRET;
    if (!sharedSecret) {
      throw new Error("IAP_APPLE_SHARED_SECRET is not configured");
    }

    const koraAmount = KORA_PACKS[args.productId];
    if (!koraAmount) {
      throw new Error(`Unknown product id: ${args.productId}`);
    }

    const verified = await verifyWithApple(args.receipt, sharedSecret);
    if (verified.status !== 0) {
      throw new Error(
        `Apple receipt validation failed (status ${verified.status})`,
      );
    }
    if (verified.receipt?.bundle_id !== EXPECTED_BUNDLE_ID) {
      throw new Error("Bundle id mismatch");
    }

    const purchases =
      verified.latest_receipt_info ?? verified.receipt?.in_app ?? [];
    const purchase = purchases.find((p) => p.product_id === args.productId);
    if (!purchase) {
      throw new Error("Matching purchase not found in receipt");
    }

    const credited: number = await ctx.runMutation(
      internal.iapMutations.creditValidatedPurchase,
      {
        userId: args.userId,
        productId: args.productId,
        transactionId: purchase.transaction_id,
        originalTransactionId: purchase.original_transaction_id,
        koraAmount,
      },
    );

    return { success: true, koraCredited: credited };
  },
});
