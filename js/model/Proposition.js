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
        //
    }

}

export class PropositionAcheterPropriete extends Proposition{
    constructor(titre, description) {
        super(titre, description);
    }

    estDisponible(jeu, joueur, caseJeu) {
        if (caseJeu.proprietaire === null && joueur.argent >= caseJeu.prix) {
            return true; 
        }
        return false; 
    }

    valider(jeu, joueur, caseJeu) {
        
    }
}

