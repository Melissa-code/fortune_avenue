class Banque {
    constructor() {
        this.argent = 14640; 
        this.maisons = 32;
        this.hotels = 12; 
        this.proprietes = 28; 
    }

    payer(joueur, montant) { 
        if (this.argent < montant) {
            console.log("La banque est en faillite !");
            montant = this.argent;// ce qui reste 
        }

        this.argent -= montant;
        joueur.recevoirArgent(montant); 
    }

    encaisser(joueur, montant) { 
        if (joueur.argent < montant) {
            console.log("Le joueur est en faillite !");
            montant = joueur.argent;
        }
        joueur.payer(montant);
        this.argent += montant; 
    }

    vendreMaisonHotel(typePropriete, joueur, prixAchat) {
        let stock;

        if (typePropriete === "maison") stock = this.maisons;
        else if (typePropriete === "hotel") stock = this.hotels;
        else return;

        if (stock <= 0) {
            console.log("Tous ces types de propriétés ont déjà été vendus . Il n'en reste plus.");
            return;
        }

        // paiement
        joueur.payer(prixAchat); 
        this.argent += prixAchat;

        if (typePropriete === "maison") this.maisons -= 1;
        else this.hotels -= 1;
    }

    vendrePropriete(propriete, joueur, prixAchat) {
        if (this.proprietes <= 0) return;
    
        joueur.payer(prixAchat); 
        this.argent += prixAchat;
        this.proprietes -= 1;
    }
}

export default Banque; 