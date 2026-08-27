# Backend Lamap

Ce dossier contient le backend autoritaire de Lamap : Convex Auth, parties, Elo, matchmaking, catalogue, validation StoreKit et modération minimale.

Principes obligatoires :

- toute opération du joueur courant utilise `requireAuthUserId`, fondé sur `getAuthUserId` ;
- une action de partie vérifie toujours que la session appartient à la partie ;
- le résultat Elo est écrit avec les anciens points, les nouveaux points, les deltas et sa date d’application ;
- une transaction StoreKit est vérifiée avant l’octroi du droit cosmétique et ne peut pas être rejouée pour un autre compte ;
- les parties d’entraînement et les fins techniques ne changent jamais le classement.

Commandes :

```bash
bun run typecheck
bun run test
bun run codegen
bun run deploy
```
