# Déploiement iPhone et TestFlight

Ce guide complète `docs/APP_STORE_RELEASE.md`. Il ne faut pas soumettre Lamap tant que les contrôles sur appareils physiques, achats Sandbox et TestFlight ne sont pas terminés.

## 1. Préparer les comptes

- Apple Developer : enregistrer l’App ID `com.okatech.lamap` avec Sign in with Apple et In-App Purchase.
- App Store Connect : créer l’application iOS, signer les accords Paid Apps et compléter les informations fiscales et bancaires.
- Google Cloud : créer un client OAuth de type Web application pour Convex Auth.
- Convex : le projet propre Oka Tech est déployé en développement sur `different-stingray-221` et en production sur `ceaseless-gerbil-83`.

## 2. Initialiser Convex Auth en production

Depuis `packages/convex` :

```bash
npx @convex-dev/auth --prod
```

Cette commande initialise les secrets internes de Convex Auth. Configurer ensuite :

- `AUTH_APPLE_ID` : Service ID Apple ;
- `AUTH_APPLE_SECRET` : secret JWT Apple, à renouveler au plus tard tous les six mois ;
- `AUTH_GOOGLE_ID` et `AUTH_GOOGLE_SECRET` ;
- `APPLE_APP_ID` : identifiant numérique de l’app App Store Connect ;
- `APPLE_ROOT_CERTIFICATES_BASE64` : tableau JSON des certificats racine Apple encodés en base64, utilisé par la vérification StoreKit 2.

Les URL OAuth déclarées pour Apple et à déclarer pour Google sont :

```text
https://different-stingray-221.convex.site/api/auth/callback/apple
https://ceaseless-gerbil-83.convex.site/api/auth/callback/apple
https://different-stingray-221.convex.site/api/auth/callback/google
https://ceaseless-gerbil-83.convex.site/api/auth/callback/google
```

Apple exige une URL publique en HTTPS. Le retour de Convex Auth vers l’application utilise ensuite `lamap://auth`.

Le script `scripts/deploy-prod.sh` peut configurer ces variables et déployer le backend une fois les valeurs disponibles. Ne jamais committer `scripts/.env.deploy`.

## 3. Créer les achats intégrés

Créer neuf achats non consommables dans App Store Connect :

| Nom                     | Product ID                                           |
| ----------------------- | ---------------------------------------------------- |
| Dos Bleu Royal          | `com.okatech.lamap.cosmetic.cardback.bleu_royal`     |
| Dos Or Sable            | `com.okatech.lamap.cosmetic.cardback.or_sable`       |
| Dos Ombre Tribale       | `com.okatech.lamap.cosmetic.cardback.ombre_tribale`  |
| La Stratège             | `com.okatech.lamap.cosmetic.avatar.la_stratege`      |
| Le Bandi                | `com.okatech.lamap.cosmetic.avatar.le_bandi`         |
| La Gardienne            | `com.okatech.lamap.cosmetic.avatar.la_gardienne`     |
| Le Tacticien            | `com.okatech.lamap.cosmetic.avatar.le_tacticien`     |
| La Maîtresse des cartes | `com.okatech.lamap.cosmetic.avatar.maitresse_cartes` |
| La Légende              | `com.okatech.lamap.cosmetic.avatar.la_legende`       |

Ajouter les traductions, prix France et captures de revue. Configurer les App Store Server Notifications V2 vers :

```text
https://ceaseless-gerbil-83.convex.site/apple/storekit/notifications
```

Les noms et prix visibles dans l’application viennent de StoreKit et ne doivent pas être codés en dur.

## 4. Configurer EAS

L’Apple ID numérique `6756675386`, le Team ID `5Y39TTNCM7`, les environnements EAS, le certificat de distribution, le profil de provisionnement et la clé EAS Submit sont configurés.

## 5. Valider avant soumission

Depuis la racine :

```bash
bun run typecheck
bun run lint
bun --cwd packages/convex run test
bun --cwd apps/web run build
cd apps/mobile && npx expo-doctor && npx expo export --platform ios
```

Puis :

```bash
cd apps/mobile
eas build --profile preview --platform ios
eas build --profile production --platform ios
```

Tester Apple et Google sur appareil réel, le matchmaking sur deux iPhone, les neuf produits en Sandbox, les restaurations, révocations et changements de compte. Déployer les pages légales et support avant la campagne TestFlight. La soumission App Store reste manuelle après validation de la checklist.
