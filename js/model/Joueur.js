import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'; 

class Joueur {
    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.position = 0; 
        this.argent = argent;
        this.proprietes = [];
        this.estEnPrison = false; 
        this.carteChanceSortiePrison = false; //carte chance n°9 et carte fonds communn°5 (2 dans le jeu)
        this.carteFondsCommunsSortiePrison = false;
        this.compteurPourSortirPrison = 0; // ap 3 tours
        this.aTraverseCaseDepart = false; 
    }

    /**
     * traverse case départ: joueur reçoit 200M ou non 
     */
    gererArriveeSurCase(anciennePosition, estDerriere = false) {
        if (!estDerriere && this.position < anciennePosition && this.position !== 0) {
            this.aTraverseCaseDepart = true;
        } else {
            this.aTraverseCaseDepart = false;
        }
    }

    avancer(typeDeplacement, valeurDeplacement, bonusDePassage = 0) {
        if (typeDeplacement === 'absolu') {
            const nouvellePosition = valeurDeplacement; // index case 
            this.#seDeplacer(nouvellePosition, false, bonusDePassage);
        // relatif 
        } else {
            const nouvellePosition = (this.position + valeurDeplacement + 40) % 40; //repart après 40
            const estDerriere = valeurDeplacement < 0;
            this.#seDeplacer(nouvellePosition, estDerriere, bonusDePassage);
        }
    }

    #seDeplacer(nouvellePosition, estDerriere, bonusDePassage) {
        const anciennePosition = this.position;
        this.position = nouvellePosition;
        this.gererArriveeSurCase(anciennePosition, estDerriere);
    }

    recevoir(montant) {
        this.argent += montant; 
        console.log(`Le joueur reçoit ${montant}. Nouveau solde : ${this.argent}`);
    }

    payer(montant) {
        this.argent -= montant;
        console.log(`Le joueur paie ${montant}. Nouveau solde : ${this.argent}`);
    }

    /* 
    * calculer le nombre total de maisons et d'hôtels possédés par le joueur
    */
    calculerTotalMaisonsHotels() {
        let totalMaisons = 0;
        let totalHotels = 0;

        for (let propriete of this.proprietes) {
            if (propriete instanceof CaseRue) {
                totalMaisons += propriete.nombreMaisons;
                totalHotels += propriete.nombreHotels;
            }
        }
    
        return [totalMaisons, totalHotels];
    }
}

export default Joueur; 