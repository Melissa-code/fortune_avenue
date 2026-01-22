

class View {

    static IMG_PLATEAU_JEU = './images/gameboard_v2.svg';

    constructor(jeu, document, dimensionPlateauJeu) {
        this.jeu = jeu;
        this.dimensionPlateauJeu = dimensionPlateauJeu;
        this.myCanvas = document.querySelector("#game-canvas");
        this.ctx = this.myCanvas.getContext("2d");

        this.imagePlateau = new Image(); //chargé une seule fois (+rapide)
        this.imagePlateau.src = View.IMG_PLATEAU_JEU;
        this.imagePlateau.onload = () => this.refresh();

        this.imgPions = []; 
        this.chargerImagesPions();
    }

    /**
     *  Afficher le plateau de jeu sur le canvas
     */
    afficherPlateauJeu(imagePlateau) {
        if (this.imagePlateau.complete) {
         this.ctx.drawImage(imagePlateau, 0, 0, this.dimensionPlateauJeu, this.dimensionPlateauJeu);
        }
    }

    /**
     * Charger les images des pions des joueurs dans le tableau imgPions
     */
    chargerImagesPions() {
        let joueurs = this.jeu.getJoueurs(); //joueurs[]

        for (let i = 0; i < joueurs.length; i++) {
            const image = new Image();
            image.src = joueurs[i].pion.image; 
            image.onload = () => this.refresh(); //pion1 arrive: on redessine plateau + pion1 
            this.imgPions.push(image);
        }
    }

    /**
     * Afficher les pions des joueurs sur le plateau de jeu 
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
     */
    afficherPionsJoueurs() {
        const joueurs = this.jeu.getJoueurs();
        const tailleCase = this.dimensionPlateauJeu / 13; //13x13

        for (let i = 0; i < joueurs.length; i++) {
            const imagePion = this.imgPions[i];

            if (imagePion && imagePion.complete) {
                const x = (joueurs[i].position % 13) * tailleCase; 
                const y = Math.floor(joueurs[i].position / 13) * tailleCase;
                this.ctx.drawImage(imagePion, x, y, 40, 40);
            }
        }
    }
      
    /**
     * Rafraîchir l'affichage du plateau de jeu et des pions des joueurs    
     */
    refresh() {
        this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
        this.afficherPlateauJeu(this.imagePlateau); // plateau jeu
        this.afficherPionsJoueurs(); //pions par-dessus
    }

}

export default View; 

// afficher les pions images selon la position du joeurus (position du joueur) largeur /13 (joueur.avancer(), joueur.position, view.refresgh() )