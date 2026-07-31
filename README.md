# Fortune Avenue 

Jeu de plateau développé en **JavaScript**


## 1. Description du projet

Fortune Avenue est une version simplifiée du jeu Monopoly codée en **vanilla JavaScript**.

**L’objectif :** gérer ses propriétés, encaisser des loyers et rester le dernier joueur solvable

Ce projet met en application :
- **programmation orientée objet avancée (POO)** avec l'héritage, le polymorphisme, l'architecture modulaire,
- **gestion des états de jeu** avec les tours, les actions, les événements aléatoires,
- **rendu graphique dynamique** via la **Canvas API**,
- **qualité de code** via des tests unitaires automatisés avec **Jest**,
- **bonnes pratiques du Web** avec l'intégration SEO, le balisage Open Graph et l'accessibilité `.sr-only`


## 2. Principales fonctionnalités 

- **Plateau et modélisation des cases :**  
  structure de données modulaire (`Array` / `JSON`) gérant les différents types de cases (Départ, Propriétés, Chance, Fonds Communs, Taxes, Prison) via le polymorphisme et l'héritage

- **Moteur de jeu et déplacements :**  
  lancement des dés, calcul dynamique des déplacements, positionnement des pions sur le Canvas et gestion des règles spécifiques (bonus de passage sur la case Départ, gestion du tour de jeu)

- **Économie et transactions :**  
  module de banque, gestion du capital des joueurs, achat et vente de propriétés, calcul et encaissement des loyers, construction de maisons et détection automatique de la faillite

- **Cartes Événements (Chance et Fonds Communs) :**  
  tirage aléatoire générant des effets variés (gains ou pertes d'argent, déplacements forcés, envois ou sorties de prison)

- **Interface Utilisateur et expérience (UI/UX) :**  
  tableau de bord dynamique affichant le tour courant, le solde des joueurs et un plateau de jeu avec le dé

## Aperçu 

<div style="display:flex; gap:1rem">
  <img src="./images/technical/achat.png" width="300">
  <img src="./images/technical/prison.png" width="300">
</div>

## 3. Installation 

```
  git clone https://github.com/Melissa-code/fortune_avenue.git
  cd fortune_avenue
```

Ouvrir le fichier `index.html` dans le navigateur pour commencer à jouer


## 4. Technologies utilisées

- **[HTML](https://developer.mozilla.org/fr/docs/Web/HTML)**: structure du jeu
- **[CSS](https://developer.mozilla.org/fr/docs/Web/CSS)**: design et mise en page
- **[JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)**: logique du jeu 
- **[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)**: rendu du jeu

### Outils

- **[Git](https://git-scm.com/docs/git)**: versioning du jeu
- **[Figma](https://help.figma.com/hc/fr)**: design du jeu (création du plateau, des cartes...) 


## 5. Contributions 

Les contributions, suggestions et issues sont les bienvenues.
N’hésitez pas à ouvrir une issue pour proposer une idée ou signaler un bug.


## 6. Author 

Melissa-code 


## 7. Licence 

Sous licence MIT 
© 2026 Fortune Avenue Project