import ImagesResultatsDe from "../model/enums/ImagesResultatsDe.js";
import EtatsJeu from '../model/enums/EtatsJeu.js';

class View {

  static IMG_PLATEAU_JEU = "./images/gameboard_v2.svg";

  constructor(jeu, controller, document, dimensionPlateauJeu) {
    this.jeu = jeu;
    this.controller = controller; 
    this.dimensionPlateauJeu = dimensionPlateauJeu;
    this.myCanvas = document.querySelector("#game-canvas"); //jeu canvas 1100x800px
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
      
      console.log("N° de réponse : ", prompt);
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
   * Affiche un cercle semi-transparent derrière le dé pour le faire ressortir sur le plateau
   */
  afficherFondsDe() {
    this.ctx.fillStyle = 'rgba(8, 28, 21, 0.5)'; 
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; 
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.positionDeX + (this.tailleDe / 2), this.positionDeY + (this.tailleDe / 2), this.tailleDe * 0.8, 0, Math.PI * 2); //cercle Math.PI*2 pour tour complet (380°)
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * Calculs des dimensions et positions x y du dé 
   */
  initialiserDe() {
    this.tailleDe = this.dimensionPlateauJeu / 8.5;
    this.positionDeX = this.dimensionPlateauJeu / 2.3;
    this.positionDeY = this.dimensionPlateauJeu / 2.3; 
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
    let imageDe = this.imagesResultatsDe[valeurAfficheeDe - 2]; //indexé 0-11 
  
    if (imageDe && imageDe.complete) {
      this.ctx.save();

      // rendre le dé semi-transparent (non cliquable) si en attente de proposition du joueur
      if (this.jeu.etat === EtatsJeu.EN_ATTENTE) { this.ctx.globalAlpha = 0.5; }
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
      // console.log("positionJoueur", positionJoueur)

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
    const zoneJoueursX = this.dimensionPlateauJeu + this.espacement / 2;
    let zoneJoueursY = 0;
    const largeurCard = this.dimensionPlateauJeu + this.espacement * 2.5;
    const hauteurCard = this.dimensionPlateauJeu * 0.20; 
    const margeEntreCards = this.espacement;
    
    for (let i = 0; i < joueurs.length; i++) {
      const joueur = joueurs[i];
      const estActif = (i === this.jeu.joueurActuelIndex);// joueur courant 0

      // cadre
      this.ctx.beginPath();
      this.ctx.roundRect(zoneJoueursX, zoneJoueursY, largeurCard, hauteurCard, 5);
      this.ctx.fillStyle = '#ffffff'; 
      this.ctx.fill();
      
      // bordure dyn
      // this.ctx.strokeStyle = estActif ? '#da2c38' : '#081c15'; 
      this.ctx.strokeStyle = '#081c15'; 
      this.ctx.lineWidth = 3; 
      this.ctx.stroke();
      this.ctx.fillStyle = 'black'; //texte
      
      // joueur
      const imgPion = this.imagesPions[i];
      this.ctx.font = `16px Roboto`;
      this.ctx.drawImage(imgPion, zoneJoueursX + this.espacement / 2, zoneJoueursY + this.espacement / 2, 25, 25);
      this.ctx.fillText(joueur.nom, zoneJoueursX + this.espacement * 1.5, zoneJoueursY + this.espacement);

      // Argent
      this.ctx.font = `16px Roboto`;
      this.ctx.fillText(`💸  ${joueur.argent} M`, zoneJoueursX + this.espacement / 2, zoneJoueursY + this.espacement * 2);
      this.ctx.textAlign = 'left';

      // Prison
      if (joueur.estEnPrison) {
          this.ctx.font = `bold 17px Roboto`;
          this.ctx.textAlign = 'right'; 
          this.ctx.fillText("👮🏻 En Prison",  zoneJoueursX  +  this.espacement * 2.7, zoneJoueursY + this.espacement * 3);
          this.ctx.textAlign = 'left';
      }

      // proprietes 
      const proprietes = joueur.proprietes;
      if (proprietes.length > 0) {
        let tagX = zoneJoueursX + this.espacement * 4;
        const tagY = zoneJoueursY + this.espacement / 2; 
        const tagH = 14;

        for (const propriete of proprietes) {
          const couleur = propriete.couleur || '#9CA3AF'; ;  // data/cases_jeu.js
          const label = propriete.nom.substring(0, 30); // tronquer 
          const tagW = this.ctx.measureText(label).width + 10;

          // tag 
          this.ctx.fillStyle = couleur;
          this.ctx.beginPath();
          this.ctx.roundRect(tagX, tagY, tagW, tagH, 4);
          this.ctx.fill();
          //text
          if (couleur === "#5A3E2B" || couleur === "#0A74DA" || couleur === "#A8333E") { 
            this.ctx.fillStyle = '#FFFFFF';
          } else {
            this.ctx.fillStyle = '#000000';
          }
          this.ctx.font = '10px Roboto';
          this.ctx.fillText(label, tagX + 5, tagY + 10);

          tagX += tagW + 4; 
        }
      }

      // Y joueur suivant
      zoneJoueursY += hauteurCard + margeEntreCards / 2;
    }
  }

  /**
   * Afficher les messages des effets 
   */
  afficherZoneStatuts() {
    const x = this.dimensionPlateauJeu + this.espacement / 2;
    const y = this.dimensionPlateauJeu / 2 ; 
    const largeur = this.dimensionPlateauJeu + this.espacement * 2.5;
    const hauteur = this.dimensionPlateauJeu * 20 / 100; // 20% plateau

    this.ctx.fillStyle = '#123024'; 
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, largeur, hauteur, 5);
    this.ctx.fill();

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, largeur, hauteur, 5);
    this.ctx.stroke();

    this.ctx.font = "16px Roboto";
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText("Jeu en cours ", x + this.espacement / 2 , y + this.espacement);

    this.ctx.font = "16px Roboto";
    this.ctx.fillStyle = '#FFFFFF';
    const statuts = this.jeu.listeStatuts; // vue affiche tabl status (Jeu)
    for (let i = 0; i < statuts.length; i++) {
      this.ctx.fillText(statuts[i], x + this.espacement / 2, y + this.espacement * 2 + i * this.espacement/1.2);
    }
  }

  /**
   * Afficher la modale (propositions, cartes chance/fonds commun...) 
   */
  afficherModale() {
    // cadre 
    const largeurModale = this.dimensionPlateauJeu ;
    const hauteurModale = this.dimensionPlateauJeu * 0.3;
    const zoneModaleX = (this.myCanvas.width / 2) - (largeurModale / 2);
    const zoneModaleY = (this.myCanvas.height / 2) - hauteurModale;

    const decalage = 6;
    this.ctx.fillStyle = 'rgba(8, 28, 21, 0.5)'; 
    this.ctx.beginPath();
    this.ctx.roundRect(zoneModaleX - decalage, zoneModaleY - decalage, largeurModale + (decalage * 2), hauteurModale + (decalage * 2), 5);
    this.ctx.fill();

    // style 
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.roundRect(zoneModaleX, zoneModaleY, largeurModale, hauteurModale, 5);
    // console.log("zone modale: roundRect ", zoneModaleX, zoneModaleY, largeurModale, hauteurModale, this.myCanvas.width, this.myCanvas.height)
    this.ctx.fill();
    this.ctx.strokeStyle = '#123024';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    return { x: zoneModaleX, y: zoneModaleY, width: largeurModale, height: hauteurModale };
  }

  // pour proposition
  afficherTexteModale(type, texte) {
    const modale = this.afficherModale();
    // console.log("texte modale", texte)
    // console.log("type modale", type)
  
    // titre 
    this.ctx.font = "bold 20px Roboto";
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText(type, modale.x + this.espacement, modale.y + this.espacement);

    // description
    this.ctx.font = "normal 17px Roboto";
  
    const lignes = texte.split("\n"); //pour le saut de ligne
      // console.log("lignes dans modale", lignes)
    for (let i = 0; i < lignes.length; i++) {
      // console.log("ligne dans modale", lignes[i])
      this.ctx.fillText(lignes[i], modale.x + this.espacement, modale.y + this.espacement * 2 + (i * this.espacement));
    }
  } 
  
  afficherMenuPropositions(listePropositions) {
    let texte = "";
    // console.log("propositions", listePropositions)

    if (listePropositions.length > 0) {
      let i = 0; 
      for (; i < listePropositions.length; i++) {
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
    this.afficherFondsDe()
    this.afficherResultatDe();
    this.afficherInfosJoueurs();

    if (this.jeu.etat === EtatsJeu.EN_ATTENTE) {
     this.afficherMenuPropositions(this.jeu.listePropositions);
    } else {
      this.afficherZoneStatuts(); 
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


