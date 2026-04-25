# LaMap monorepo

Bun workspaces + Turborepo. The repo is laid out as:

```
.
├── apps/
│   └── mobile/             # Expo + React Native app (@lamap/mobile)
│       ├── src/
│       ├── assets/
│       ├── android/        # generated via expo prebuild
│       ├── ios/            # generated via expo prebuild
│       ├── app.json
│       ├── babel.config.js
│       ├── metro.config.js
│       ├── eas.json
│       ├── package.json
│       └── .env.local      # EXPO_PUBLIC_*
├── packages/
│   └── convex/             # Convex backend (@lamap/convex)
│       ├── convex/         # functions, schema, _generated/
│       ├── package.json
│       └── .env.local      # CONVEX_DEPLOYMENT, CLERK_SECRET_KEY, …
├── docs/
├── .github/
├── package.json            # workspace root + turbo scripts
├── turbo.json
├── tsconfig.base.json
└── bun.lock
```

## Day-to-day commands

All run from the repo root unless noted.

| Command | What it does |
|---|---|
| `bun install` | Install workspace deps (hoists to root `node_modules`). |
| `bun mobile` | Alias for `bun --filter @lamap/mobile run start` (Expo dev server). |
| `bun mobile:ios` / `bun mobile:android` | Native run via Expo. |
| `bun convex:dev` | Runs `convex dev` from `packages/convex/`. |
| `bun convex:deploy` | Pushes Convex functions. |
| `bunx turbo run typecheck` | Typecheck both packages in parallel (cached). |
| `bunx turbo run lint` | Lint pipeline (cached). |
| `bun --filter @lamap/mobile run <script>` | Run any script defined in `apps/mobile/package.json`. |

## Imports inside the mobile app

| From | What it resolves to |
|---|---|
| `@/...` | `apps/mobile/src/...` |
| `@assets/...` | `apps/mobile/assets/...` |
| `@lamap/convex` | `packages/convex/convex/_generated/api` (the typed `api` / `internal` references) |
| `@lamap/convex/_generated/...` | `packages/convex/convex/_generated/...` |
| `@lamap/convex/...` | `packages/convex/convex/...` (e.g. `@lamap/convex/validators`, `@lamap/convex/ranking`) |

Both `tsconfig.json` `paths` and `babel.config.js` `module-resolver` aliases are kept in sync, plus Metro's `extraNodeModules` so the bundler resolves them at runtime.

## Environment variables

| File | Used by | Sample keys |
|---|---|---|
| `apps/mobile/.env.local` | Expo dev server / EAS Build (client side) | `EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| `packages/convex/.env.local` | `convex dev` / `convex deploy` (server side) | `CONVEX_DEPLOYMENT`, `CLERK_SECRET_KEY`, `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_WEBHOOK_SECRET` |

These files are git-ignored. For production / CI, set the same `EXPO_PUBLIC_*` vars on EAS via `eas env:create --environment production` (see `docs/ci.md`).

## Adding a new package later

For the eventual `apps/web` (Next.js, Vite, etc.) consuming the same Convex backend:

1. `mkdir -p apps/web && cd apps/web && bun init`.
2. Set `package.json#name` to `@lamap/web`.
3. Add `"@lamap/convex": "workspace:*"` to its dependencies.
4. Mirror the alias setup in your bundler of choice (Next: `next.config.js` `transpilePackages`, Vite: `resolve.alias`).
5. `bun install` at the repo root — workspace symlinks rewire automatically.

Shared UI / design code (the current `apps/mobile/src/components/lamap` + `apps/mobile/src/design`) can later be promoted into `packages/ui` once you know what's actually reusable across mobile and web — the React Native primitives won't transfer, but design tokens, the rank ladder data, the kora rule constants, etc. will.
