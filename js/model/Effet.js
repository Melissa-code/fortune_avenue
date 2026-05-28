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
        const AnciennePosition = jeu.casesJeu[joueur.getPosition()].nom;
        let messages = [];
        
        if (this.typeDeplacement === 'absolu') joueur.avancer(this.valeurDeplacement); // index de la case
        else joueur.avancer(joueur.getPosition() + this.valeurDeplacement); //ou nb de pas 
        // si bonus de passage 
        const NouvellePosition =  jeu.casesJeu[joueur.getPosition()].nom;
        messages.push("Le joueur, " + joueur.nom + "s'est déplacé de la case " + AnciennePosition + " à la case " + NouvellePosition);
        if (this.bonusDePassage) {
            joueur.recevoir(this.bonusDePassage);
            messages.push("Le joueur, " + joueur.nom + "a reçu un bonus de passage de " + this.bonusDePassage);
        }
        return messages;
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
        let messages = []; 
        // console.log("EFFET", this.montant, this.source, this.destinataire, this.estCollectif)
        // console.log("debug effet", this.source, this.destinataire, joueur, banque)

        // 1- joueur paie banque (achat/taxe) - attention string != obj
        if (this.source === "joueur" && this.destinataire === "banque") {
            joueur.payer(this.montant);
            banque.recevoir(this.montant);
            // console.log("Taxe payée:", this.montant, "- Nouveau solde du joueur:", joueur.argent);
            messages.push("Taxe payée: Le joueur, " + joueur.nom + " a payé " + this.montant + " à la banque.");
        }

        else if (this.source === "banque" && this.destinataire === "joueur") {
            joueur.recevoir(this.montant); 
            // console.log("Le joueur a recu de la banque : ", this.montant);
            messages.push("Le joueur, " + joueur.nom + "a reçu " + this.montant + " de la banque");

        // 2- autres joueurs paient joueur courant (carte anniversaire)
        } else if (this.estCollectif) {
            let tousLesJoueurs = jeu.getJoueurs(); 
            for (let joueurAdverse of tousLesJoueurs) {
                if (joueurAdverse !== joueur) {
                    joueurAdverse.payer(this.montant);
                    joueur.recevoir(this.montant); 
                    messages.push("Le joueur, " + joueur.nom + "a reçu " + this.montant + " de " + joueurAdverse.nom);
                }
            }
            console.log("argent du joueur ap recevoir argent: ", joueur.argent)

        } else if (this.source instanceof Joueur && this.destinataire instanceof Banque) {
            console.log('EFFET APPLIQUE')
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            messages.push("Le joueur, " + this.destinataire.nom + "a reçu " + this.montant + " de " + this.source.nom);
   
       
        } else if (this.source instanceof Joueur && this.destinataire instanceof Joueur) {
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            messages.push("Le joueur, " + this.destinataire.nom + "a reçu " + this.montant + " de " + this.source.nom);
   
         // 3- banque paie joueur (case départ/gain)
        } else if (this.source instanceof Banque && this.destinataire instanceof Joueur) {
            joueur.recevoir(this.montant);
            // console.log("argent du joueur ap recevoir argent: ", joueur.argent)
            messages.push("Le joueur, " + joueur.nom + "a reçu " + this.montant + " de la banque")
        }
        return messages;
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
        let messages = [];
        console.log("joueur en prison" ,joueur)

        if (this.allerEnPrison) {
            console.log("en prison ")
            joueur.position = 10; 
            joueur.estEnPrison = true; 
            messages.push("Le joueur " + joueur.nom + " est envoyé en prison");
        } else {
            console.log("pas en prison")
            joueur.estEnPrison = false; 
            messages.push("Le joueur " + joueur.nom + " est libéré de prison");
        }
        return messages;
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
        let messages = [];

        if (this.typePioche === TypesCases.CHANCE) {
            carteTiree = jeu.piocheChance.shift();
            console.log('carte ', carteTiree.titre)
            jeu.piocheChance.push(carteTiree); 
            messages.push("Le joueur " + joueur.nom + " a pioché la carte: " + carteTiree.titre);
            messages.push("Description de la carte: " + carteTiree.description);
        } else if (this.typePioche === TypesCases.FONDS_COMMUNS) {
            carteTiree = jeu.piocheFondsCommun.shift();
            console.log('carte ', carteTiree.titre, carteTiree.description)
            jeu.piocheFondsCommun.push(carteTiree.titre)
            messages.push("Le joueur " + joueur.nom + " a pioché la carte " + carteTiree.titre);
            messages.push(`"${carteTiree.description}"`);
        }
        return messages;
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