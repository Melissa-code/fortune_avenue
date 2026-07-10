import Joueur from "./Joueur.js"; 
import Banque from "./Banque.js";
import TypesCases from "./enums/TypesCases.js";
import { CasePropriete, CaseAction } from './CaseJeu.js';
import EtatsJeu from './enums/EtatsJeu.js';
import { Proposition } from './Proposition.js';

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
            if (this.valeurDeplacement) {
                joueur.avancer('relatif', this.valeurDeplacement, this.bonusDePassage);
            }
        }

        const nouvellePosition = jeu.casesJeu[joueur.position].nom;
        messages.push(`${joueur.nom} s'est déplacé de la case ${anciennePosition} à la case ${nouvellePosition}`);
        if (joueur.aTraverseCaseDepart) {
            messages.push(`${joueur.nom} passe par la case départ et reçoit 200 M.`);
        }

        // Arrivée sur la nouvelle case action 
        const caseArrivee = jeu.casesJeu[joueur.position];
        if (caseArrivee instanceof CaseAction) {
            const messagesCase = caseArrivee.arriver(joueur, jeu);
            messages.push(...messagesCase);
        }
        // cases Propriété 
        else {   
            console.log("case propriété: ", caseArrivee.nom);  
            // stocke case d'arrivée dans jeu pour traiter après affichage de la carte
            jeu.caseApresDeplacementCarte = jeu.casesJeu[joueur.position];

            console.log("type case arrivée:", caseArrivee.nom); // DEBUG
            console.log("case arrivée:",  jeu.caseApresDeplacementCarte.nom); // DEBUG
        }

        return messages;
    }
}

export class GareProcheEffet extends Effet {
    constructor() {
        super(); 
    }

    appliquer(joueur, jeu = null, banque = null) {
        let messages = []; 
        const positionActuelle = joueur.position;
        const garesPositions = [5, 15, 25, 35]; 
        let gareLaPlusProche = null;

        // prochaine gare
        for (const gare of garesPositions) {
            if (gare > positionActuelle) {
                gareLaPlusProche = gare;
                break; //1re gare trouvée
            }
        }

        if (gareLaPlusProche === null) {
            gareLaPlusProche = 5; // si aucune gare après , revenir à la 1re gare
        }

        const anciennePosition = jeu.casesJeu[joueur.position].nom;
        joueur.avancer('absolu', gareLaPlusProche);
        const nouvellePosition = jeu.casesJeu[joueur.position].nom;
        messages.push(`${joueur.nom} se rend à la gare la plus proche : ${nouvellePosition}`);

        if (joueur.aTraverseCaseDepart) {
            messages.push(`${joueur.nom} passe par la case départ et reçoit 200 M.`);
        }

        // propositions (achat?)
        jeu.caseApresDeplacementCarte = jeu.casesJeu[joueur.position];

        return messages;
    }
}

/**
 * Choix: versement amende ou tirer une carte chance 
 */
export class ChoixEffet extends Effet {
    constructor(montant, source, destinataire) {
        super();
        this.montant = montant;
        this.source = source;
        this.destinataire = destinataire;
    }

    appliquer(joueur, jeu = null, banque = null) {
        jeu.listePropositions = Proposition.getListePropositionsFondsCommuns();
        console.log("ChoixEffet - listePropositions:", jeu.listePropositions.length); // DEBUG
        jeu.etat = EtatsJeu.EN_ATTENTE;
        return []; 
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

        if (this.montant === undefined)
            console.trace("prob montant:",this);
        
        // 1- joueur paie banque (achat/taxe) - attention string != obj
        if (this.source === "joueur" && this.destinataire === "banque") {
            console.log("joueur: ", joueur.nom, " - banque: ", banque.nom, " - montant: ", this.montant)
            joueur.payer(this.montant);
            banque.recevoir(this.montant);
            (this.montant > 0 ? messages.push(`${joueur.nom} paye ${this.montant} M à la banque.`) : messages.push(`${joueur.nom} ne paie rien à la banque.`));
                
            // messages.push(`Taxe ! ${joueur.nom} paye ${this.montant} M à la banque.`);
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
             console.log("proprietes du joueuur :", joueur.proprietes)
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

export class ReparationsEffet extends Effet {
    constructor(montant_par_maison, montant_par_hotel, source, destinataire) {
        super(); 
        this.montant_par_maison = montant_par_maison;
        this.montant_par_hotel = montant_par_hotel;
        this.source = source; 
        this.destinataire = destinataire; 
    }

    appliquer(joueur, jeu = null, banque = null) {
        let messages = [];
        const totalMaisonsHotels = joueur.calculerTotalMaisonsHotels();
        const nbMaisons = totalMaisonsHotels[0];
        const nbHotels = totalMaisonsHotels[1];
        const montantTotal = (nbMaisons * this.montant_par_maison) + (nbHotels * this.montant_par_hotel);

        if (nbMaisons === 0 && nbHotels === 0) {
            messages.push(`${joueur.nom} n'a ni maison ni d'hôtel. Pas de réparations.`);
            return messages;
        }

        joueur.payer(montantTotal);
        banque.recevoir(montantTotal);
        messages.push(`${joueur.nom} paie ${montantTotal} M pour les réparations.`);

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
            messages.push(`${joueur.nom} est envoyé(e) en prison !`);
        } else if (joueur.estEnPrison) {
            joueur.estEnPrison = false; 
            messages.push(`${joueur.nom} est libéré(e) de prison !`);
        } else {
            // visite (ex: case départ -> direct case 10)
            messages.push(`Prison : ${joueur.nom} est en simple visite.`);
        }

        return messages;
    }
}

/**
 * Pioche une carte dans la pioche chance ou fonds commun
 * @return {Array} messages de str
 */
export class PiocheEffet extends Effet {
    constructor(typePioche) {
        super();
        this.typePioche = typePioche; // chance/fonds_commmun 
    }

    appliquer(joueur, jeu = null, banque = null) {
        if (this.typePioche === TypesCases.CHANCE) {
            return this.#piocher(jeu.piocheChance, "Chance 9", "carteChanceSortiePrison", joueur, jeu, banque);
        } else {
            return this.#piocher(jeu.piocheFondsCommun, "Fonds communs 5", "carteFondsCommunsSortiePrison", joueur, jeu, banque);
        }
    }

    #piocher(pioche, titreCarteSortiePrison, carteSortiePrisonJoueur, joueur, jeu, banque) {
        const carteTiree = pioche.shift();
        pioche.push(carteTiree); // remet la carte au fond
        const messages = [];
        messages.push(`**Carte ${carteTiree.titre}`);
        messages.push(`//\"${carteTiree.description}"`);

        // cartes pour sortie de prison
        if (carteTiree.titre === titreCarteSortiePrison) {
            joueur[carteSortiePrisonJoueur] = true;
            messages.push("Vous pouvez sortir de prison avec cette carte.");
        // appliquer les effets de la carte
        } else {
            const messagesEffets = carteTiree.executer(joueur, jeu, banque);
            for (let message of messagesEffets) {
                messages.push(message);
            }
        }
        return messages;
    }
}