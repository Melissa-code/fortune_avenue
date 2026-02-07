import { CaseJeu, CasePropriete, CaseRue } from "./CaseJeu.js";
import Joueur from "./Joueur.js"; 
import Jeu from "./Jeu.js";

/* ********************* Proposition ************************ */

export class Proposition {
    constructor(titre, description) {
        this.titre = titre;
        this.description = description; 
    }

    estDisponible(jeu, joueur, caseJeu) {
        //
    }

    valider(jeu, joueur, caseJeu) {
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

export class PropositionAcheterPropriete extends Proposition{
    constructor() {
        super("acheter", "Voulez-vous acheter cette propriété ? ");
    }

    estDisponible(jeu, joueur, casePropriete) {
        if (casePropriete.estLibre() && joueur.argent >= casePropriete.prixAchat) {
            return true; 
        }
        return false; 
    }

    valider(jeu, joueur, casePropriete) {
        if (!this.estDisponible) return;

        casePropriete.proprietaire = joueur; 
        const versement = new VersementEffet(this.prixAchat, joueur, banque); 
        versement.appliquer(joueur, banque)
    }

}

/* ********************* Hypothequer propriete ************************ */

export class PropositionHypothequer extends Proposition {
    constructor() {
        super("hypothéquer", "Voulez-vous hypothéquer cette propriété ? ");
    }

    estDisponible(jeu, joueur, casePropriete) {
        
    }

    valider(jeu, joueur, casePropriete) {
        
    }
}

/* ********************* Lever hypotheque propriete ************************ */

export class PropositionLeverHypotheque extends Proposition{
    constructor() {
        super("lever l'hypothèque", "Voulez-vous lever l'hypothèque sur cette propriété ? ");
    }

    estDisponible(jeu, joueur, casePropriete) {
        
    }

    valider(jeu, joueur, casePropriete) {
        
    }
}

/* ********************* construire maison sur propriete ************************ */

export class PropositionConstruireMaison extends Proposition{
    constructor(quantite) {
        super("contruire une maison", "Voulez-vous construire une maison sur cette propriété ? ");
    }

    estDisponible(jeu, joueur, caseRue) {
        if (caseRue.proprietaire === joueur && caseRue.possederTouteLaCollection() && caseRue.nombreMaisons < 4 && joueur.argent >= caseRue.prixMaison) {
            return true;
        }
        return false; 
    }

    valider(jeu, joueur, caseRue) {

        joueur.argent -= caseRue.prixMaison; 
        caseRue.nombreMaisons++; 
    }
}

/* ********************* construire hotel sur propriete ************************ */

export class PropositionConctruireHotel extends Proposition {
    constructor() {
        super("contruire un hôtel", "Voulez-vous construire un hôtel sur cette propriété ? ");
    }

    estDisponible(jeu, joueur, caseRue) {
        if (caseRue.proprietaire === joueur && caseRue.nombreMaisons === 4 && joueur.argent >= caseRue.prixHotel) {
            return true;
        }
        return false; 
    }

    valider(jeu, joueur, caseRue) {
        joueur.argent -= caseRue.priHotel; 
        caseRue.nombreMaisons = 0;
        caseRue.nombreHotels = 1; //1 hotel 
    }
}