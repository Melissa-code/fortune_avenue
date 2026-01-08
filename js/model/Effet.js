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
        }
    }
}

export class SortirDePrisonEffet extends Effet {
    constructor() {
        super();
    }

    appliquer(joueur, plateauJeu) {
        //carte au joueur
        joueur.ajouterCarteSortiePrison(); 
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

/**
 * Paiement réparations maisons/hôtels
 */
export class ReparationsEffet extends Effet {       
    constructor(montantParMaison, montantParHotel) {
        super();
        this.montantParMaison = montantParMaison;
        this.montantParHotel = montantParHotel;
    }

    appliquer(joueur, plateauJeu) {
        let totalMaison = 0; 
        let totalHotel = 0;

        // faire boucle sur toutes les cases
        // check si c'est une rue et si le proprietaire est le joueur


        // calculer le total des maisons et hotels
        // puis payer le total
    }
}