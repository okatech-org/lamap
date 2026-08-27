# Produit Lamap

Lamap est une application iPhone gratuite de duel de cartes. La version de lancement contient quatre surfaces :

- Jouer : partie classée mondiale ou entraînement contre l’IA ;
- Classement : pseudo, avatar, points et position mondiale ;
- Boutique : cosmétiques non consommables distribués par l’App Store ;
- Profil : identité publique, statistiques, achats, sécurité du compte et informations légales.

La version de lancement ne contient aucune économie interne. La Kora désigne uniquement une victoire spéciale accompagnée d’un effet visuel et sonore. Elle ne change pas le calcul du classement.

## Classement

- 500 points au départ ;
- Elo avec un facteur K de 32 ;
- minimum de 0 point ;
- une victoire augmente les points, une défaite ou un abandon les diminue ;
- une fin technique et l’entraînement ne changent aucun point ;
- un joueur apparaît après sa première partie classée ;
- deux totaux identiques donnent la même position.

## Identité et modération

La connexion passe par Apple ou Google avec Convex Auth. Le joueur choisit ensuite un pseudo unique. Les pseudos sont validés et filtrés. Un profil peut être signalé ou bloqué depuis le classement, et les blocages sont appliqués au classement comme au matchmaking.

## Achats

Les neuf articles payants sont des achats intégrés Apple non consommables. Leur nom et leur tarif affichés viennent de StoreKit. Convex vérifie la transaction signée avant que l’application la termine. Le profil permet de restaurer les achats.
