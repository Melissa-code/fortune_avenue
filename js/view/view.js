

class View {
    constructor(jeu, document, largeur, hauteur) {
        this.jeu = jeu;
        this.largeur = largeur;
        this.hauteur = hauteur;
        this.myCanva = document.querySelector("#board-canvas");
        this.ctx = this.myCanva.getContext("2d");

        this.pionsImg = []; 

        this.chargerImagePlateauJeu() ;
        this.chargerImagePions();
    }

    chargerImagePlateauJeu() {
        const image = new Image();
        image.addEventListener("load", () => {
            this.ctx.drawImage(
                image, 
                0, 
                0, 
                this.largeur, 
                this.hauteur
            );
        }, false);
        image.src = './images/gameboard_v2.svg'; 

    }

    chargerImagePions() {
        console.log(this.jeu)
        let joueurs = this.jeu.getJoueurs(); //[]
        console.log(this.jeu)
        for (let i = 0; i < joueurs.length; i++) {
            const image = new Image();
            image.addEventListener("load", () => {
            this.ctx.drawImage(
                image, 
                0, 
                0, 
                20, 
                20
            );
        }, false);
        image.src = joueurs[i].pion.image; 
        this.pionsImg.push(image)
        }
    }


}

export default View; 

// afficher les pions images selon la position du joeurus (position du joueur) largeur /13