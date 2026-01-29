

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

    gererArriveeSurCase(anciennePosition) {
        // case "allez en prison" 
        if (this.position === 30) {
            this.allerEnPrison();
            this.aTraverseCaseDepart = false;
            return;
        } 
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

    allerEnPrison() {
        console.log(`Le joueur ${this.nom} est envoyé en prison !`);
        this.position = 10; // coincé en prison 
        this.estEnPrison = true; 
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