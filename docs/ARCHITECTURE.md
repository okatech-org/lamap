# Architecture Lamap

Le dépôt est un monorepo Bun :

```text
apps/mobile       application iPhone Expo / React Native
apps/web          site public, CGU, confidentialité et support
packages/convex   backend Convex, Convex Auth et validation StoreKit
```

## Mobile

Expo Router expose quatre onglets et les routes de partie, d’onboarding et de blocage. `ConvexAuthProvider` conserve les jetons dans `expo-secure-store`. Le retour OAuth utilise `lamap://auth`.

Variables côté application :

```text
EXPO_PUBLIC_CONVEX_URL
```

## Backend

Le schéma contient les tables Convex Auth, les utilisateurs, les parties, la file classée, les droits cosmétiques, les transactions StoreKit, les signalements et les blocages.

Les fonctions qui agissent pour le joueur courant résolvent son identité côté serveur. Le mobile ne choisit jamais l’identité au nom de laquelle une mutation est exécutée.

Variables et secrets côté Convex :

```text
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AUTH_APPLE_ID
AUTH_APPLE_SECRET
APPLE_ROOT_CERTIFICATES_BASE64
APPLE_APP_ID
```

Les retours OAuth de production sont :

```text
https://<deploiement>.convex.site/api/auth/callback/apple
https://<deploiement>.convex.site/api/auth/callback/google
```

Les notifications StoreKit sont reçues sur :

```text
https://<deploiement>.convex.site/apple/storekit/notifications
```

## Commandes locales

```bash
bun install
bun run --filter @lamap/mobile typecheck
bun run --filter @lamap/mobile lint
bun run --filter @lamap/convex typecheck
bun run --filter @lamap/convex test
bun run --filter @lamap/web typecheck
bun run --filter @lamap/web build
```
