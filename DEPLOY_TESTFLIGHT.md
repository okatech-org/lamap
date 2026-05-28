# Guide de déploiement TestFlight + Production — lamap

Ce document est ta checklist complète pour publier `lamap` sur TestFlight et préparer la production.
Il est généré à partir de l'audit du repo et des décisions prises avec toi.

## État de référence du projet

| Élément | Valeur |
| --- | --- |
| Stack | Expo 54 (managed) + React Native 0.81 |
| Bundle ID iOS | `com.okatech.lamap` |
| App name | `lamap` |
| Version / Build | `1.0.0` / `1` (avec autoIncrement EAS) |
| EAS projectId | `144e34e3-2eab-4e8a-a1da-4442f71dd611` |
| EAS owner | `okatechs-organization` |
| Convex dev | `https://nautical-viper-974.eu-west-1.convex.cloud` |
| Convex prod | _à créer_ |
| Clerk dev | `driven-airedale-29.clerk.accounts.dev` |
| Clerk prod | _à créer_ |
| Capacités iOS | Push Notifications, Sign in with Apple, In-App Purchase |
| Backend push | `@convex-dev/expo-push-notifications` (clé APNs côté Convex) |
| Backend IAP | `verifyReceipt` legacy + `IAP_APPLE_SHARED_SECRET` |

## Produits IAP à créer (consommables)

Les Product IDs sont **sans préfixe bundle** (le code et `packages/convex/convex/iap.ts` les attendent ainsi).

| Product ID | Reference Name | Quantité | Prix |
| --- | --- | --- | --- |
| `kora_pack_small` | Kora Pack Small | 500 Kora | 0,99 € (Tier 1) |
| `kora_pack_medium` | Kora Pack Medium | 1 500 Kora | 2,99 € (Tier 3) |
| `kora_pack_large` | Kora Pack Large | 5 000 Kora | 9,99 € (Tier 10) |
| `kora_pack_xlarge` | Kora Pack XLarge | 15 000 Kora | 24,99 € (Tier 25) |

---

## Phase 1 — Apple Developer Portal

URL : https://developer.apple.com/account

### 1.1 Récupérer le Team ID
- Membership Details → noter `Team ID` (10 caractères) et `Apple ID`.
- À reporter dans `apps/mobile/eas.json` (`submit.production.ios.appleTeamId`).

### 1.2 Créer l'App ID
- Identifiers → ➕ → App IDs → App.
- Description : `lamap`
- Bundle ID : Explicit, valeur `com.okatech.lamap`
- Capabilities à cocher :
  - [x] Push Notifications
  - [x] Sign In with Apple
  - [x] In-App Purchase
- Continue → Register.

### 1.3 Clé APNs (déléguée à EAS)
On laisse `eas credentials` créer la clé automatiquement. Si on doit la créer à la main :
- Keys → ➕ → Name `lamap APNs`, cocher `Apple Push Notifications service (APNs)`.
- Continue → Register → **Télécharger AuthKey_XXXX.p8** (une seule fois).
- Noter `Key ID` et conserver le fichier `.p8`.

---

## Phase 2 — App Store Connect

URL : https://appstoreconnect.apple.com

### 2.1 Créer l'app
- My Apps → ➕ → New App.
- Plateforme : iOS
- Name : `lamap`
- Primary Language : French (France)
- Bundle ID : `com.okatech.lamap` (sélectionner celui créé en 1.2)
- SKU : `lamap-ios-001`
- User Access : Full Access
- Create.
- Une fois créée, ouvrir App Information → noter l'**Apple ID numérique** (≈ 10 chiffres) → c'est `ascAppId` pour `eas.json`.

### 2.2 Clé API App Store Connect (pour EAS Submit)
- Users and Access → Integrations → App Store Connect API → Team Keys → ➕.
- Name : `EAS Submit`
- Access : `App Manager`
- Generate → **Télécharger le `.p8`** (une seule fois).
- Noter `Issuer ID` (UUID en haut de la page) et `Key ID`.
- À fournir à `eas credentials` (option recommandée).

### 2.3 Accords Paid Apps + Banking & Tax
- Business → Agreements, Tax, and Banking.
- Signer le `Paid Apps` agreement.
- Compléter `Tax Forms` (W-8BEN ou équivalent selon pays).
- Ajouter `Bank Account` (IBAN + BIC pour France).
- **Statut requis : Active** sur les trois lignes avant que les IAP fonctionnent.

> Cette étape doit être faite par toi-même (informations bancaires personnelles).

### 2.4 App-Specific Shared Secret (pour `/verifyReceipt`)
- App Information → App-Specific Shared Secret → Manage → Generate.
- Copier la valeur (32 chars hex). Sera mise dans `IAP_APPLE_SHARED_SECRET` côté Convex.

### 2.5 Créer les 4 produits IAP
Pour chaque ligne du tableau "Produits IAP à créer" :
- Monetization → In-App Purchases → ➕ → **Consumable**.
- Reference Name + Product ID + Price tier.
- Localizations FR + EN : Display Name + Description.
- Review Information : Screenshot ≥ 640×920px (peut être un mock du wallet).
- Cleared for Sale : ON.
- Save.

### 2.6 TestFlight — testeurs internes
- TestFlight → Internal Testing → ➕.
- Group Name : `Équipe interne`.
- Enable automatic distribution : ON.
- Add Testers depuis Users and Access (Admin/App Manager/Developer/Marketer).

---

## Phase 3 — Clerk Production

URL : https://dashboard.clerk.com

### 3.1 Créer une instance Production
- Application lamap → Switch to / Create Production.
- Configurer le domaine de prod (ex : `auth.okatech.com`).
- Activer Sign in with Apple (Social Connection → Apple) → fournir le Service ID + clé.

### 3.2 JWT Template Convex
- JWT Templates → ➕ → Convex.
- Copier la valeur de `Issuer` → c'est `CLERK_JWT_ISSUER_DOMAIN`.

### 3.3 Récupérer les clés prod
- API Keys → noter :
  - `Publishable key` : `pk_live_...`
  - `Secret key` : `sk_live_...`
  - `Webhook signing secret` (Endpoints → ton endpoint Convex)

---

## Phase 4 — Convex Production

URL : https://dashboard.convex.dev

### 4.1 Créer le deployment prod
- Project lamap (team okatech) → Deployments → New Production Deployment.
- Récupérer URL `https://<slug>.convex.cloud` et generate Deploy Key.

### 4.2 Configurer les env vars prod
Depuis le repo :
```bash
cd packages/convex
export CONVEX_DEPLOY_KEY=<clé-prod>

# Auth Clerk prod
npx convex env set --prod CLERK_JWT_ISSUER_DOMAIN "<issuer-clerk-prod>"
npx convex env set --prod CLERK_SECRET_KEY "sk_live_..."
npx convex env set --prod CLERK_WEBHOOK_SECRET "whsec_..."

# IAP
npx convex env set --prod IAP_APPLE_SHARED_SECRET "<valeur-2.4>"

# APNs (si on gère la clé manuellement, sinon EAS s'en occupe)
npx convex env set --prod APNS_AUTH_KEY "$(cat AuthKey_XXXX.p8)"
npx convex env set --prod APNS_KEY_ID "<key-id>"
npx convex env set --prod APNS_TEAM_ID "<team-id>"
npx convex env set --prod APNS_TOPIC "com.okatech.lamap"
```

### 4.3 Pousser schema + functions
```bash
cd packages/convex
npx convex deploy --prod
```

---

## Phase 5 — Modifier le repo

### 5.1 Mettre à jour `apps/mobile/eas.json`
Remplacer :
- `submit.production.ios.ascAppId` → la valeur récupérée en 2.1
- `submit.production.ios.appleTeamId` → la valeur récupérée en 1.1

### 5.2 Secrets EAS (préférable à un .env.production)
```bash
cd apps/mobile
eas secret:create --scope project --name EXPO_PUBLIC_CONVEX_URL --value "https://<slug>.convex.cloud"
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..."
```

> Ces secrets sont injectés au moment du build EAS. En dev local, `.env.local` continue de fournir les valeurs.

### 5.3 (Optionnel) Profile EAS submit pour preview
Permet de soumettre un build `preview` à TestFlight pour itérer plus vite :
```jsonc
"submit": {
  "production": { "ios": { "ascAppId": "...", "appleTeamId": "..." } },
  "preview":    { "ios": { "ascAppId": "...", "appleTeamId": "..." } }
}
```

---

## Phase 6 — Premier build & soumission TestFlight

```bash
cd apps/mobile

# Vérifie/crée certificat distribution + provisioning + APNs
eas credentials

# Build production iOS (≈ 15-25 min)
eas build --profile production --platform ios

# Une fois le build SUCCESS :
eas submit --profile production --platform ios
```

Ensuite :
1. ASC → TestFlight → l'IPA apparaît en `Processing` (5-10 min).
2. Une fois `Ready to Test`, le groupe `Équipe interne` est notifié automatiquement.
3. Les testeurs installent l'app via TestFlight.

---

## Récap des credentials à conserver (en lieu sûr)

- [ ] Apple Team ID
- [ ] App Store Connect numeric App ID (`ascAppId`)
- [ ] APNs Key ID + `.p8` (si géré manuellement)
- [ ] ASC API Issuer ID + Key ID + `.p8`
- [ ] Convex prod URL + Deploy Key
- [ ] Clerk prod publishable + secret + webhook + JWT issuer
- [ ] App-Specific Shared Secret (IAP)

> Ne pas commiter ces secrets dans Git. Pour le repo, n'utiliser que des `eas secret` ou variables d'env locales.
