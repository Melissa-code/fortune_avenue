# <img src="./images/favicon/favicon_white.svg" alt="logo" width="17" /> Fortune Avenue 

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

⚠️ Ce jeu est optimisé pour ordinateur et nécessite l'utilisation des flèches du clavier. 
Il n'est pas compatible avec les appareils mobiles ou tablettes.


## 3. Installation 

```
  git clone https://github.com/Melissa-code/fortune_avenue.git
  cd fortune_avenue
  npm install
```

Ouvrir le fichier `index.html` dans le navigateur pour commencer à jouer

## 4. Tests 

Les tests sont écrits avec [Jest](https://jestjs.io/).

> **Note de compatibilité :** Le projet utilise les modules ECMAScript (ESM) natifs. 
Afin d'assurer la compatibilité des tests à la fois sur **macOS/Linux** et **Windows**, 
nous utilisons `cross-env` pour passer l'option `--experimental-vm-modules` à Node.js

### Prérequis/Installation

Si vous venez d'installer le projet ou si les dépendances de développement 
ne sont pas encore présentes :

```bash
npm install
```

Si vous ajoutez cross-env au projet pour la première fois, installez-le avec : 

```bash
npm install --save-dev cross-env
```

### Lancer les tests 

```bash
npm test 
```

```bash
# Lancer un fichier de test spécifique
npm test tests.View.test.js
```

### Structure des tests

```
tests/
├── Controller.test.js
├── Controller.integration.test.js
├── View.test.js
├── Carte.test.js
├── Effet.test.js
└── ...
```

#### Tests unitaires

Chaque classe est testée individuellement. Les dépendances (`Jeu`, `View`, `Controller`) sont mockées avec `jest.fn()` plutôt qu'instanciées réellement
via des fonctions utilitaires `creerJeu()`, `creerView()`, `creerJoueur()` en haut de chaque fichier de test. 
Cette approche isole chaque classe testée: un bug dans `Jeu` ne fait pas échouer les tests de `Controller` et inversement.

#### Tests d'intégration 

Le fichier `Controller.integration.test.js` valide le comportement global du contrôleur en faisant interagir les différents composants du jeu en conditions réelles.

> **Note :** `View.test.js` s'exécute dans l'environnement `jsdom` (configuré dans `package.json`, clé `"jest"`) 
car il manipule le DOM et le Canvas. Les autres fichiers utilisent l'environnement Node par défaut.


## Qualité du code (ESLinter et Prettier)

Le projet utilise ESLint pour détecter les erreurs de code et Prettier pour uniformiser le formatage.

### Lancer ESLint et Prettier

```bash
# Vérifier le code avec ESLint
npm run lint

# Corriger automatiquement les erreurs ESLint réparables
npm run lint:fix

# Formater l'ensemble du code avec Prettier
npx prettier --write .

# Formater un fichier avec Prettier
npx prettier --write tests/Effet.test.js
```

## 5. Technologies utilisées

- **[HTML](https://developer.mozilla.org/fr/docs/Web/HTML)**: structure du jeu
- **[CSS](https://developer.mozilla.org/fr/docs/Web/CSS)**: design et mise en page
- **[JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)**: logique du jeu 
- **[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)**: rendu du jeu
- **[Jest](https://archive.jestjs.io/docs/en/22.x/getting-started.html)**: tests unitaires et d'intégration
- **[ESLint](https://eslint.org/docs/latest/)**: analyse statique du code (erreurs/mauvaises pratiques)
- **[Prettier](https://prettier.io/docs/)**: formate indentation, largeur de ligne, style cohérent

### Outils

- **[Git](https://git-scm.com/docs/git)**: versioning du jeu
- **[Figma](https://help.figma.com/hc/fr)**: design du plateau et des cartes

### IDE 
- **[VSCODE](https://code.visualstudio.com/)**
 - Ajouter dans `settings.json` (`Ctrl`+`Shift`+`P` → "Open User Settings JSON") :
```json
    "editor.rulers": [80]
```

## 6. Contributions 

Les contributions, suggestions et issues sont les bienvenues.
N’hésitez pas à ouvrir une issue pour proposer une idée ou signaler un bug.


## 7. Author 

Melissa-code 


## 8. Licence 

© 2026 Fortune Avenue Project