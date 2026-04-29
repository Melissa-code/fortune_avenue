import Joueur from "./Joueur.js"; 
import Banque from "./Banque.js";
import TypesCases from "./enums/TypesCases.js";

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

    // verifier 
    appliquer(joueur, jeu = null, banque = null) {
        if (this.typeDeplacement === 'absolu') joueur.avancer(this.valeurDeplacement); // index de la case
        else joueur.avancer(joueur.getPosition() + this.valeurDeplacement); //ou nb de pas 
        // si bonus de passage 
        if (this.bonusDePassage) joueur.recevoir(this.bonusDePassage);

        return null; 
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
        // 1- joueur paie banque (achat/taxe) - attention string != obj
        if (this.source === "joueur" && this.destinataire === "banque") {
            joueur.payer(this.montant);
            banque.recevoir(this.montant);
            console.log("Taxe payée:", this.montant, "- Nouveau solde du joueur:", joueur.argent);
            return { type: 'message', texte: `le joueur ${joueur.nom} paye ${this.montant}€ à la banque.` };
        }

        else if (this.source === "banque" && this.destinataire === "joueur") {
            joueur.recevoir(this.montant); 
            console.log("Le joueur a recu de la banque : ", this.montant);
            return { type: 'message', texte: `le joueur ${joueur.nom} reçoit ${this.montant}€ de la banque.` };
      
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
            return { type: 'message', texte: `Tous les joueurs versent chacun ${this.montant}€ au joueur ${joueur.nom}.` };

        } else if (this.source instanceof Joueur && this.destinataire instanceof Joueur) {
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            return { type: 'message', texte: `le joueur ${this.source.nom} paye ${this.montant}€ au joueur ${this.destinataire.nom}.` };

        // 3- banque paie joueur (case départ/gain)
        } else if (this.source instanceof Banque && this.destinataire instanceof Joueur) {
            joueur.recevoir(this.montant);
            console.log("argent du joueur ap recevoir argent: ", joueur.argent)
            return { type: 'message', texte: `${joueur.nom} reçoit ${this.montant}€ de la banque.` };
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
        console.log("joueur en prison" ,joueur)
        if (this.allerEnPrison) {
            console.log("en prison ")
            joueur.position = 10; 
            joueur.estEnPrison = true; 
        } else {
            console.log("pas en prison")
            joueur.estEnPrison = false; 
        }
        return null; 
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
        let carteTiree ; 

        if (this.typePioche === TypesCases.CHANCE) {
            carteTiree = jeu.piocheChance.shift();
            console.log('carte ', carteTiree.titre)
            jeu.piocheChance.push(carteTiree); 
        } else if (this.typePioche === TypesCases.FONDS_COMMUNS) {
            carteTiree = jeu.piocheFondsCommun.shift();
            console.log('carte ', carteTiree);
            jeu.piocheFondsCommun.push(carteTiree.titre);
        }
        
        return carteTiree.executer(joueur, jeu, banque);
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