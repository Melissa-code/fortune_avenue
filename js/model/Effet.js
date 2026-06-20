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

    appliquer(joueur, jeu = null) {
        let messages = []; 
        let banque = jeu.banque;
        
        // 1- joueur paie banque (achat/taxe) - attention string != obj
        if (this.source === "joueur" && this.destinataire === "banque") {
            console.log("joueur: ", joueur.nom, " - banque: ", banque.nom, " - montant: ", this.montant)
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
            console.log('EFFET VERSEMENT dest est la banque !')
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            console.log("proprietes du joueuur :", joueur.proprietes)
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

        if (this.allerEnPrison) {
            joueur.position = 10; 
            joueur.estEnPrison = true; 
            messages.push(`${joueur.nom} est envoyé en prison.`);
        } else {
            if (joueur.estEnPrison) {
                joueur.estEnPrison = false; 
                messages.push(`${joueur.nom} est libéré de prison.`);
            } else {
                // visite (ex: case départ -> direct case 10)
                messages.push(`Prison: ${joueur.nom} est en simple visite.`);
            }
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
            jeu.piocheChance.push(carteTiree); 
            messages.push(joueur.nom + " a pioché la carte " + carteTiree.titre);
            messages.push(`"${carteTiree.description}"`);

            // sortir de prison avec carte chance n°9
            if (carteTiree.titre === "Chance 9") {
                joueur.cartechanceSortiePrison = true;
                messages.push("carte chance n°9: vous pouvez sortir de prison avec cette carte.");
            } else {
                // appliquer les effets de la carte
                const messagesEffets = carteTiree.executer(joueur, jeu, banque);
                for (let message of messagesEffets) {
                    messages.push(message);
                }
            }

        } else if (this.typePioche === TypesCases.FONDS_COMMUNS) {
            carteTiree = jeu.piocheFondsCommun.shift();
            jeu.piocheFondsCommun.push(carteTiree.titre)
            messages.push(joueur.nom + " a pioché la carte " + carteTiree.titre);
            messages.push(`"${carteTiree.description}"`);

            // sortir de prison avec carte fonds commun n°5
            if (carteTiree.titre === "Fonds commun 5") {
                joueur.cartechanceSortiePrison = true;
                messages.push("carte fonds commun n°5: vous pouvez sortir de prison avec cette carte.");
            } else {
                // appliquer les effets de la carte
                const messagesEffets = carteTiree.executer(joueur, jeu, banque);
                for (let message of messagesEffets) {
                    messages.push(message);
                }
            }
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