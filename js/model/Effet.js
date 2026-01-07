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
    constructor(indexCase = null, nombreDePas = 0, bonusDePassage = null) {
        super(); 
        this.indexCase = indexCase;
        this.nombreDePas = nombreDePas; 
        this.bonusDePassage = bonusDePassage;
    }

    appliquer(joueur, plateauJeu) {
        joueur.deplacer(this.indexCase, this.nombreDePas);
        // si bonus de passage 
        if (this.bonusDePassage) {
        joueur.recevoir(this.bonusDePassage);
    }
        
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
        if (this.source === "joueur" && this.destination === "banque") {
            joueur.payer(this.montant);
        } else if (this.source === "banque" && this.destination === "joueur") {
            joueur.recevoir(this.montant);
        }
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

/**
 * Pioche une carte dans la pioche chance ou fonds commun
 */
export class PiocheEffet extends Effet {
    constructor(typePioche) {
        super();
        this.typePioche = typePioche; 
    }

    appliquer(joueur, plateauJeu) {
        //  piocher une carte de la pioche et l'excuter
    }
}