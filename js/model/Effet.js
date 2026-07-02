import Joueur from "./Joueur.js"; 
import Banque from "./Banque.js";
import TypesCases from "./enums/TypesCases.js";
import { CasePropriete, CaseAction } from './CaseJeu.js';
import EtatsJeu from './enums/EtatsJeu.js';

/**
 * classe abstraite 
 */
export class Effet {
    appliquer(joueur = null, jeu = null, banque = null) {
        // surcharger la methd 
    }
}

/**
 * type de deplacement: absolu (index case) ou relatif (nb de pas/N° sur dé)
 */
export class DeplacementEffet extends Effet {
    constructor(typeDeplacement, valeurDeplacement, bonusDePassage = 0) {
        super(); 
        this.typeDeplacement = typeDeplacement;
        this.valeurDeplacement = valeurDeplacement; 
        this.bonusDePassage = bonusDePassage;
    }

    appliquer(joueur, jeu = null, banque = null) {
        const anciennePosition = jeu.casesJeu[joueur.position].nom;
        let messages = [];
        
        if (this.typeDeplacement === 'absolu') {
            joueur.avancer('absolu', this.valeurDeplacement);
        } 
        else {
            console.log("valeur deplacement: ", this.valeurDeplacement)
            if (this.valeurDeplacement < 0) {
                joueur.reculer('relatif', this.valeurDeplacement, this.bonusDePassage); // ex -3
            } else {
                joueur.avancer('relatif', this.valeurDeplacement, this.bonusDePassage);
            }
        }

        const nouvellePosition = jeu.casesJeu[joueur.position].nom;
        messages.push(`${joueur.nom} s'est déplacé de la case ${anciennePosition} à la case ${nouvellePosition}`);

        // Arrivée sur la nouvelle case action 
        const caseArrivee = jeu.casesJeu[joueur.position];
        if (caseArrivee instanceof CaseAction) {
            const messagesCase = caseArrivee.arriver(joueur, jeu);
            messages.push(...messagesCase);
        } else {
            // cases Propriété 
            const propositions = caseArrivee.arriver(joueur, jeu);
            if (propositions.length > 0) {
                jeu.listePropositions = propositions;
                jeu.etat = EtatsJeu.EN_ATTENTE;
            }
        }

        return messages;
    }
}

/**
 * montant, source(banque/joueur), destination (banque/joueur)
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
            messages.push(`Taxe ! ${joueur.nom} paye ${this.montant} M à la banque.`);
        }

        else if (this.source === "banque" && this.destinataire === "joueur") {
            joueur.recevoir(this.montant); 
            // console.log("Le joueur a recu de la banque : ", this.montant);
            messages.push(`${joueur.nom} reçoit ${this.montant} M de la banque.`);

        // 2- autres joueurs paient joueur courant (carte anniversaire)
        } else if (this.estCollectif) {
            let tousLesJoueurs = jeu.getJoueurs(); 
            for (let joueurAdverse of tousLesJoueurs) {
                if (joueurAdverse !== joueur) {
                    joueurAdverse.payer(this.montant);
                    joueur.recevoir(this.montant); 
                    messages.push(`${joueur.nom} reçoit ${this.montant} M de ${joueurAdverse.nom}.`);
                }
            }
            console.log("argent du joueur ap recevoir argent: ", joueur.argent)

        } else if (this.source instanceof Joueur && this.destinataire instanceof Banque) {
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            // console.log("proprietes du joueuur :", joueur.proprietes)
            messages.push(`${this.destinataire.nom} reçoit ${this.montant} M de ${this.source.nom}.`);
   
        } else if (this.source instanceof Joueur && this.destinataire instanceof Joueur) {
            this.source.payer(this.montant);
            this.destinataire.recevoir(this.montant);
            messages.push(`${this.destinataire.nom} reçoit ${this.montant} M de ${this.source.nom}.`);
   
         // 3- banque paie joueur (case départ/gain)
        } else if (this.source instanceof Banque && this.destinataire instanceof Joueur) {
            joueur.recevoir(this.montant);
            // console.log("argent du joueur ap recevoir argent: ", joueur.argent)
            messages.push(`${joueur.nom} reçoit ${this.montant} M de la banque.`)
        }
        return messages;
    }
}

/**
 * Entree/Sortie: 
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
            messages.push(`${joueur.nom} est envoyé(e) en prison!`);
        } else if (joueur.estEnPrison) {
            joueur.estEnPrison = false; 
            messages.push(`${joueur.nom} est libéré(e) de prison!`);
        } else {
            // visite (ex: case départ -> direct case 10)
            messages.push(`Prison : ${joueur.nom} est en simple visite.`);
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

        // chance 
        if (this.typePioche === TypesCases.CHANCE) {
            carteTiree = jeu.piocheChance.shift();
            jeu.piocheChance.push(carteTiree); 
            messages.push(`Carte ${carteTiree.titre}`);
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
            // réparations pour maisons 25 + hotels 100 
            if (carteTiree.titre === "Chance 12") {
                const totalMaisonsHotels = joueur.calculerTotalMaisonsHotels();
                const montant = (totalMaisonsHotels[0] * 25) + (totalMaisonsHotels[1] * 100);
                const versementEffet = new VersementEffet(montant, joueur, banque);
                messages.push(`${joueur.nom} paie ${montant} M pour les réparations de ses maisons et hôtels.`);
            }
             // réparations pour maisons 40 + hotels 115
            if (carteTiree.titre === "Chance 5") {
                const totalMaisonsHotels = joueur.calculerTotalMaisonsHotels();
                const montant = (totalMaisonsHotels[0] * 40) + (totalMaisonsHotels[1] * 115);
                const versementEffet = new VersementEffet(montant, joueur, banque);
                messages.push(`${joueur.nom} paie ${montant} M pour les réparations de ses maisons et hôtels.`);
            }
            
        // Fonds commusn 
        } else if (this.typePioche === TypesCases.FONDS_COMMUNS) {
            carteTiree = jeu.piocheFondsCommun.shift();
            jeu.piocheFondsCommun.push(carteTiree)
            messages.push(`Carte ${carteTiree.titre}`);
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