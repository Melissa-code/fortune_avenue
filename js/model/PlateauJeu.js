import CaseJeuFactory from "./CaseJeuFactory.js";

class PlateauJeu {

    constructor() {
        this.width = 11; 
        this.matrice = this.initialiserMatrice();
        this.casesJeu = [];  //40 de 0 à 39
    }

    /**
     * return matrice: cases du jeu 1 sinon 0 pour l'affichage 
     */
    initialiserMatrice() {
        const matrice = []; 

        for (let y = 0; y < this.width; y++) {
            const casesJeu = []; 

            for (let x = 0; x < this.width; x++) {
                if (y === 0 || y === 11) {
                    casesJeu.push(1); 
                }
                else if (x === 0 || x === 11) {
                    casesJeu.push(1); 
                }
                else {
                    casesJeu.push(0); 
                }
            }
            matrice.push(casesJeu);
        }


        return matrice; 
    }

    /**
     * 
     */
    async chargerDataCasesJeu(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des données du jeu (fichier JSON): ${response.status}`);
            }

            const data = await response.json();
            this.casesJeu = [];

            // parcours du json data 
            for (const caseDataJeu of data.casesJeu) {
                const caseObjet = CaseJeuFactory.createCase(caseDataJeu); 
                this.casesJeu.push(caseObjet); 
            }

        } catch (error) {
            console.error(error);
        }
    }

    getCaseJeu(numero) {
        return this.cases[numero];
    }
}

export default PlateauJeu; 