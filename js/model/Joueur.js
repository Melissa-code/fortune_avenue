import PionsDisponibles from './enums/PionsDisponibles.js'; 

class Joueur {

    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.argent = argent;
        this.position = 0; 
        this.etreEnPrison = false; 
        this.carteSortiePrison = 0; 
        this.compteurPourSortirPrison = 0; // ap 3 tours
    }

    avancer(nombreCases) {

    }

    reculer(nombreCases) {

    }

    allerDirectementSurCase(caseDestination) {

    }

    passerSonTour() {

    }

    allerEnPrison() {

    }

    sortirDePrison() {
        
    }

    recevoirArgent(montant) {

    }

    payer(montant) {

    }

    // acheterPropriete(propriete) {

    // }

    acheterCartePrisonAdversaire() {
        
    }
}

export default Joueur; 