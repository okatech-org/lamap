# Brief Monétisation — Les Kora (jetons)

> Document de cadrage destiné au **designer**. Objectif : lister les écrans, les parcours et l'intention de chaque surface pour pouvoir maquetter. Les chiffres sont **indicatifs** (à caler ensuite avec l'économie des jetons).

---

## 1. Le modèle en bref (le « pourquoi »)

- La monnaie du jeu s'appelle les **Kora** (jetons).
- **Non-encaissables** : on achète des Kora, on les mise en partie, mais on ne les reconvertit **jamais** en argent réel. → Ce n'est donc **pas** un jeu d'argent réglementé (pas de licence, validé par les stores).
- On ne vend pas du « faux argent ». On vend **3 choses** :
  1. **La commodité** — de la Kora dispo 24/7 contre de vrais adversaires.
  2. **Le statut** — gros tas de Kora, tables VIP, titres, classements.
  3. **L'attention** des non-payeurs → la **pub récompensée**.
- **Sources de revenus** (par ordre d'importance attendue) :
  1. Pub récompensée (« regarde une pub → +Kora ») — *le principal au début.*
  2. Pass saison / abonnement pas cher.
  3. Cosmétiques (dos de cartes, thèmes, avatars, emotes…).
  4. Vente de Kora (capte les impatients + les gros joueurs).
- **Moteur de l'économie** : un petit **rake en Kora** prélevé sur chaque pot (un *puits* qui entretient la rareté → pousse au rachat).
- **Paiement** : **mobile money via le web** (Airtel/Moov, évite la commission de 30 % des stores) ; IAP sur mobile en complément.

---

## 2. Éléments d'UI persistants (sur presque tous les écrans)

- **Pastille de solde Kora** — toujours visible (en-tête), avec icône jeton + montant. Tap → portefeuille. Réutiliser le style `btn-chip`.
- **Bouton « + »** collé à la pastille → ouvre la boutique de Kora.
- **Bouton « Pub → +Kora »** — apparaît quand le solde est bas.
- **Or / ambre = premium & statut.** Utiliser la couleur or (déjà celle des décorations) pour signaler la valeur, le VIP, les offres.

---

## 3. Écrans — Phase 1 (MVP monétisation)

> Le minimum pour que la boucle « jouer → miser → tomber à sec → recharger » tourne.

**1. Onboarding des Kora**
- *Objectif* : expliquer ce que sont les Kora, offrir un stack de départ, poser le cadre « ce ne sont pas de l'argent réel ».
- *Éléments* : 2-3 slides, animation du stack offert, CTA « Jouer ».

**2. Lobby / choix de table**
- *Objectif* : choisir où jouer ; créer l'envie de monter en gamme.
- *Éléments* : tables groupées par **niveau de buy-in** (Découverte / Standard / **VIP**), mise minimale affichée, cadenas sur les tables trop chères pour le solde actuel. Le VIP doit donner envie (or, prestige).

**3. Zone de jeu — affichage de la mise**
- *Objectif* : faire ressentir l'enjeu pendant la partie.
- *Éléments* : le **pot** au centre, la mise de chaque joueur, le **rake prélevé** (discret mais visible). Réutiliser/étendre `betting-zone` et « Zone de Mise » existants.

**4. Écran « Plus de Kora » / Rebuy** ⭐ *moment clé de monétisation*
- *Objectif* : rattraper le joueur qui vient de tout perdre.
- *Éléments* : 3 options claires — **Regarder une pub (+Kora)** / **Acheter des Kora** / **Attendre** (timer de recharge gratuite). Ton encourageant, pas culpabilisant.

**5. Boutique de Kora**
- *Objectif* : vendre des packs.
- *Éléments* : 4-5 packs (montant + prix), un pack **« meilleure offre »** mis en avant, bonus visuels (ex. +20 %). Or = premium.

**6. Recharge mobile money (web)**
- *Objectif* : encaisser via Airtel/Moov sans friction.
- *Éléments* : pack choisi → opérateur (Airtel / Moov) → numéro → écran de confirmation/attente → succès + crédit animé.

**7. Bonus quotidien**
- *Objectif* : faire revenir chaque jour (rétention = revenu).
- *Éléments* : récompense du jour, **série (streak)** qui monte, calendrier de 7 jours.

**8. Portefeuille / solde**
- *Objectif* : transparence + point d'entrée vers l'achat.
- *Éléments* : solde, historique simple (gains/pertes/achats), CTA acheter.

---

## 4. Écrans — Phase 2 (rétention & statut)

> À maquetter une fois la Phase 1 stable. Ne pas tout faire d'un coup.

**9. Profil / statut** — avatar, **titre** (« Maître de la Kora »), rang, total de Kora gagnés, badges. La surface pour frimer.

**10. Classements** — global / amis / hebdomadaire (par Kora gagnés ou par rang).

**11. Pass saison** — piste gratuite vs premium, paliers, progression, prix (~500-1000 FCFA/mois).

**12. Boutique cosmétiques** — dos de cartes, thèmes de table, avatars, emotes, animations de victoire. Aperçu + achat (en Kora ou en argent).

**13. Tournois** ⭐ *le « gagner du vrai » sans gambling*
- Entrée **gratuite**, lots **réels et fixes** : crédit téléphone / forfait data, voire un téléphone.
- *Éléments* : liste des tournois, compte à rebours, lot affiché bien en évidence, classement live.
- ⚠️ *Règle légale à respecter* : toujours une voie d'entrée gratuite + lot fixe (jamais un pot alimenté par les mises).

**14. Offrir des Kora à un ami** — envoi de jetons (dépense sociale + viralité).

**15. VIP / abonnement** — perks, badge VIP, accès tables hautes.

---

## 5. Parcours clés (flows à maquetter)

1. **Nouveau joueur** : onboarding → stack offert → 1re partie.
2. **Tomber à sec** : fin de partie perdue → écran Rebuy (pub / achat / attente).
3. **Acheter des Kora** : boutique → mobile money → crédit animé.
4. **Gagner un pot** : victoire → rake prélevé → solde mis à jour.
5. **Tournoi gratuit** : s'inscrire → jouer → gagner du crédit.

---

## 6. Chiffres indicatifs (placeholders — à caler avec l'éco des jetons)

- **Stack de départ** : ~1 000–2 000 Kora.
- **Packs** : 1 000 / 5 000 / 20 000 / 50 000 Kora.
- **Récompense pub** : ~100–300 Kora, avec cooldown.
- **Rake** : ~5 % du pot, en Kora.
- **Tables** : mise min. par niveau (Découverte / Standard / VIP).
- **Bonus quotidien** : montant croissant selon le streak.

> Ces valeurs servent juste à rendre les maquettes crédibles. L'équilibrage réel (faucets/puits) viendra après.

---

## 7. Cohérence visuelle

- Rester dans la charte existante (voir `STYLE_GUIDE.md`) : rouge `primary`, marron `secondary`, accents **or/ambre**.
- Réutiliser les primitives déjà définies : `btn-chip` (jetons), `betting-zone` / « Zone de Mise », modals en **sheet bottom**, boutons **pill**.
- **Or/ambre = valeur, premium, statut.** C'est le code couleur qui doit signaler « ici on dépense / on gagne du prestige ».
