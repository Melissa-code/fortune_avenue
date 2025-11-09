class Carte {
    constructor(category) {
        this.category = category; 
    }
}

class CarteAction extends Carte {
    constructor(type) {
        super("action"); 
        this.type = type; 
        this.effets = [];
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }
}

class Effet {
    //classe abstraite (modele pour classefille, polymorphisme)
    appliquer(joueur, plateauJeu) {
        // surcharger la methd 
    }
}

// nombre de pas ( + ou negatif)
// bonus de passage
class DeplacementEffet extends Effet {
    constructor(nombreDePas, bonusDePassage = null) {
        super(); 
        this.nombreDePas = nombreDePas; 
        this.bonusDePassage = bonusDePassage;
    }

    appliquer(joueur, plateauJeu) {
        joueur.deplacer(this.nombreDePas);
        // si bonus de passage et passe par case départ joueur.recevoirAregnt(bonus de passage)
        
    }
}

// montant, source(banque/joueur), destinationbanque/joueur)
class VersementEffet extends Effet {
    constructor(montant, source, destination) {
        super(); 
        this.montant = montant; 
        this.source = source; 
        this.destination = destination; 
    }

    appliquer(joueur, plateauJeu) {
        // si dest === joueur alors joueur.recevoir(sommeArgent)
        // si source === joueur alors joueur.payer(sommeArgent)
    }
}

// Entree/Sortie
class PrisonEffet extends Effet {
    constructor(allerEnPrison) {
        super(); 
        this.allerEnPrison = allerEnPrison; 
    }

    appliquer(joueur, plateauJeu) {
        if (this.allerEnPrison) {
            joueur.allerEnPrison();
        } else {
            joueur.sortirDePrison();
        }
    }
}


class CarteImmobiliere extends Carte {
    constructor(type, titre, couleur = null, prixAchat, loyers, prixHypotheque) {
        super("immobiliere"); 
        this.type = type;  
        this.titre = titre; 
        this.couleur = couleur;
        this.prixAchat = prixAchat; 
        this.loyers = loyers; 
        this.prixHypotheque = prixHypotheque;
        this.proprietaire = null;
        this.hypothequee = false;
    }
}

class CarteRue extends CarteImmobiliere {
    constructor(titre, prixAchat, loyers, prixHypotheque, couleur, prixMaison, prixHotel) {
        super("rue", titre, prixAchat, loyers, prixHypotheque, couleur);
        this.prixMaison = prixMaison; 
        this.prixHotel = prixHotel;
        this.nbMaisons = 0;
    }
}

class CarteGare extends CarteImmobiliere {
    constructor(titre, prixAchat, loyers, prixHypotheque) {
        super("gare", titre, prixAchat, loyers, prixHypotheque);
    }
}

class CarteSociete extends CarteImmobiliere {
    constructor(titre, prixAchat, prixHypotheque) {
        super("societe", titre, prixAchat, [4, 10], prixHypotheque);
    }
}
