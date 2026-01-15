

class Joueur {
    constructor(nom, pion, argent = 1500) {
        this.nom = nom;
        this.pion = pion; //img
        this.argent = argent;
        this.position = 0; 
        this.estEnPrison = false; 
        this.carteSortiePrison = 0; 
        this.compteurPourSortirPrison = 0; // ap 3 tours
        this.aTraverseCaseDepart = false; 
    }

    gererArrivee(anciennePosition) {
        if (this.position === 30) {
            this.allerEnPrison();
            this.aTraverseCaseDepart = false;
        } else if (this.position < anciennePosition) {
            this.recevoir(200);
            this.aTraverseCaseDepart = true;
        } else {
            this.aTraverseCaseDepart = false;
        }
    }

    avancer(nombreDePas) {
        const anciennePosition = this.position; 
        this.position = (this.position + nombreDePas) % 40; //repart après 40
        this.gererArrivee(anciennePosition);
    }

    // si la nouvelle position traverse la case de depart % a la position d'avant
    // et que l'ancienne position n'etais pas la prison alors crediter 200
    allerDirectementSurCase(position) {
        const anciennePosition = this.position; 
        this.position = position; 
        this.gererArrivee(anciennePosition);
    }

    allerEnPrison() {
        console.log(`Le joueur ${this.nom} est envoyé en prison !`);
        this.position = 10; // coincé en prison 
        this.estEnPrison = true; 
    }

    reculer(nombreDePas) {
        anciennePosition = this.position; 
        this.position = (anciennePosition - nombreDePas +40) % 40; //+40: tour complet pas de nb neg et %40: ne pas depasser 40 cases

        if (this.position === 30) {
            this.allerEnPrison();
        }
        this.aTraverseCaseDepart = false;
    }

    passerSonTour() {

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