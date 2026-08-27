# CI iPhone

Le lancement ne construit que la cible iOS. Le workflow `.github/workflows/build-ios.yml` lance une build EAS, télécharge l’IPA et l’attache à une release GitHub.

La soumission App Store reste une action manuelle. Un tag peut construire une IPA de production, mais ne doit pas soumettre automatiquement une version qui n’a pas terminé la campagne TestFlight.

## Configuration requise

- secret GitHub `EXPO_TOKEN` lié à l’organisation Expo du projet ;
- `EXPO_PUBLIC_CONVEX_URL` configurée dans les environnements EAS concernés ;
- certificat de distribution et profil iOS valides dans EAS ;
- `ascAppId` et `appleTeamId` réels dans `apps/mobile/eas.json` avant toute soumission.
