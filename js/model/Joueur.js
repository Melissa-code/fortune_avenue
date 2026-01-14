import PionsDisponibles from './enums/PionsDisponibles.js'; 

class Joueur {

    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.argent = argent;
        this.position = 0; 
        this.estEnPrison = false; 
        this.carteSortiePrison = 0; 
        this.compteurPourSortirPrison = 0; // ap 3 tours
    }

    avancer(position) {
        // si la nouvelle position traverse la case de depart % a la position d'avant
        // et que l'ancienne position n'etais pas la prison alors crediter 200
        // sinon this.aTraverserDepart==false;
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

    recevoir(montant) {
        this.argent += montant; 
        console.log(`Le joueur reçoit ${montant}. Nouveau solde : ${this.argent}`);
    }

    payer(montant) {
        this.argent -= montant;
        console.log(`Le joueur paie ${montant}. Nouveau solde : ${this.argent}`);
    }

    // acheterPropriete(propriete) {

    // }

    acheterCartePrisonAdversaire() {
        
    }
}

export default Joueur; 