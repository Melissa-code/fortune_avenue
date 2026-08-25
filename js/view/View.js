import ImagesResultatsDe from "../model/enums/ImagesResultatsDe.js";
import EtatsJeu from "../model/enums/EtatsJeu.js";
import ImagesUI from "../model/enums/imagesUI.js";

class View {
  static IMG_PLATEAU_JEU = "./images/gameboard_v2.svg";

  constructor(jeu, controller, document) {
    this.jeu = jeu;
    this.controller = controller;
    this.myCanvas = document.querySelector("#game-canvas"); //par defaut 330x150px
    this.myCanvas.width = window.innerWidth; //toute la largeur dispo
    this.myCanvas.height = window.innerHeight;
    this.dimensionPlateauJeu = Math.min(
      this.myCanvas.width * 0.55, // plateau = 55% de la largeur
      this.myCanvas.height,
    );
    this.ctx = this.myCanvas.getContext("2d");

    this.chargerImagePlateauJeu();
    this.imagesPions = [];
    this.chargerImagesPions();
    this.initialiserDe();
    this.chargerImagesUI(); // UI (argent, prison, maison, hotel)
    this.espacement = this.tailleDe / 2;

    // click sur dé et propositionsmodale: choix clavier
    this.initialiserEvenement();
    // attendre que les polices soient chargées avant le premier rendu
    document.fonts.ready.then(() => this.refresh());
  }

  /**
   *  event listeners: click sur le dé et propositions modale (choix clavier)
   */
  initialiserEvenement() {
    // click sur dé
    this.myCanvas.addEventListener("click", (event) => {
      const rect = this.myCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left; // x coin gauche du canvas
      const y = event.clientY - rect.top; // y haut du canvas
      let cible = this.identifierCible(x, y); // return type de Cible (str)

      if (cible === "DE") {
        this.controller.lancerDe();
      }
    });

    // touche clavier choix proposition par le user
    this.myCanvas.focus();
    this.myCanvas.addEventListener("keydown", (event) => {
      const prompt = event.key;
      this.controller.soumettreProposition(parseInt(prompt));
    });
  }

  /**
   * Charger l'image du plateau de jeu une seule fois(+rapide que refresh à chaque fois)
   */
  chargerImagePlateauJeu() {
    this.imagePlateau = new Image();
    this.imagePlateau.src = View.IMG_PLATEAU_JEU;
    this.imagePlateau.onload = () => this.refresh();
  }

  afficherPlateauJeu(imagePlateau) {
    if (this.imagePlateau.complete) {
      this.ctx.drawImage(
        imagePlateau,
        0,
        0,
        this.dimensionPlateauJeu * 0.99,
        this.dimensionPlateauJeu * 0.99,
      );
    }
  }

  afficherRondDerriereDe() {
    this.ctx.fillStyle = "rgba(8, 28, 21, 0.5)";
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(
      this.positionDeX + this.tailleDe / 2,
      this.positionDeY + this.tailleDe / 2,
      this.tailleDe * 0.8,
      0,
      Math.PI * 2, //cercle Math.PI*2 pour tour complet (380°)
    );
    this.ctx.fill();
    this.ctx.stroke();
  }

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

  afficherResultatDe() {
    let valeurAfficheeDe = this.jeu.de.valeurAffichee; // from jeu (move)
    let imageDe = this.imagesResultatsDe[valeurAfficheeDe - 2]; //indexé 0-11

    if (imageDe && imageDe.complete) {
      this.ctx.save();

      // rendre le dé semi-transparent (non cliquable) si en attente de proposition du joueur
      if (this.jeu.etat === EtatsJeu.EN_ATTENTE) {
        this.ctx.globalAlpha = 0.5;
      }
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.50)";
      this.ctx.shadowBlur = 8; // ombre
      this.ctx.shadowOffsetX = 4;
      this.ctx.shadowOffsetY = 4;

      this.ctx.drawImage(
        imageDe,
        this.positionDeX,
        this.positionDeY,
        this.tailleDe,
        this.tailleDe,
      );
      this.ctx.restore();
    }
  }

  /**
   * Charger les images des pions des joueurs depuis l'enum ImagesPions(object)
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
    const taillePion = 30; //taille du pion

    for (let i = 0; i < joueurs.length; i++) {
      const imagePion = this.imagesPions[i];
      const positionJoueur = joueurs[i].position;

      if (imagePion && imagePion.complete) {
        // calcule les dimensions réelles en respectant le ratio d'origine
        const ratio = imagePion.naturalWidth / imagePion.naturalHeight;
        let largeurDessin = taillePion;
        let hauteurDessin = taillePion;

        if (ratio > 1) {
          hauteurDessin = taillePion / ratio; // image plus large que haute
        } else {
          largeurDessin = taillePion * ratio; // image plus haute que large
        } 

        let x;
        let y;

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
        const decalageX = i * (taillePion / 2.5);
        const decalageY = i * (taillePion / 2.5);
        this.ctx.drawImage(
          imagePion,
          x + decalageX,
          y + decalageY,
          largeurDessin,
          hauteurDessin,
        );
      }
    }
  }

  chargerImagesUI() {
    this.imageArgent = new Image();
    this.imageArgent.src = ImagesUI.ARGENT;
    this.imageArgent.onload = () => this.refresh();

    this.imagePrison = new Image();
    this.imagePrison.src = ImagesUI.PRISON;
    this.imagePrison.onload = () => this.refresh();

    this.imageSortiePrison = new Image();
    this.imageSortiePrison.src = ImagesUI.SORTIE_PRISON;
    this.imageSortiePrison.onload = () => this.refresh();

    this.imageMaison = new Image();
    this.imageMaison.src = ImagesUI.MAISON;
    this.imageMaison.onload = () => this.refresh();

    this.imageHotel = new Image();
    this.imageHotel.src = ImagesUI.HOTEL;
    this.imageHotel.onload = () => this.refresh();
  }

  #afficherTagsProprietes(
    proprietes,
    x,
    cardY,
    largeurCard,
    headerH,
    ligneH,
    ligneActuelle,
  ) {
    let tagX = x + 8;
    let tagY = cardY + ligneH * ligneActuelle + headerH + 6;
    const tagH = 16;
    const tagLigneH = tagH + 5;
    const couleursRues = [
      "#5A3E2B",
      "#0A74DA",
      "#A8333E",
      "#4CAF50",
      "#9CA3AF",
    ];

    for (const prop of proprietes) {
      const couleur = prop.couleur || "#9CA3AF";
      const label = prop.nom.substring(0, 25);
      this.ctx.font = "11px Roboto";
      const tagW = this.ctx.measureText(label).width + 10;

      if (tagX + tagW > x + largeurCard - 8) {
        tagX = x + 8;
        tagY += tagLigneH;
      }

      this.ctx.fillStyle = couleur;
      this.ctx.beginPath();
      this.ctx.roundRect(tagX, tagY, tagW, tagH, 5);
      this.ctx.fill();

      this.ctx.fillStyle = couleursRues.includes(couleur)
        ? "#FFFFFF"
        : "#000000";
      this.ctx.fillText(label, tagX + 5, tagY + 11);
      tagX += tagW + 4;

      if (prop.nombreMaisons > 0) {
        const mSize = tagH * 0.9;
        for (let m = 0; m < prop.nombreMaisons; m++) {
          this.ctx.drawImage(this.imageMaison, tagX, tagY + 1, mSize, mSize);
          tagX += mSize + 2;
        }
      }
      if (prop.nombreHotels > 0) {
        const hSize = tagH * 0.9;
        this.ctx.drawImage(this.imageHotel, tagX, tagY + 1, hSize, hSize);
        tagX += hSize + 2;
      }

      tagX += 4;
    }
  }

  #afficherRondDerriereIconeJoueur(x, cardY, headerH, pionSize, decalageX) {
    const pionX = x + decalageX; 
    const pionY = cardY + (headerH - pionSize) / 2;

    const centreX = pionX + pionSize / 2;
    const centreY = pionY + pionSize / 2;
    const rayon = pionSize * 0.65;
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.beginPath();
    this.ctx.arc(centreX, centreY, rayon, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Dessine un badge rouge/vert : en prison/carte sortie de prison
   * et retourne la nouvelle position X pour empiler les badges de droite à gauche
   */
  #afficherBadge(rightX, y, hauteur, headerH, icone, texte, couleurFond, couleurTexte) {
    this.ctx.save();

    this.ctx.font = 'bold 12px Roboto';
    const textMetrics = this.ctx.measureText(texte);
    const textWidth = textMetrics.width;

    // rond blanc pour l'icône et dimensions du badge
    const pionSize = headerH * 0.40;
    const rondRayon = pionSize * 0.65;
    const rondDiametre = rondRayon * 2;
    const paddingHautBas = 4;
    const hauteurBadge = rondDiametre + paddingHautBas;
    const paddingGauche = 2;   
    const paddingDroite = 10;   
    const espaceEntreRondEtTexte = 6;
    const largeurBadge = paddingGauche + rondDiametre + espaceEntreRondEtTexte + textWidth + paddingDroite;
    const x = rightX - largeurBadge; 

    // fond coloré
    this.ctx.fillStyle = couleurFond;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, largeurBadge, hauteurBadge, hauteur / 2);
    this.ctx.fill();

    // rond blanc pour l'icône (aligné avec le padding de gauche)
    const rondCentreX = x + paddingGauche + rondRayon;
    const rondCentreY = y + hauteurBadge / 2;
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(rondCentreX, rondCentreY, rondRayon, 0, Math.PI * 2);
    this.ctx.fill();

    // icône au centre du rond blanc
    const iconeSize = rondDiametre * 0.65;
    this.ctx.drawImage(
      icone, 
      rondCentreX - iconeSize / 2, 
      rondCentreY - iconeSize / 2, 
      iconeSize, 
      iconeSize
    );

    // texte à droite du rond blanc
    this.ctx.fillStyle = couleurTexte;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    
    const texteX = rondCentreX + rondRayon + espaceEntreRondEtTexte;
    const texteY = y + hauteurBadge / 2;
    this.ctx.fillText(texte, texteX, texteY);

    this.ctx.restore(); // remet le canvas comme il était avant (font, fillStyle)

    return x;
  }

  /**
   * Badges "en prison" et "carte sortie de prison" dans le header 
   */
  #afficherBadgesStatutHeader(joueur, x, cardY, largeurCard, headerH) {
    const badgeH = headerH * 0.65; 
    const badgeY = cardY + (headerH - badgeH) / 2;
    let badgeX = x + largeurCard - 10; // Position à droite

    // Badge rouge "En Prison" 
    if (joueur.estEnPrison) {
      const texte = "En prison ! ";
      const couleur = '#da2c38';
      const couleurTexte = "#FFFFFF"; 
      badgeX = this.#afficherBadge(badgeX, badgeY, badgeH, headerH, this.imagePrison, texte, couleur, couleurTexte);
      badgeX -= 8; // espace entre deux badges si les deux s'affichent
    }

    // Badge vert "Carte Sortie de Prison"
    if (joueur.carteChanceSortiePrison || joueur.carteFondsCommunsSortiePrison) {
      const texte = "Carte sortie de prison";
      const couleur = '#A8D5BA'; 
      const couleurTexte = "#000000";
      badgeX = this.#afficherBadge(badgeX, badgeY, badgeH, headerH, this.imageSortiePrison, texte, couleur, couleurTexte);
    }
  }

  #afficherCardJoueur(
    joueur,
    imgPion,
    x,
    cardY,
    largeurCard,
    hauteurCard,
    ligneH,
    estActif,
  ) {
    const headerH = ligneH * 1.2;

    // header card
    this.ctx.fillStyle = "#123024";
    this.ctx.beginPath();
    this.ctx.roundRect(x, cardY, largeurCard, headerH, [5, 5, 0, 0]);
    this.ctx.fill();

    // header : img pion + nom joueur
    const pionSize = headerH * 0.40;     
    const decalageX = headerH * 0.2;
    this.#afficherRondDerriereIconeJoueur(x, cardY, headerH, pionSize, decalageX);
    this.ctx.drawImage(
      imgPion,
      x + decalageX,
      cardY + (headerH - pionSize) / 2,
      pionSize,
      pionSize,
    );
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = `bold 16px Roboto`;
    this.ctx.fillText(joueur.nom, x + pionSize + 30, cardY + headerH * 0.65);

    // badges statut (prison / carte sortie prison) : coin droit du header
    this.#afficherBadgesStatutHeader(joueur, x, cardY, largeurCard, headerH);

    // content card
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.beginPath();
    this.ctx.roundRect(
      x,
      cardY + headerH,
      largeurCard,
      hauteurCard - headerH,
      [0, 0, 5, 5],
    );
    this.ctx.fill();
    this.ctx.strokeStyle = "#081c15";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(x, cardY, largeurCard, hauteurCard, 5);
    this.ctx.stroke();

    // argent
    const iconSize = ligneH * 0.9;
    const iconY = cardY + headerH + ligneH * 0.1;
    this.ctx.drawImage(
      this.imageArgent,
      x + 8,
      iconY,
      iconSize / 1.7,
      iconSize / 1.7,
    );
    this.ctx.font = `14px Roboto`;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(
      `${joueur.argent} M`,
      x + 5 + iconSize + 6,
      cardY + headerH + ligneH * 0.5,
    );

    let ligneActuelle = 0.7;

    // tags propriétés achetées
    if (joueur.proprietes.length > 0) {
      this.#afficherTagsProprietes(
        joueur.proprietes,
        x,
        cardY,
        largeurCard,
        headerH,
        ligneH,
        ligneActuelle,
      );
    }

    // overlay si joueur inactif
    if (!estActif) {
      this.ctx.fillStyle = "rgba(8, 28, 21, 0.5)";
      this.ctx.beginPath();
      this.ctx.roundRect(x, cardY, largeurCard, hauteurCard, 5);
      this.ctx.fill();
    }
  }

  afficherInfosJoueurs() {
    const joueurs = this.jeu.getJoueurs();
    const x = this.dimensionPlateauJeu + this.espacement / 2;
    const largeurCard =
      this.myCanvas.width - this.dimensionPlateauJeu - this.espacement;
    const margeEntreCards = this.espacement / 2;
    const ligneH = this.espacement * 1.2;
    let cardY = 0;

    for (let i = 0; i < joueurs.length; i++) {
      const joueur = joueurs[i];
      const estActif = i === this.jeu.joueurActuelIndex;
      const nbLignes = 2 + (joueur.proprietes.length > 0 ? 1 : 0);
      const hauteurCard = ligneH * nbLignes + this.espacement;

      this.#afficherCardJoueur(
        joueur,
        this.imagesPions[i],
        x,
        cardY,
        largeurCard,
        hauteurCard,
        ligneH,
        estActif,
      );
      cardY += hauteurCard + margeEntreCards;
    }
  }

  #afficherCadreEvenements(x, y, largeur, hauteur) {
    const headerH = this.espacement * 1.5;

    // card content
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, largeur, hauteur, 5);
    this.ctx.fill();
    this.ctx.strokeStyle = "#081c15";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // card header vert
    this.ctx.fillStyle = "#123024";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, largeur, headerH, [5, 5, 0, 0]);
    this.ctx.fill();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "bold 16px Roboto";
    this.ctx.fillText("Evénements", x + this.espacement / 3, y + headerH * 0.6);
  }

  #faireRetourChariot(messages) {
    let messagesFormates = [];

    for (let message of messages) {
      let prefixe = "";
      if (message.startsWith("//")) {
        prefixe = "//";
      }

      message.split("\n").forEach((ligne, index) => {
        // 1re ligne garde préfixe // et les suivantes aussi
        messagesFormates.push(index === 0 ? ligne : prefixe + ligne);
      });
    }

    return messagesFormates;
  }

  #afficherTextesEvenements(x, y) {
    const headerH = this.espacement * 1.5;
    this.ctx.fillStyle = "#000000";

    // Dans data \n pour retour chariot
    const statuts = this.#faireRetourChariot(this.jeu.listeStatuts);

    // gestion bold italic: **bold** //italic
    for (let i = 0; i < statuts.length; i++) {
      let texte = statuts[i];

      if (texte.startsWith("**")) {
        this.ctx.font = "bold 15px Roboto";
        texte = texte.slice(2); // remove prefix
      } else if (texte.startsWith("//") || texte.includes("\n")) {
        this.ctx.font = "italic 15px Roboto";
        this.ctx.fillStyle = "#555555";
        texte = texte.slice(2);
      } else {
        this.ctx.font = "15px Roboto";
        this.ctx.fillStyle = "#000000";
      }

      this.ctx.fillText(
        texte,
        x + this.espacement / 3,
        y + headerH + this.espacement / 2 + (i * this.espacement) / 2,
      );
    }
  }

  /**
   * Afficher les messages des effets
   */
  afficherZoneEvenements() {
    const joueurs = this.jeu.getJoueurs();
    const ligneH = this.espacement * 1.2;
    const x = this.dimensionPlateauJeu + this.espacement / 2;
    const largeur =
      this.myCanvas.width - this.dimensionPlateauJeu - this.espacement;

    // calcul y juste sous les cartes des joueurs
    let hauteurTotaleCards = 0;
    for (const joueur of joueurs) {
      const nbLignes =
        2 +
        (joueur.estEnPrison ? 1 : 0) +
        (joueur.proprietes.length > 0 ? 1 : 0);
      hauteurTotaleCards +=
        ligneH * nbLignes + this.espacement + this.espacement / 1.5;
    }
    let y = hauteurTotaleCards + this.espacement;

    // hauteur dynamique
    const headerH = this.espacement * 1.5;
    const nbMessages = this.jeu.listeStatuts.length || 0;
    const hauteurLigneTexte = this.espacement / 2;
    const hauteurMinimale = this.dimensionPlateauJeu * 0.2;

    // hauteur réelle du texte + le header + une marge de sécurité en bas
    const hauteurCalculee =
      headerH + this.espacement + nbMessages * hauteurLigneTexte;
    const hauteur = Math.max(hauteurMinimale, hauteurCalculee);

    // si la boîte dépasse le bas du canvas, on la remonte
    if (y + hauteur > this.myCanvas.height) {
      y = this.myCanvas.height - hauteur - this.espacement / 2;
    }

    this.#afficherCadreEvenements(x, y, largeur, hauteur);
    this.#afficherTextesEvenements(x, y, largeur, hauteur);
  }

  /**
   * Afficher la modale  de propositions d'achat/refus ou construire maison/hotel
   * ou sortir de prison ou tirer une carte chance/payer amende
   */
  afficherModale(type = "") {
    // overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; //ombre autour
    this.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    // cadre
    const largeurModale = this.dimensionPlateauJeu * 1;
    const hauteurModale = this.dimensionPlateauJeu * 0.3;
    const zoneModaleX = this.myCanvas.width / 2 - largeurModale / 2;
    const zoneModaleY = this.myCanvas.height / 2 - hauteurModale / 2;

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.beginPath();
    this.ctx.roundRect(
      zoneModaleX,
      zoneModaleY,
      largeurModale,
      hauteurModale,
      8,
    );
    this.ctx.fill();
    this.ctx.strokeStyle = "#123024";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // header avec titre
    const headerH = this.espacement * 1.5;
    this.ctx.fillStyle = "#123024";
    this.ctx.beginPath();
    this.ctx.roundRect(
      zoneModaleX,
      zoneModaleY,
      largeurModale,
      headerH,
      [8, 8, 0, 0],
    );
    this.ctx.fill();
    this.ctx.font = "bold 18px Roboto";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(
      type,
      zoneModaleX + this.espacement / 2,
      zoneModaleY + headerH * 0.6,
    ); // titre

    this.ctx.strokeStyle = "#081c15";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(
      zoneModaleX,
      zoneModaleY,
      largeurModale,
      hauteurModale,
      8,
    );
    this.ctx.stroke();

    return {
      x: zoneModaleX,
      y: zoneModaleY,
      width: largeurModale,
      height: hauteurModale,
      headerH,
    };
  }

  // pour propositions
  afficherTexteModale(type, texte) {
    const modale = this.afficherModale(type);

    // content
    this.ctx.font = "normal 16px Roboto"; // description
    this.ctx.fillStyle = "#000000";

    const lignes = texte.split("\n"); //pour le saut de ligne
    for (let i = 0; i < lignes.length; i++) {
      // pour guider le user sur les touches à appuyer
      if (lignes[i].includes("Appuyez")) {
        this.ctx.font = "13px Roboto";
        this.ctx.fillStyle = "#123024";
      } else {
        this.ctx.font = "normal 16px Roboto";
        this.ctx.fillStyle = "#000000";
      }
      this.ctx.fillText(
        lignes[i],
        modale.x + this.espacement / 2,
        modale.y + this.espacement * 2.5 + (i * this.espacement) / 1.5,
      );
    }
  }

  afficherMenuPropositions(listePropositions, joueurActuelIndex = null) {
    let texte = "";
    const joueurCourant = this.jeu.joueurs[joueurActuelIndex];

    if (listePropositions.length > 0) {
      let i = 0;
      for (; i < listePropositions.length; i++) {
        // affiche titre : description
        texte +=
          i +
          1 +
          ". " +
          listePropositions[i].titre +
          " : " +
          listePropositions[i].description +
          "\n";
      }
    }

    // n° dynamiques
    if (listePropositions.length === 1) {
      texte += "\nAppuyez sur la touche [1] de votre clavier pour choisir.";
    } else {
      texte += `\nAppuyez sur une touche de [1] à [${listePropositions.length}] de votre clavier pour choisir.`;
    }

    this.afficherTexteModale(`Propositions à ${joueurCourant.nom}`, texte);
  }

  /**
   * Rafraîchir l'affichage du plateau de jeu, des pions, du dé,
   * des infos joueurs et propositions modale (redessiner)
   */
  refresh() {
    this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    this.afficherPlateauJeu(this.imagePlateau); // plateau jeu
    this.afficherPionsJoueurs(); //pions par-dessus
    this.afficherRondDerriereDe();
    this.afficherResultatDe();
    this.afficherInfosJoueurs();

    if (this.jeu.etat === EtatsJeu.EN_ATTENTE) {
      this.afficherMenuPropositions(
        this.jeu.listePropositions,
        this.jeu.joueurActuelIndex,
      );
    } else {
      this.afficherZoneEvenements();
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
