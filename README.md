# Lamap

Lamap est un jeu de cartes camerounais gratuit pour iPhone. Cette version se concentre sur quatre usages : jouer en classé, s’entraîner contre trois niveaux d’IA, consulter le classement mondial et acheter des cosmétiques non consommables.

L’application ne contient ni pari, ni portefeuille, ni monnaie virtuelle, ni gain financier, ni publicité récompensée. La Kora est uniquement un effet de victoire visuel et sonore.

## Architecture

- `apps/mobile` : application Expo / React Native pour iPhone ;
- `apps/web` : pages publiques de support, confidentialité et CGU ;
- `packages/convex` : authentification, données, jeu, classement et validation StoreKit 2.

La documentation produit et la liste de contrôle App Store se trouvent dans [`docs`](./docs).

## Développement

Prérequis : Bun, un déploiement Convex et Xcode pour la cible iOS.

```bash
bun install
bun run convex:dev
bun --cwd apps/mobile start
```

Les variables locales ne doivent jamais être ajoutées à Git. L’application mobile attend `EXPO_PUBLIC_CONVEX_URL` dans `apps/mobile/.env.local`.

## Vérification

```bash
bun run typecheck
bun run lint
bun --cwd packages/convex test
bunx expo-doctor apps/mobile
bun --cwd apps/mobile expo export --platform ios
```

Une version ne passe en « Prêt pour la soumission » qu’après validation de la checklist [`docs/APP_STORE_RELEASE.md`](./docs/APP_STORE_RELEASE.md) sur TestFlight et sur iPhone physique.
