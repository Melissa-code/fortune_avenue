import ImagesResultatsDe from "../model/enums/ImagesResultatsDe.js";
import EtatsJeu from '../model/enums/EtatsJeu.js';

class View {

  static IMG_PLATEAU_JEU = "./images/gameboard_v2.svg";

  constructor(jeu, controller, document, dimensionPlateauJeu) {
    this.jeu = jeu;
    this.controller = controller; 
    this.dimensionPlateauJeu = dimensionPlateauJeu;
    this.myCanvas = document.querySelector("#game-canvas"); //jeu canvas 800x800px
    this.ctx = this.myCanvas.getContext("2d");

    this.chargerImagePlateauJeu(); // plateau jeu
    this.imagesPions = [];         // pions joueurs
    this.chargerImagesPions();
    this.initialiserDe();          // dé
    this.espacement = this.tailleDe / 2; 

    this.initialiserEvenement(); // click sur dé et propositionsmodale: choix clavier
  }

  /**
   *  event listeners: click sur le dé et propositions modale (choix clavier)
   */
  initialiserEvenement() {
    // click sur dé
    this.myCanvas.addEventListener("click", (event) => {
      const rect = this.myCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;    // x coin gauche du canvas
      const y = event.clientY - rect.top;     // y haut du canvas
      let cible = this.identifierCible(x, y); // return type de Cible (str)

      if (cible === "DE") {
        this.controller.lancerDe();
      }
    })

    // touche clavier choix proposition par le user 
    this.myCanvas.focus();
    this.myCanvas.addEventListener('keydown', (event) => {
      const prompt = event.key;
      this.controller.soumettreProposition(parseInt(prompt));
      
      console.log("N° réponse du user : ", prompt);
    })
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
    this.positionDeY = this.dimensionPlateauJeu / 2 ; 
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
    if (valeurAfficheeDe === 1) valeurAfficheeDe = 2;  //dé pas encore lancé: 2 par defaut sinon ne s affiche pas

    let imageDe = this.imagesResultatsDe[valeurAfficheeDe - 1]; //indexé 0-11 dans array
    if (imageDe && imageDe.complete) {
      this.ctx.save();

      // rendre le dé semi-transparent
      if (this.jeu.etat === EtatsJeu.EN_ATTENTE) { this.ctx.globalAlpha = 0.5; }
      // effet dé en relief par les ombres 
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.50)";  
      this.ctx.shadowBlur = 8; // ombre
      this.ctx.shadowOffsetX = 4;                
      this.ctx.shadowOffsetY = 4;

      this.ctx.drawImage(imageDe, this.positionDeX, this.positionDeY, this.tailleDe, this.tailleDe);
      this.ctx.restore();
    }
  }

  /**
   * Charger les images des pions des joueurs dans le tableau imagesPions
   */
  chargerImagesPions() {
    let joueurs = this.jeu.getJoueurs(); //joueurs[]

    for (let i = 0; i < joueurs.length; i++) {
      const image = new Image();
      image.src = joueurs[i].pion;
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
    const taillePion = this.espacement; //taille fixe du pion 

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

        //décalage pour éviter superposition pions pour lisibilité 
        const decalageX = i * (taillePion / 2); 
        const decalageY = i * (taillePion / 2);
        this.ctx.drawImage(imagePion, x + decalageX, y + decalageY, taillePion, taillePion);
      }
    }
  }

  /**
   * Afficher les infos des joueurs (argent, propriétés, prison...) dans une zone  
   */
  afficherInfosJoueurs() {
    const joueurs = this.jeu.getJoueurs();
    const zoneJoueursX = this.dimensionPlateauJeu + (this.espacement * 4);// ap le dé
    let zoneJoueursY = 0;
    const largeurCard = this.dimensionPlateauJeu ; 
    const hauteurCard = this.dimensionPlateauJeu * 0.30; // 30%
    const margeEntreCards = this.espacement;
    
    for (let i = 0; i < joueurs.length; i++) {
        const joueur = joueurs[i];
        const estActif = (i === this.jeu.joueurActuelIndex);// joueur courant 0

        // cadre
        this.ctx.fillStyle = '#b9e3c6'; 
        this.ctx.fillRect(zoneJoueursX, zoneJoueursY, largeurCard, hauteurCard);
        
        // bordure dyn
        this.ctx.strokeStyle = estActif ? '#da2c38' : '#d8f3dc'; 
        this.ctx.lineWidth = Math.max(1, this.dimensionPlateauJeu * 0.005); 
        this.ctx.strokeRect(zoneJoueursX, zoneJoueursY, largeurCard, hauteurCard);
        this.ctx.fillStyle = 'black';
        
        // joueur
        const imgPion = this.imagesPions[i];
        this.ctx.font = `bold 17px Roboto`;
        this.ctx.drawImage(imgPion, zoneJoueursX + this.espacement / 2, zoneJoueursY + this.espacement / 2, 30, 30);
        this.ctx.fillText(joueur.nom, zoneJoueursX + this.espacement * 1.5, zoneJoueursY + this.espacement);

        // Argent
        this.ctx.font = `17px Roboto`;
        this.ctx.textAlign = 'center'; 
        this.ctx.fillText(`💸 Argent: ${joueur.argent} M`, zoneJoueursX + largeurCard / 2, zoneJoueursY + this.espacement);
        this.ctx.textAlign = 'left';

        // Prison
        // if (joueur.estEnPrison) {
            this.ctx.font = `bold 17px Roboto`;
            this.ctx.textAlign = 'right'; 
            this.ctx.fillText("👮🏻 En Prison", zoneJoueursX + largeurCard - this.espacement, zoneJoueursY + this.espacement);
            this.ctx.textAlign = 'left';
        // }

        // Y joueur suivant
        zoneJoueursY += hauteurCard + margeEntreCards;
    }
  }

  /**
   * Afficher la modale (propositions, cartes chance/fonds commun...) 
   */
  afficherModale() {
    // cadre 
    const zoneModaleX =  this.dimensionPlateauJeu + this.espacement * 4;
    const zoneModaleY = this.dimensionPlateauJeu / 1.5 + this.espacement;
    const largeurModale = this.dimensionPlateauJeu;
    const hauteurModale = this.dimensionPlateauJeu / 3.5;
    // style 
    this.ctx.fillStyle = '#000000';
    this.ctx.roundRect(zoneModaleX, zoneModaleY, largeurModale, hauteurModale, 10);
    this.ctx.fill();
    // this.ctx.fillRect(zoneModaleX, zoneModaleY,  largeurModale, hauteurModale);
    this.ctx.strokeStyle = '#d2e4c6';
    this.ctx.lineWidth = 2;
     this.ctx.roundRect(zoneModaleX, zoneModaleY, largeurModale, hauteurModale, 10);
    // this.ctx.strokeRect(zoneModaleX, zoneModaleY, largeurModale, hauteurModale);
    this.ctx.stroke();

    return { x: zoneModaleX, y: zoneModaleY, width: largeurModale, height: hauteurModale };
  }

  afficherTexteModale(type, texte) {
    const modale = this.afficherModale();
  
    // titre 
    this.ctx.font = "bold 20px Roboto";
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(type, modale.x + this.espacement, modale.y + this.espacement);

    // description
    this.ctx.font = "normal 17px Roboto";
    const lignes = texte.split("\n"); //pour le saut de ligne
    for (let i = 0; i < lignes.length; i++) {
      this.ctx.fillText(lignes[i], modale.x + this.espacement, modale.y + this.espacement * 2 + (i * this.espacement));
    }
  } 

  afficherMenuPropositions(listePropositions) {
    let texte = "";

    if (listePropositions.length > 0) {
      for (let i = 0; i < listePropositions.length; i++) {
        // affiche 1. titre : description)
        texte += (i + 1) + ". " + listePropositions[i].titre + " : " + listePropositions[i].description + "\n";
      }
    }
    
    this.afficherTexteModale("Propositions", texte);
  }

  /**
   * Rafraîchir l'affichage du plateau de jeu, des pions, du dé, des infos joueurs et propositions modale (redessiner)
   */
  refresh() {
    this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    this.afficherPlateauJeu(this.imagePlateau); // plateau jeu
    this.afficherPionsJoueurs(); //pions par-dessus
    this.afficherResultatDe();
    this.afficherInfosJoueurs();

    if (this.jeu.etat === EtatsJeu.EN_ATTENTE) {
     this.afficherMenuPropositions(this.jeu.listePropositions);
    }
  }

  /**
   * Identifier cible cliquée par x et y -> retourne le type de cible (string)
   */
  identifierCible(x, y) {
    // console.log(`positions de x: ${x}, y : ${y}`);

    //zone de detection du clic sur le dé
    if (
      x >= this.positionDeX && 
      x <= this.positionDeX + this.tailleDe &&
      y >= this.positionDeY &&
      y <= this.positionDeY + this.tailleDe
    )
      return "DE";

    return "Aucune cible identifiée.";
  }
}

export default View;
