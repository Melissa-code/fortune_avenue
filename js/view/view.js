import ImagesResultatsDe from "../model/enums/ImagesResultatsDe.js";

class View {
  static IMG_PLATEAU_JEU = "./images/gameboard_v2.svg";

  constructor(jeu, document, dimensionPlateauJeu) {
    //jeu canvas 800x800
    this.jeu = jeu;
    this.dimensionPlateauJeu = dimensionPlateauJeu;
    this.myCanvas = document.querySelector("#game-canvas");
    this.ctx = this.myCanvas.getContext("2d");

    // plateau jeu 
    this.chargerImagePlateauJeu();
    // pions joueurs
    this.imagesPions = [];
    this.chargerImagesPions();
    // dé
    this.initialiserDe(); 
    this.espacement = this.tailleDe / 2;
  }

  /**
   * Charger l'image du plateau de jeu une seule fois(+rapide que refresh à chaque fois)
   */
  chargerImagePlateauJeu() {
    this.imagePlateau = new Image(); 
    this.imagePlateau.src = View.IMG_PLATEAU_JEU;
    this.imagePlateau.onload = () => this.refresh();
  }

  /**
   * Afficher le plateau de jeu sur le canvas
   */
  afficherPlateauJeu(imagePlateau) {
    if (this.imagePlateau.complete) {
      this.ctx.drawImage(imagePlateau, 0, 0, this.dimensionPlateauJeu, this.dimensionPlateauJeu);
    }
  }

  /**
   * Calculs des dimensions et positions x y du dé 
   */
  initialiserDe() {
    this.tailleDe = this.dimensionPlateauJeu / 10;
    this.positionDeX = this.dimensionPlateauJeu + this.tailleDe / 2;
    this.positionDeY = 0;

    this.imagesResultatsDe = [];
    this.chargerImagesResultatsDe(); 
  }

  /**
   * Charger les images du dé depuis l'enum ImagesResultatsDe(object) dans le tableau this.imagesResultatsDe[]
   */
  chargerImagesResultatsDe() {
    for (const imageDe in ImagesResultatsDe) {
      const image = new Image();
      image.src = ImagesResultatsDe[imageDe];
      image.onload = () => this.refresh();
      this.imagesResultatsDe.push(image);
    }
  }

  /**
   * Afficher le dé sur le canvas
   */
  afficherResultatDe() {
    let valeurAfficheeDe = this.jeu.de.valeurAffichee; // from jeu (move)
    if (valeurAfficheeDe === 1) valeurAfficheeDe = 2; //dé pas encore lancé: 1 par defaut sinon ne s affiche pas

    const imageDe = this.imagesResultatsDe[valeurAfficheeDe - 1]; //indexé 0-11 dans array
    if (imageDe && imageDe.complete) {
      this.ctx.drawImage(imageDe, this.positionDeX, this.positionDeY, this.tailleDe, this.tailleDe);
    }
  }

  /**
   * Charger les images des pions des joueurs dans le tableau imagesPions
   */
  chargerImagesPions() {
    let joueurs = this.jeu.getJoueurs(); //joueurs[]

    for (let i = 0; i < joueurs.length; i++) {
      const image = new Image();
      image.src = joueurs[i].pion.image;
      image.onload = () => this.refresh(); //pion1 arrive: on redessine plateau + pion1
      this.imagesPions.push(image);
    }
  }

  /**
   * Afficher les pions des joueurs sur le plateau de jeu
   * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
   * 0 à 12 cases par côté => dimensionPlateauJeu / 13 = unité de déplacement
   */
  afficherPionsJoueurs() {
    const joueurs = this.jeu.getJoueurs();
    const unite = this.dimensionPlateauJeu / 13; // unite case: 2 + 9 + 2
    const taillePion = 35;

    for (let i = 0; i < joueurs.length; i++) {
      const imagePion = this.imagesPions[i];
      const positionJoueur = joueurs[i].position;

      if (imagePion && imagePion.complete) {
        let x = 0;
        let y = 0;

        //bas (0->10) Y est fixe X change
        if (positionJoueur >= 0 && positionJoueur <= 10) {
          // definir x y en fonction de la position
          x = (11 - positionJoueur) * unite; // 0=11 1=10 ... 10=1
          y = 11 * unite;
        }
        //gauche (11->20)  X est fixe Y change
        else if (positionJoueur > 10 && positionJoueur <= 20) {
          x = 0 * unite;
          y = (21 - positionJoueur) * unite;
        }

        //haut (21->30) Y est fixe X change (1re case 21-2=19)
        else if (positionJoueur > 20 && positionJoueur <= 30) {
          x = (positionJoueur - 19) * unite;
          y = 0 * unite;
        }

        //droite (31->39) X est fixe Y change (1re case 31-2=29)
        else {
          x = 11 * unite;
          y = (positionJoueur - 29) * unite;
        }

        this.ctx.drawImage(imagePion, x, y, taillePion, taillePion);
      }
    }
  }

  afficherInfosJoueurs() {
    const joueurs = this.jeu.getJoueurs();
    const zoneJoueursX = this.dimensionPlateauJeu + this.espacement * 4;
    const zoneJoueursY = 0; 
    const largeurZoneJoueurs = this.dimensionPlateauJeu;
    const hauteurZoneJoueurs = this.dimensionPlateauJeu / 1.5;
    
    for (let i = 0; i < joueurs.length; i++) {
      // cadre infos joueur
      this.ctx.fillStyle = '#FFFFFF'; 
      this.ctx.fillRect(zoneJoueursX, zoneJoueursY, largeurZoneJoueurs, hauteurZoneJoueurs);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(zoneJoueursX, zoneJoueursY, largeurZoneJoueurs, hauteurZoneJoueurs);

      // texte infos joueur
      this.ctx.font = "16px Roboto Bold";
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`Joueur ${i + 1}`, zoneJoueursX + 10, zoneJoueursY - 10);
      const joueur = joueurs[i];
      const infosJoueur = `Joueur: ${joueur.nom} - Argent: ${joueur.argent} M`; 

      this.ctx.fillText(infosJoueur, zoneJoueursX, zoneJoueursY + (i * 20) + 100);
    } 
  }

  /**
   * Afficher la modale avec les propositions de choix après le lancer de dé
   */
  afficherModalePropositions() {
    const zoneModaleX =  this.dimensionPlateauJeu + this.espacement * 4;
    const zoneModaleY = this.dimensionPlateauJeu / 1.5 + this.espacement;
    const largeurModale = this.dimensionPlateauJeu;
    const hauteurModale = this.dimensionPlateauJeu / 3.5;

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(zoneModaleX, zoneModaleY,  largeurModale, hauteurModale);
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(zoneModaleX, zoneModaleY, largeurModale, hauteurModale);
  }

  /**
   * Rafraîchir l'affichage du plateau de jeu et des pions des joueurs (redessiner)
   */
  refresh() {
    //this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    this.afficherPlateauJeu(this.imagePlateau); // plateau jeu
    this.afficherPionsJoueurs(); //pions par-dessus
    this.afficherResultatDe();
    this.afficherInfosJoueurs();
    this.afficherModalePropositions();
  }

  /**
   * Identifier cible cliquée par x et y -> retourne le type de cible (string)
   */
  identifierCible(x, y) {
    console.log(`positions de x: ${x}, y : ${y}`);

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
}

export default View;
