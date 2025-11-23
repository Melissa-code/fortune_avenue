/**
 * classe abstraite modele pour classefille, polymorphisme
 */
export class Effet {
    appliquer(joueur, plateauJeu) {
        // surcharger la methd 
    }
}

/**
 * nombre de pas ( + ou negatif)
 * bonus de passage
 */
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

/**
 * montant, source(banque/joueur), destinationbanque/joueur)
 */
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

/**
 * Entree/Sortie
 */
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
