# CI iPhone

Le workflow `.github/workflows/build-ios.yml` ne construit que la cible iOS. L’IPA signée reste dans EAS et n’est pas publiée dans une release du dépôt GitHub public.

La soumission App Store reste une action manuelle. Un tag peut construire une IPA de production, mais ne doit pas soumettre automatiquement une version qui n’a pas terminé la campagne TestFlight.

## Configuration requise

- secret GitHub `EXPO_TOKEN` lié à l’organisation Expo du projet ;
- `EXPO_PUBLIC_CONVEX_URL` configurée dans les environnements EAS concernés ;
- certificat de distribution et profil iOS valides dans EAS ;
- `ascAppId` et `appleTeamId` réels dans `apps/mobile/eas.json` avant toute soumission ;
- quota de build iOS EAS disponible.

Au 27 août 2026, le quota iOS du forfait Expo gratuit est épuisé et se réinitialise le 1er septembre 2026. La tentative locale atteint l’archivage, mais Xcode 27 bêta refuse le certificat de distribution historique associé au profil EAS. Aucun certificat partagé ne doit être révoqué pour contourner ce blocage : utiliser la build EAS cloud après la remise à zéro du quota ou recréer explicitement un couple certificat/profil dédié à Lamap.
