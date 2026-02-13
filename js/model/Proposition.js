import { VersementEffet } from "./Effet.js";

/* ********************* Proposition ************************ */

export class Proposition {
    constructor(titre, description) {
        this.titre = titre;
        this.description = description; 
    }

    estDisponible( joueur, caseJeu) {
        //
    }

    valider( joueur, caseJeu) {
        //
    }

    /**
     * static car ne depend d'aucune donnee ou etat d'objet
     */
    static getListePropositions() {
        return [
            new PropositionAcheterPropriete(),
            new PropositionHypothequer(),
            new PropositionLeverHypotheque(),
            new PropositionConstruireMaison(),
            new PropositionConctruireHotel(),
        ];
    }
}

/* ********************* Acheter propriete ************************ */

export class PropositionAcheterPropriete extends Proposition {
    constructor() {
        super("acheter", "Voulez-vous acheter cette propriété ? ");
    }

    estDisponible(joueur, casePropriete) {
        if (casePropriete.estLibre() && joueur.argent >= casePropriete.prixAchat) {
            return true; 
        }
        return false; 
    }

    /**
     * valider l'achat de la propriete : transfert argent joueur -> banque, changement proprietaire de la case
     */
    valider(joueur, casePropriete) {
        if (!this.estDisponible(joueur, casePropriete)) return;

        casePropriete.proprietaire = joueur; 
        const versement = new VersementEffet(casePropriete.prixAchat, joueur, banque); 
        versement.appliquer(joueur, banque); 
    }
}

/* ********************* Hypothequer propriete ************************ */

export class PropositionHypothequer extends Proposition {
    constructor() {
        super("hypothéquer", "Voulez-vous hypothéquer cette propriété ? ");
    }

    estDisponible(jueur, casePropriete) {
        
    }

    valider(joueur, casePropriete) {
        
    }
}

/* ********************* Lever hypotheque propriete ************************ */

export class PropositionLeverHypotheque extends Proposition{
    constructor() {
        super("lever l'hypothèque", "Voulez-vous lever l'hypothèque sur cette propriété ? ");
    }

    estDisponible(joueur, casePropriete) {
        
    }

    valider(joueur, casePropriete) {
        
    }
}

/* ********************* construire maison sur propriete ************************ */

export class PropositionConstruireMaison extends Proposition{
    constructor(quantite) {
        super("contruire une maison", "Voulez-vous construire une maison sur cette propriété ? ");
    }

    estDisponible(joueur, caseRue) {
        if (caseRue.proprietaire === joueur && caseRue.possederTouteLaCollection() && caseRue.nombreMaisons < 4 && joueur.argent >= caseRue.prixMaison) {
            return true;
        }
        return false; 
    }

    valider(joueur, caseRue) {
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

    valider(joueur, caseRue) {
        joueur.argent -= caseRue.priHotel; 
        caseRue.nombreMaisons = 0;
        caseRue.nombreHotels = 1; //1 hotel 
    }
}