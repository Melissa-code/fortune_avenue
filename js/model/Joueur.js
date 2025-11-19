import PionsDisponibles from './PionsDisponibles.js'; 

class Joueur {

    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion;
        this.argent = argent;
        this.position = 0; 
        this.proprietes = []; 
        this.etreEnPrison = false; 

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

    payerArgent(montant) {

    }

    acheterPropriete(propriete) {

    }

    payerLoyer(joueurAdv, montant) {

    }
}

export default Joueur; 