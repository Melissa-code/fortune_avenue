import De from '../model/De.js';

class View {

    static IMG_PLATEAU_JEU = './images/gameboard_v2.svg';

    constructor(jeu, document, dimensionPlateauJeu) { //650
        this.jeu = jeu;
        this.dimensionPlateauJeu = dimensionPlateauJeu;
        this.myCanvas = document.querySelector("#game-canvas");
        this.ctx = this.myCanvas.getContext("2d");

        this.imagePlateau = new Image(); //chargé une seule fois (+rapide)
        this.imagePlateau.src = View.IMG_PLATEAU_JEU;
        this.imagePlateau.onload = () => this.refresh();

        this.imgPions = []; 
        this.chargerImagesPions();

        this.imageDe = new Image();
        this.imageDe.src = './images/de.png'; 
        console.log(this.imageDe.src)

        this.imageDe.onload = () => {
            if (this.imageDe.complete) {
                this.ctx.drawImage(this.imageDe, 680, 0, this.dimensionPlateauJeu/10, this.dimensionPlateauJeu/10);
            }
        }
    }

    /**
     *  Afficher le plateau de jeu sur le canvas
     */
    afficherPlateauJeu(imagePlateau) {
        if (this.imagePlateau.complete) {
         this.ctx.drawImage(imagePlateau, 0, 0, this.dimensionPlateauJeu, this.dimensionPlateauJeu);
        }
    }

    identifierCible(x, y) {
        if (x === 680 && y === 0) {
            return new De(2);
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
     * 0 à 12 cases par côté => dimensionPlateauJeu / 13 = unité de déplacement
     */
    afficherPionsJoueurs() {
        const joueurs = this.jeu.getJoueurs();
        const unite = this.dimensionPlateauJeu / 13; // unite case: 2 + 9 + 2 
        const taillePion = 40;

        for (let i = 0; i < joueurs.length; i++) {
            const imagePion = this.imgPions[i];
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
                    y= (21 - positionJoueur) * unite;
                }

                //haut (21->30) Y est fixe X change (1re case 21-2=19)
                else if (positionJoueur > 20 && positionJoueur <= 30) {
                    x = (positionJoueur - 19) * unite
                    y = 0 * unite;
                }

                //droite (31->39) X est fixe Y change (1re case 31-2=29)
                else {
                    x = 11 * unite;
                    y = (positionJoueur - 29) * unite
                }

                this.ctx.drawImage(imagePion, x, y, taillePion, taillePion);
            }
        }
    }
      
    /**
     * Rafraîchir l'affichage du plateau de jeu et des pions des joueurs    
     */
    refresh() {
        // this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);

        this.afficherPlateauJeu(this.imagePlateau); // plateau jeu
        this.afficherPionsJoueurs(); //pions par-dessus
    }

}

export default View; 

// afficher les pions images selon la position du joeurus (position du joueur) largeur /13 (joueur.avancer(), joueur.position, view.refresgh() )