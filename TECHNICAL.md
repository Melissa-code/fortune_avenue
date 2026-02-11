# Documentation Fortune Avenue

## Partie 1: Vue et Interface utilisateur

### 1. Architecture 

Le projet suit une architecture MVC (Model-View-Controller) pour assurer une séparation stricte des responsabilités:

- **Le Modèle** gère l'état du jeu (ex: valeur du dé, positions des joueurs)

- **Le Contrôleur** intercepte les événements (ex: clics) et fait le pont entre la donnée et l'image

- **La Vue** gère l'affichage sur un Canvas HTML et la détection spatiale des clics


<div style="display:flex; justify-content: center;">
    <img src="./images/MVC.svg" alt="schéma du MVC" style="width:300px;">
</div>

---


### 2. Gestion des actifs (les images)

Pour optimiser les performances et la lisibilité, les ressources sont gérées de deux manières:

- **Centralisation**: les chemins d'accès aux images sont stockés dans des Enums (Objets gelés) pour éviter les erreurs de saisie.

```
// enum/ImagesResultatsDe
const ImagesResultatsDe = Object.freeze({
  UN: "./images/de/de_1.svg",
  DEUX: "./images/de/de_2.svg",
  ...
})
```

- **Pré-chargement**: au démarrage, la Vue instancie tous les objets Image() nécessaires. Cela garantit que les faces du dé et les pions s'affichent instantanément lors du premier rafraîchissement sans "clignotement" dû au téléchargement.

```
// View.js
chargerImagesResultatsDe() {
    for (const imageDe in ImagesResultatsDe) {
        const image = new Image();
        image.src = ImagesResultatsDe[imageDe];
        image.onload = () => this.refresh();
        this.imagesResultatsDe.push(image);
    }
}
```
---


### 3. Logique d'affichage dynamique

Le rendu graphique est piloté par une méthode centrale `refresh()` qui suit un ordre de couches (layers):

- **Arrière-plan**: le plateau de jeu `drawImage()`.

- **Calque de données**: les pions des joueurs positionnés suivant un calcul de coordonnées relatif à la grille du plateau `afficherPionsJoueurs()`.

- **Interface interactive**: le dé affiché dynamiquement selon l'état du modèle.

---


### 4. Détection des interactions

Le système utilise une détection de collision par "Bounding box" (boîte de détection):

- Le calcul de la zone de clic est synchronisé avec les coordonnées de dessin de l'objet.

- La méthode `identifierCible(x, y)` compare les coordonnées du clic de la souris avec les coordonnées stockées de l'objet (ex: this.positionDeX...).

- Elle retourne un identifiant unique (ex: string "DE") permettant au contrôleur de déclencher l'action appropriée.

```
// View.js 
identifierCible(x, y) {
    //zone de detection du clic sur le dé
    if (
      x >= this.positionDeX && //650 + 65 = 715
      x <= this.positionDeX + this.tailleDe &&
      y >= this.positionDeY &&
      y <= this.positionDeY + this.tailleDe
    )
      return "DE";

    return "Aucune cible identifiée.";
  }
```

Le contrôleur utilise ensuite cet identifiant pour déclencher l'action:
```
if (cible === "DE") {
    this.modele.lancerDe();
}
```
---


### 5. Conception de la Classe View

La classe a été conçue pour être modulaire:

- **Constructeur léger**: délègue l'initialisation à des méthodes spécialisées (initialiserComposantsDe, chargerImagesPions).

- **Réutilisabilité**: les dimensions sont calculées à partir d'une variable `dimensionPlateauJeu` permettant de redimensionner le jeu facilement sans recalculer chaque position manuellement.

---


### 6. Flux d'exécution typique
1. **Utilisateur clique** sur le dé
2. **Vue** détecte les coordonnées du clic via `identifierCible(x, y)`
3. **Contrôleur** intercepte l'événement et appelle `modele.lancerDe()`
4. **Modèle** génère un nombre aléatoire et met à jour son état
5. **Contrôleur** déclenche `vue.refresh()` pour afficher le résultat

---


### 7. Diagramme de séquence (lancer de dé)
```
Utilisateur → Vue → Contrôleur → Modèle
    |          |         |            |
  [clic]   detecte   lance()   génère nombre
              ↓         ↓            ↓
           retour   update()   stocke valeur
              ↓         ↓            ↓
          refresh() ← notify ← retour
              ↓
          affichage
```
---


### 8. Problèmes rencontrés 
- **Les images ne s'affichent pas** : vérifier que le pré-chargement est terminé avant le premier `refresh()`
- **Le dé ne réagit pas au clic** : vérifier les coordonnées de la bounding box dans la console
- **Décalage des pions** : s'assurer que les calculs de position utilisent la même base (`dimensionPlateauJeu`)

---

## Partie 2 : Modèle de données (TODO)
## Partie 3 : Contrôleur et logique métier (TODO)

Stocker jeu et controller dans View lui permet d'être équipée pour 
- lire les données à afficher (via this.jeu),
- transmettre les actions de l'utilisateur (via this.controller)

avantage : La réutilisabilité
Si demain, tu ne veux plus jouer dans un Canvas mais avec des boutons HTML classiques: tu crées une nouvelle classe (ex ViewHTML), tu n'as pas besoin de changer une seule ligne de ton Controller ni de ton Jeu, tu changes juste la View dans ton main.js.

C'est **découplage**

MVC "Façon Jeu JS" (Event-Driven)
Tout le monde reste "vivant" en même temps dans la mémoire du navigateur (!= une fois la page affichée, le Controller "meurt"/ Il ne reste pas en mémoire dans Symfony). On appelle ça le MVC Smalltalk ou Observer Pattern.
la View est l'élément qui capte les interactions physiques (clics sur le canvas). View reçoit Controller pour pouvoir lui envoyer les événements (clics).
