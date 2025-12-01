import { CasePropriete } from "./CaseJeu.js";

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

    getListePropositions() {
        return [
            new PropositionAcheterPropriete(),
            new PropositionHypothequer(),
            new PropositionLeverHypotheque(),
            new PropositionConstruireMaison(),
            new PropositionConstruireHotel(),
            new PropositionPayerLoyer()
        ];
    }
}


export class PropositionAcheterPropriete extends Proposition{
    constructor(titre, description) {
        super(titre, description);
    }

    estDisponible(jeu, joueur, casePropriete) {
        if (casePropriete.proprietaire === null && joueur.argent >= casePropriete.prixAchat) {
            return true; 
        }
        return false; 
    }

    valider(jeu, joueur, casePropriete) {
        joueur.argent -= casePropriete.prixAchat; 
        casePropriete.proprietaire = joueur; 
    }
}


export class PropositionHypothequer extends Proposition {
    constructor(titre, description) {
        super(titre, description);
    }

    estDisponible(jeu, joueur, casePropriete) {
        
    }

    valider(jeu, joueur, casePropriete) {
        
    }
}


export class PropositionLeverHypotheque extends Proposition{
    constructor(titre, description) {
        super(titre, description);
    }

    estDisponible(jeu, joueur, casePropriete) {
        
    }

    valider(jeu, joueur, casePropriete) {
        
    }
}


export class PropositionConstruireMaison extends Proposition{
    constructor(titre, description) {
        super(titre, description);
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


export class PropositionConctruireHotel extends Proposition {
    constructor(titre, description) {
        super(titre, description);
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


export class PropositionPayerLoyer extends Proposition {
    constructor(titre, description) {
        super(titre, description);
    }

    estDisponible(jeu, joueur, casePropriete) {
        
    }

    valider(jeu, joueur, casePropriete) {
        
    }
}