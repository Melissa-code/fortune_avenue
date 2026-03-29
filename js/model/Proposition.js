import { VersementEffet } from "./Effet.js";


// #region Proposition 

export class Proposition {
    static LISTE_PROPOSITIONS = []; 
    static LISTE_PROPOSITIONS_SORTIE_PRISON = []; 

    constructor(titre, description) {
        this.titre = titre;
        this.description = description; 
    }

    estDisponible(joueur=null, caseJeu=null) {}

    valider(joueur=null, caseJeu=null, banque = null) {}

    /**
     * static car ne depend d'aucune donnee ou etat d'objet
     */
    static getListePropositions() {
        return Proposition.LISTE_PROPOSITIONS; 
    }

    static getListePropositionsSortiePrison() {
        return Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON;
    }
}

// #endregion  

// #region PropositionJouerDeSortiePrison

export class PropositionJouerDeSortiePrison extends Proposition {
    constructor() {
        super("jouer_de", "Voulez-vous lancer le dé pour sortir de prison ?");
    }

    estDisponible() { 
        return true; 
    }

    valider() { 
        return true; 
    }
}

// #endregion 

// #region PropositionJouerCarteChanceSortiePrison 

export class PropositionJouerCarteChanceSortiePrison extends Proposition {
    constructor() {
        super("jouer_carte", "Voulez-vous jouer la carte n° 9 'Sortir de prison' pour sortir de prison ?");
    }

    estDisponible(joueur) {
        if (joueur.carteChanceSortiePrison === true ) { 
            return true; 
        }

        return false; 
    }

    valider(joueur) {
        if (!this.estDisponible(joueur)) return false;

        if (joueur.carteChanceSortiePrison = true) {
            joueur.carteChanceSortiePrison = false; 
            joueur.estEnPrison = false; 
            joueur.compteurPourSortirPrison = 0; 
            return true;
        } 

        return false;
    }
}

// #endregion 

// #region PropositionJouerCarteFondsCommunsSortiePrison

export class PropositionJouerCarteFondsCommunsSortiePrison extends Proposition {
    constructor() {
        super("jouer_carte", "Voulez-vous jouer la carte n° 5 'Sortir de prison' pour sortir de prison ?");
    }

    estDisponible(joueur) {
        if (joueur.carteFondsCommunsSortiePrison === true) {
            return true;
        }

        return false; 
    }

    valider(joueur) {
        if (!this.estDisponible(joueur)) return false;

        if (joueur.carteFondsCommunsSortiePrison = true) {
            joueur.carteFondsCommunsSortiePrison = false; 
            joueur.estEnPrison = false; 
            joueur.compteurPourSortirPrison = 0; 
            return true;
        } 

        return false;
    }
}

// #endregion 

// #region PropositionAcheterPropriete

export class PropositionAcheterPropriete extends Proposition {
    constructor() {
        super("acheter", "Voulez-vous acheter cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        if (casePropriete.estLibre() && joueur.argent >= casePropriete.prixAchat) {
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

// #endregion

// #region PropositionHypothequer 

export class PropositionHypothequer extends Proposition {
    constructor() {
        super("hypothéquer", "Voulez-vous hypothéquer cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        
    }

    valider(joueur, casePropriete, banque) {
        
    }
}

// #endregion

// #region PropositionLeverHypotheque

export class PropositionLeverHypotheque extends Proposition{
    constructor() {
        super("lever l'hypothèque", "Voulez-vous lever l'hypothèque sur cette propriété ?");
    }

    estDisponible(joueur, casePropriete) {
        
    }

    valider(joueur, casePropriete) {
        
    }
}

// #endregion

// #region PropositionConstruireMaison 

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

// #endregion 

// #region  PropositionConctruireHotel 

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

// #endregion


// #region LISTES (ne créer les obkets qu'une seule fois pour optimiser la mémoire et performances)

// Propositions[] liées aux propriétés 
Proposition.LISTE_PROPOSITIONS = [
    new PropositionAcheterPropriete(),
    new PropositionHypothequer(),
    new PropositionLeverHypotheque(),
    new PropositionConstruireMaison(),
    new PropositionConctruireHotel(),
]

// Propositions[] liées à l'action sortir de prison 
Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON = [
    new PropositionJouerDeSortiePrison,
    new PropositionJouerCarteChanceSortiePrison(),
    new PropositionJouerCarteFondsCommunsSortiePrison(),
]

// #endregion