# Économie des Kora — Paramètres

> Valeurs **de départ**, à itérer avec la vraie data une fois en ligne. But du doc : donner des chiffres assez précis pour des maquettes crédibles **et** pour l'implémentation. Voir aussi `BRIEF_MONETISATION.md` (écrans) et `lamap241_rules.md` (règles du jeu).

---

## 1. Principe

Économie **fermée** en monnaie virtuelle (les Kora). Trois règles qui guident tous les chiffres :

1. **Sinks ≥ faucets** sur le long terme → les Kora gardent de la valeur, sinon tout le monde devient riche et personne n'achète.
2. **La variance fait le revenu**, pas la moyenne. Un joueur ne tombe pas à sec « en moyenne » — il tombe à sec sur une **mauvaise série**. C'est ce moment qui déclenche pub/achat.
3. **Jamais de blocage total** : un joueur fauché doit toujours pouvoir rejouer (regen gratuit) → on ne perd pas le joueur, on le monétise plus tard.

---

## 2. Dénomination & ressenti

- Unité = **1 Kora**. On raisonne en **milliers**. Les gros chiffres font plaisir et donnent du poids aux gains.
- Tout s'affiche en Kora avec l'icône jeton (`btn-chip`). L'argent réel (FCFA) n'apparaît **que** dans la boutique.

---

## 3. Stack de départ & seuils

| Élément | Valeur | Rôle |
| --- | --- | --- |
| **Stack de départ** | **2 000 Kora** (une fois) | ~40 mains à Découverte : le temps d'accrocher avant tout risque de panne. |
| **Seuil « solde bas »** | < 1 mise de la table courante | Affiche le bouton « Pub → +Kora ». |
| **Seuil « fauché »** | < mise min. de la plus petite table (200) | Déclenche l'écran **Rebuy**. |

---

## 4. Tables (mise par main)

La mise est le montant antéposé par joueur **à chaque main**. Le vainqueur prend le pot − rake.

| Table | Mise / main | Solde min. pour s'asseoir | Public |
| --- | --- | --- | --- |
| **Découverte** | 50 | 200 | débutants, joueurs fauchés |
| **Standard** | 200 | 800 | cœur de cible |
| **VIP** | 1 000 | 4 000 | statut / gros joueurs |

> **Solde min. = 4 × la mise** : il faut pouvoir encaisser une perte sur **double-Kora (×4)** sans tomber négatif (voir §5).

---

## 5. Multiplicateurs Kora (règle → éco)

La règle du jeu crée les **swings** qui rendent les mains palpitantes (et font tomber à sec) :

| Issue | Le perdant paie | Effet sur le pot |
| --- | --- | --- |
| Victoire normale | 1 × mise | standard |
| **Kora** (dernier pli avec un 3) | **2 × mise** | pot doublé |
| **Double-Kora** (2 derniers plis avec des 3) | **4 × mise** | pot quadruplé |

→ C'est *ça* qui fait qu'on peut perdre gros vite. Le rake se calcule sur le pot **réel** (après multiplicateur).

---

## 6. Le rake (puits principal)

- **5 % du pot**, arrondi à l'inférieur, **plafonné à 10 × la mise**.
- C'est le seul vrai puits structurel : sur une table fermée, l'ensemble des joueurs perd `rake` par main → ça retire des Kora de l'économie en continu.
- **Levier n°1 d'équilibrage** : si les soldes gonflent trop (inflation), on monte le rake ; s'ils s'effondrent, on le baisse.

Exemple (Découverte, 2 joueurs) : pot normal = 100 → rake 5. Sur double-Kora, pot = 250 → rake 12.

---

## 7. Faucets (entrées de Kora)

| Source | Montant | Fréquence / plafond |
| --- | --- | --- |
| Stack de départ | 2 000 | une fois |
| **Bonus quotidien** | 100 → 600 selon le streak | 1×/jour (voir courbe) |
| **Pub récompensée** | **150 Kora** | max **5/jour**, cooldown ~3 min |
| **Regen anti-fauché** | 200 | toutes les 30 min, **uniquement si fauché**, plafond 600 |
| Récompenses (tournois, défis, succès) | variable | ponctuel |

**Courbe du bonus quotidien (cycle 7 jours)** : J1 100 · J2 150 · J3 200 · J4 250 · J5 300 · J6 400 · J7 600, puis recommence. Un jour manqué remet la série à J1.

> Injection max d'un free player actif ≈ **1 000–1 350 Kora/jour** (quotidien + 5 pubs). Volontairement généreux au début (rétention) ; on resserre via le rake si ça inflationne.

---

## 8. Sinks (sorties de Kora)

| Sink | Détail |
| --- | --- |
| **Rake** | principal, cf. §6 |
| **Cosmétiques en Kora** | dos de cartes ~2 000–8 000, thèmes de table ~10 000–30 000, emotes ~1 000 |
| **Tournois à buy-in Kora** | entrée en Kora, cagnotte en Kora (− rake) — cf. §11 |

> La mise à une table n'est **pas** un vrai puits (elle est redistribuée au gagnant) — seul le rake l'est.

---

## 9. Prix réels (mobile money / web = canal principal)

| Pack | Prix | Kora | Taux | Étiquette |
| --- | --- | --- | --- | --- |
| Dépannage | 100 FCFA | 1 000 | 10 /F | — |
| Petit | 500 FCFA | 6 000 | 12 /F | — |
| Moyen | 1 000 FCFA | 13 000 | 13 /F | **Populaire** |
| Grand | 2 500 FCFA | 35 000 | 14 /F | **Meilleure offre** |
| Gros joueur | 5 000 FCFA | 80 000 | 16 /F | — |

- Le **taux monte avec la taille du pack** (remise au volume) → pousse vers les gros packs.
- **IAP mobile** : refléter ces packs au palier de prix store le plus proche (~0,99 / 1,99 / 4,99 / 9,99 $). Le **web (mobile money) est le canal promu** (pas de commission de 30 %).

---

## 10. Réalité de la pub & couverture des coûts

- eCPM vidéo récompensée en Afrique centrale ≈ **1–4 $** → **1 vue ≈ 0,6–2,4 FCFA**. Chaque vue rapporte peu, mais c'est **du pur bénéfice** (la récompense en Kora ne coûte rien).
- Couvrir l'infra (Convex, ~25 $/mois à petite échelle) ≈ **~12 500 vues/mois** ≈ **~100 joueurs actifs/jour** regardant ~4 pubs. → *La pub seule couvre les serveurs dès une petite base active.*
- Conversion en payeur attendue : **1–3 %** → il faut du **volume**. Les non-payeurs ne sont pas perdus : ils rapportent via la pub.

---

## 11. Tournois — deux types distincts

1. **Gratuit, à lot réel** (le « gagner du vrai ») : entrée **gratuite**, lot **fixe** (crédit/data 1 000–5 000 FCFA, ou un téléphone à l'occasion). C'est un **coût marketing** à budgéter, pas un centre de profit. ⚠️ Légalité : entrée toujours gratuite + lot fixe (jamais une cagnotte alimentée par les mises).
2. **Buy-in en Kora** (sink + engagement) : entrée payée en Kora, cagnotte en Kora (− rake), lots = Kora/prestige. Pas d'argent réel → aucun souci légal. Excellent puits pour les joueurs engagés.

---

## 12. La boucle, en résumé

- **Casual** : accumule doucement (bonus quotidien > ses pertes au rake) → se sent progresser → revient. *Rétention.*
- **Joueur engagé / tables hautes** : le rake mord plus fort en absolu + il vise le statut VIP → grind ou **achat**. *Monétisation.*
- **Tout le monde** : une mauvaise série (amplifiée par les ×2/×4) → écran **Rebuy** → pub ou achat. *Le moment qui convertit.*

**Leviers à régler avec la data** (du plus puissant au moins) : `rake %` → `récompense pub` → `bonus quotidien` → `mises des tables`.

---

## 13. Garde-fous

- **Anti-inflation** : suivre le **solde médian** des joueurs actifs. S'il grimpe semaine après semaine → monter le rake ou baisser les faucets.
- **Anti-prédation** : le regen gratuit garantit qu'on peut **toujours** rejouer à Découverte sans payer. La monétisation reste un choix (impatience, statut), pas une rançon.
- **Anti-triche** (à prévoir côté backend) : empêcher la collusion / le transfert abusif de Kora entre comptes complices pour blanchir les cadeaux ou truquer les classements.
