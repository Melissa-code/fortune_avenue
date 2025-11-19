export class Carte {
    constructor(titre) {
        this.titre = titre; 
    }

    executer(joueur, plateauJeu)
    {

    }
}



export class CarteAction extends Carte {
    constructor(titre) {
        super(titre); 
        this.effets = [];
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    executer(joueur,plateauJeu)
    {
        for (let effet of this.effets) {
            effet.appliquer(joueur, plateauJeu)
        }
    }
}


export class Effet {
    //classe abstraite modele pour classefille, polymorphisme
    appliquer(joueur, plateauJeu) {
        // surcharger la methd 
    }
}

// nombre de pas ( + ou negatif)
// bonus de passage
export class DeplacementEffet extends Effet {
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
export class VersementEffet extends Effet {
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
export class PrisonEffet extends Effet {
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


export class CarteImmobiliere extends Carte {
    constructor(titre, prixAchat, loyers, prixHypotheque) {
        super(titre);  
        this.prixAchat = prixAchat; 
        this.loyers = loyers; 
        this.prixHypotheque = prixHypotheque;
        this.proprietaire = null;
        this.hypothequee = false;
    }

    calculerLoyer(plateauJeu)
    {
        return this.loyers;
    }

    executer(joueur,plateauJeu)
    {
        // tester dans plateauJeu si elle disponible ou possedee
        // si possedee, alors payer un loyer a son proprietaire
        // sinon, proposer de l'acheter
    }
}

export class CarteRue extends CarteImmobiliere {
    constructor(titre, couleur, prixAchat, loyers, prixHypotheque, prixMaison, prixHotel) {
        super(titre, prixAchat, loyers, prixHypotheque);
        this.couleur = couleur;
        this.prixMaison = prixMaison; 
        this.prixHotel = prixHotel;
    }
}

export class CarteGare extends CarteImmobiliere {
    constructor(titre, prixAchat, loyers, prixHypotheque) {
        super(titre, prixAchat, loyers, prixHypotheque);
    }
}

export class CarteSociete extends CarteImmobiliere {
    constructor(titre, prixAchat, prixHypotheque) {
        super( titre, prixAchat, prixHypotheque);
    }
}

// faire PlateauJeu
// Joueur