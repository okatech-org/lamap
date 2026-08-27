# Passage en publication iPhone

Lamap ne doit pas être marqué « Prêt pour la soumission » tant que chaque contrôle externe ci-dessous n’est pas validé.

## Implémenté dans le dépôt

- [x] quatre onglets : Jouer, Classement, Boutique et Profil ;
- [x] modes Classé et Entraînement uniquement ;
- [x] Elo 500 / K=32 / minimum 0, résultat classé idempotent ;
- [x] Kora sans effet sur les points ;
- [x] Convex Auth Apple et Google, retour `lamap://auth`, stockage Secure Store ;
- [x] autorisation serveur fondée sur la session ;
- [x] pseudo filtré, signalement et blocage ;
- [x] neuf cosmétiques payants et deux cosmétiques gratuits ;
- [x] validation JWS StoreKit 2, restauration et révocation ;
- [x] suppression du compte dans l’application ;
- [x] pages CGU, confidentialité et support ;
- [x] configuration Expo limitée à iOS.

## Validé localement

- [x] typage mobile, backend et web ;
- [x] lint mobile ;
- [x] 12 tests unitaires et backend ;
- [x] Expo Doctor (18 contrôles sur 18) ;
- [x] export Expo iOS ;
- [x] build statique du site public ;
- [x] compilation Xcode sans signature sur simulateur.

## Déploiement et comptes à terminer

- [x] créer une base Convex propre et déployer le nouveau schéma en développement et en production ;
- [x] exécuter le codegen contre le nouveau déploiement ;
- [x] initialiser Convex Auth et configurer Apple ainsi que les certificats StoreKit sur les deux déploiements ;
- [ ] configurer Google OAuth dans Google Cloud et ajouter `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` ;
- [x] enregistrer les retours Apple des deux déploiements Convex ;
- [x] documenter le renouvellement de `AUTH_APPLE_SECRET` avant le 23 février 2027 ;
- [x] renseigner l’App Store Connect ID `6756675386` et le Team ID `5Y39TTNCM7` dans `apps/mobile/eas.json` ;
- [x] configurer les environnements EAS et les identifiants de signature iOS ;
- [ ] vérifier les informations juridiques exactes de l’éditeur et rendre `support@lamap.gg` opérationnel ;
- [x] déployer et vérifier l’accueil, le support, la confidentialité et les CGU sur `https://lamap-okatechs-projects-f0102678.vercel.app/` ;
- [ ] ajouter le secret GitHub `EXPO_TOKEN` du compte Expo OkaTech ;
- [ ] attendre le renouvellement du quota iOS EAS le 1er septembre 2026, ou utiliser un forfait disposant d’une build.

## App Store Connect

- [x] relier l’application `6756675386`, le bundle `com.okatech.lamap` et la clé EAS Submit ;
- [ ] créer les neuf produits non consommables avec leurs identifiants exacts ;
- [ ] ajouter traductions, visuels de revue et disponibilité France ;
- [ ] configurer les notifications serveur App Store vers Convex ;
- [ ] compléter la fiche de confidentialité et les URL légales ;
- [ ] préparer les captures iPhone et les notes App Review ;
- [ ] fournir un compte de test et conserver le backend actif pendant la revue.

## Validation réelle

- [ ] tester Apple et Google sur iPhone : création, retour OAuth, relance, liaison par adresse vérifiée, déconnexion et suppression ;
- [ ] tester le matchmaking sur deux iPhone : partie complète, abandon, reconnexion, arrière-plan et retour réseau ;
- [ ] tester les neuf produits avec StoreKit et Sandbox : achat, annulation, coupure réseau, rejeu, restauration, changement de compte et révocation ;
- [ ] produire une build EAS de production signée (l’export iOS passe ; l’archive locale Xcode 27 est bloquée par l’ancien certificat EAS) ;
- [ ] terminer une campagne TestFlight sur appareil physique ;
- [ ] ne lancer la soumission qu’après validation de tous les points précédents.
