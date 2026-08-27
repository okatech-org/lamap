/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authHelpers from "../authHelpers.js";
import type * as badWords from "../badWords.js";
import type * as cosmetics from "../cosmetics.js";
import type * as gameEngine from "../gameEngine.js";
import type * as games from "../games.js";
import type * as http from "../http.js";
import type * as iap from "../iap.js";
import type * as iapMutations from "../iapMutations.js";
import type * as matchmaking from "../matchmaking.js";
import type * as moderation from "../moderation.js";
import type * as onboarding from "../onboarding.js";
import type * as ranking from "../ranking.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authHelpers: typeof authHelpers;
  badWords: typeof badWords;
  cosmetics: typeof cosmetics;
  gameEngine: typeof gameEngine;
  games: typeof games;
  http: typeof http;
  iap: typeof iap;
  iapMutations: typeof iapMutations;
  matchmaking: typeof matchmaking;
  moderation: typeof moderation;
  onboarding: typeof onboarding;
  ranking: typeof ranking;
  users: typeof users;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
