/**
 * classe abstraite modele pour classefille, polymorphisme
 */
export class Effet {
    appliquer(joueur=null, jeu=null) {
        // surcharger la methd 
    }
}

/**
 * type de deplacement: absolu (index case) ou relatif (nb de pas/N° sur dé)
 * valeur de deplacement: index case ou nb de pas
 * bonus de passage
 */
export class DeplacementEffet extends Effet {
    constructor(typeDeplacement, valeurDeplacement, bonusDePassage = 0) {
        super(); 
        this.typeDeplacement = typeDeplacement;
        this.valeurDeplacement = valeurDeplacement; 
        this.bonusDePassage = bonusDePassage;
    }

    appliquer(joueur) {
        if (this.typeDeplacement === 'absolu') joueur.avancer(this.valeurDeplacement); // index de la case
        else joueur.avancer(joueur.getPosition() + this.valeurDeplacement); //ou nb de pas 
        // si bonus de passage 
        if (this.bonusDePassage) joueur.recevoir(this.bonusDePassage);
    }
}

/**
 * montant, source(banque/joueur), destinationbanque/joueur)
 */
export class VersementEffet extends Effet {
    constructor(montant, source, destinataire) {
        super(); 
        this.montant = montant; 
        this.source = source; 
        this.destinataire = destinataire; 
    }

    appliquer(joueur, jeu) {
        // si dest === joueur alors joueur.recevoir(sommeArgent)
        if (this.source === "joueur" && this.destinataire === "banque") {
            joueur.payer(this.montant);
        } else if (this.source === "joueurs" && this.destinataire === "joueur") {
            let joueurs = jeu.getJoueurs(); 
            for (autreJoueur of joueurs) {
                if (autreJoueur !== joueur) {
                    autreJoueur.payer(this.montant);
                    joueur.recevoir(this.montant); 
                }
            }
        } else if (this.source === "banque" && this.destinataire === "joueur") {
            joueur.recevoir(this.montant);
        }
    }
}

/**
 * Entree/Sortie: TODO VOIR TESTER
 * - déplacement du joueur en prison
 * - joueur.estEnPrison = true/false
 */
export class PrisonEffet extends Effet {
    constructor(allerEnPrison) {
        super(); 
        this.allerEnPrison = allerEnPrison; //bool 
    }

    appliquer(joueur) {
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
        this.typePioche = typePioche; // chance/fonds_commmun 
    }

    appliquer(joueur, jeu) {
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

    appliquer(joueur, jeu) {
        let totalMaison = 0; 
        let totalHotel = 0;

        // faire boucle sur toutes les cases
        // check si c'est une rue et si le proprietaire est le joueur


        // calculer le total des maisons et hotels
        // puis payer le total
    }
}