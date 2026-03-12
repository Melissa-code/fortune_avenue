import Joueur from "./Joueur.js"; 
import Banque from "./Banque.js";

/**
 * classe abstraite modele pour classefille, polymorphisme
 */
export class Effet {
    appliquer(joueur = null, jeu = null, banque = null) {
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

    appliquer(joueur, jeu = null, banque = null) {
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
    constructor(montant, source, destinataire, estCollectif = false) {
        super(); 
        this.montant = montant; 
        this.source = source; 
        this.destinataire = destinataire; 
        this.estCollectif = estCollectif; // si plusieurs joueurs ou non
    }

    appliquer(joueur, jeu = null, banque = null) {
        console.log("Paiement de ",this.montant, " de ", this.source.nom, "vers", this.destinataire.nom);

        // 1- joueur paie banque (achat/taxe)
        if (this.source instanceof Joueur && this.destinataire instanceof Banque) {
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            console.log("argent du joueur apres paiement: ", this.source.argent)

        // 2- autres joueurs paient joueur courant (carte anniversaire)
        } else if (this.estCollectif) {
            let tousLesJoueurs = jeu.getJoueurs(); 
            for (let joueurAdverse of tousLesJoueurs) {
                if (joueurAdverse !== joueur) {
                    joueurAdverse.payer(this.montant);
                    joueur.recevoir(this.montant); 
                }
            }
            console.log("argent du joueur ap recevoir argent: ", joueur.argent)

        // 3- banque paie joueur (case départ/gain)
        } else if (this.source instanceof Banque && this.destinataire instanceof Joueur) {
            joueur.recevoir(this.montant);
            console.log("argent du joueur ap recevoir argent: ", joueur.argent)
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

    appliquer(joueur, jeu = null, banque = null) {
        if (this.allerEnPrison) {
            joueur.position = 10; 
            joueur.estEnPrison = true; 
        } else {
            joueur.estEnPrison = false; 
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

    appliquer(joueur, jeu = null, banque = null) {
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

    appliquer(joueur, jeu = null, banque = null) {
        let totalMaison = 0; 
        let totalHotel = 0;

        // faire boucle sur toutes les cases
        // check si c'est une rue et si le proprietaire est le joueur


        // calculer le total des maisons et hotels
        // puis payer le total
    }
}