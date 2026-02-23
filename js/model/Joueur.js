import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'; 

class Joueur {
    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.position = 0; 
        this.argent = argent;
        this.proprietes = [];
        this.estEnPrison = false; 
        this.carteSortiePrison = 0; 
        this.compteurPourSortirPrison = 0; // ap 3 tours
        this.aTraverseCaseDepart = false; 
    }

    gererArriveeSurCase(anciennePosition) {
        if (this.position < anciennePosition) {
            this.recevoir(200);
            this.aTraverseCaseDepart = true;
        } else {
            this.aTraverseCaseDepart = false;
        }
    }

    avancer(typeDeplacement, valeurDeplacement, bonusDePassage = 0) {
        const anciennePosition = this.position; 

        if (typeDeplacement === 'absolu') {
            this.position = valeurDeplacement; // index case 
            this.gererArriveeSurCase(anciennePosition);
        } else {
            this.position = (this.position + valeurDeplacement) % 40; //repart après 40
            this.gererArriveeSurCase(anciennePosition);
        }

        if (bonusDePassage !== 0) {
            this.recevoir(bonusDePassage);
        }
    }

    passerSonTour() {

    }

    recevoir(montant) {
        this.argent += montant; 
        console.log(`Le joueur reçoit ${montant}. Nouveau solde : ${this.argent}`);
    }

    payer(montant) {
        this.argent -= montant;
        console.log(`Le joueur paie ${montant}. Nouveau solde : ${this.argent}`);
    }

    acheterCartePrisonAdversaire() {
        
    }
}

export default Joueur; 