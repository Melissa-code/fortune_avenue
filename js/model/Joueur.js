import { CaseRue } from './CaseJeu.js';
import { log } from '../../logger.js';

class Joueur {
    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.position = 0; 
        this.argent = argent;
        this.proprietes = [];
        this.estEnPrison = false; 
        this.carteChanceSortiePrison = false; // carte chance n°9/fonds communn°5 (2 dans le jeu)
        this.carteFondsCommunsSortiePrison = false;
        this.compteurPourSortirPrison = 0; // après 3 tours
        this.aTraverseCaseDepart = false; 
    }

    /**
     * traverse la case départ: joueur reçoit 200M ou non 
     * ne gère pas arrivée sur case départ (carte chance/fonds communs)
     */
    gererArriveeSurCase(anciennePosition, estDerriere = false) {
        if (!estDerriere && 
            this.position < anciennePosition && 
            this.position !== 0
        ) {
            this.aTraverseCaseDepart = true;
        } else {
            this.aTraverseCaseDepart = false;
        }
    }

    avancer(typeDeplacement, valeurDeplacement) {
        const anciennePosition = this.position;

        if (typeDeplacement === 'absolu') {
            const nouvellePosition = valeurDeplacement; // index case 
            this.position = nouvellePosition;
            this.gererArriveeSurCase(anciennePosition, false);
        // relatif 
        } else {
            const nouvellePosition = (this.position + valeurDeplacement + 40) % 40; // repart après 40 => 0
            const estDerriere = valeurDeplacement < 0;
            this.position = nouvellePosition;
            this.gererArriveeSurCase(anciennePosition, estDerriere);
        }
    }

    recevoir(montant) {
        if (typeof montant !== 'number' || montant < 0) {
            log(`Recevoir: montant ${montant} M est invalide : il doit être un nombre positif.`);
            return;
        }
        this.argent += montant; 
    }

    payer(montant) {
        if (typeof montant !== 'number' || montant < 0) {
            log(`Payer: montant ${montant} M est invalide : il doit être un nombre positif.`);
            return;
        }
        this.argent -= montant;
    }

    /* 
    * calcule et retourne nb total de maisons et hôtels possédés par le joueur
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