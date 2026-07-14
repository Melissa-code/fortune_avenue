import { log } from '../../logger.js';

class Banque {
    constructor() {
        this.nom = "la banque"; 
        this.argent = 14640; 
        this.maisons = 32;
        this.hotels = 12; 
        this.proprietes = 28; 
    }

    payer(montant) { 
        if (typeof montant !== 'number' || montant < 0) {
            log(`Le montant ${montant} M est invalide : il doit être un nombre positif.`);
            return;
        }

        if (this.argent < montant) {
            log("La banque est en faillite !");
            montant = this.argent; // ce qui reste 
        }

        this.argent -= montant;
    }

    recevoir(montant) {
        this.argent += montant; 
    }
}

export default Banque; 