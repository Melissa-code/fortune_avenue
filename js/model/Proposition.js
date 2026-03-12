import { VersementEffet } from "./Effet.js";
import { CasePropriete } from './CaseJeu.js';

/* ********************* Proposition ************************ */

export class Proposition {
    static LISTE_PROPOSITIONS = []; 

    constructor(titre, description) {
        this.titre = titre;
        this.description = description; 
    }

    estDisponible(joueur, caseJeu) {
        //
    }

    valider(joueur, caseJeu, banque = null) {
        //
    }

    /**
     * static car ne depend d'aucune donnee ou etat d'objet
     */
    static getListePropositions() {
        return Proposition.LISTE_PROPOSITIONS; 
    }
}


/* ********************* Acheter propriete ************************ */

export class PropositionAcheterPropriete extends Proposition {
    constructor() {
        super("acheter", "Voulez-vous acheter cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        console.log("case propriete :", casePropriete)
        if (casePropriete.estLibre() && joueur.argent >= casePropriete.prixAchat) {
            console.log("case propriete 2:", casePropriete)
            return true; 
        }
        return false; 
    }

    /**
     * valider l'achat de la propriete (return bool): 
     * proprietaire de la case + transfert argent joueur -> banque
     */
    valider(joueur, casePropriete, banque) {
        if (!this.estDisponible(joueur, casePropriete)) return false; 

        casePropriete.proprietaire = joueur; 
        joueur.proprietes.push(casePropriete); 

        const versement = new VersementEffet(casePropriete.prixAchat, joueur, banque); 
        versement.appliquer(joueur, banque); 

        return true;
    }
}

/* ********************* Hypothequer propriete ************************ */

export class PropositionHypothequer extends Proposition {
    constructor() {
        super("hypothéquer", "Voulez-vous hypothéquer cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        
    }

    valider(joueur, casePropriete, banque) {
        
    }
}

/* ********************* Lever hypotheque propriete ************************ */

export class PropositionLeverHypotheque extends Proposition{
    constructor() {
        super("lever l'hypothèque", "Voulez-vous lever l'hypothèque sur cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        
    }

    valider(joueur, casePropriete) {
        
    }
}

/* ********************* construire maison sur propriete ************************ */

export class PropositionConstruireMaison extends Proposition{
    constructor(quantite) {
        super("contruire une maison", "Voulez-vous construire une maison sur cette propriété ?");
    }

    estDisponible(joueur, caseRue) {
        if (caseRue.proprietaire === joueur && caseRue.possederTouteLaCollection() && caseRue.nombreMaisons < 4 && joueur.argent >= caseRue.prixMaison) {
            return true;
        }
        return false; 
    }

    valider(joueur, caseRue, banque) {
        joueur.argent -= caseRue.prixMaison; 
        caseRue.nombreMaisons++; 
    }
}

/* ********************* construire hotel sur propriete ************************ */

export class PropositionConctruireHotel extends Proposition {
    constructor() {
        super("contruire un hôtel", "Voulez-vous construire un hôtel sur cette propriété ? ");
    }

    estDisponible(joueur, caseRue) {
        if (caseRue.proprietaire === joueur && caseRue.nombreMaisons === 4 && joueur.argent >= caseRue.prixHotel) {
            return true;
        }
        return false; 
    }

    valider(joueur, caseRue, banque) {
        joueur.argent -= caseRue.priHotel; 
        caseRue.nombreMaisons = 0;
        caseRue.nombreHotels = 1; //1 hotel 
    }
}

/* *********************  LISTE_PROPOSITIONS ************************ */

// ne créer les obkets qu'une seule fois pour optimiser la mémoire et performances
Proposition.LISTE_PROPOSITIONS = [
    new PropositionAcheterPropriete(),
    new PropositionHypothequer(),
    new PropositionLeverHypotheque(),
    new PropositionConstruireMaison(),
    new PropositionConctruireHotel(),
    //new Proposition("decliner", "Aucune action, vous finissez votre tour."),
]