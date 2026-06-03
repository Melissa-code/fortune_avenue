import { VersementEffet } from "./Effet.js";
import EtatsJeu from './enums/EtatsJeu.js';
import { CaseRue } from './CaseJeu.js';

// #region Proposition 

export class Proposition {
    static LISTE_PROPOSITIONS = []; 
    static LISTE_PROPOSITIONS_SORTIE_PRISON = []; 

    constructor(titre, description) {
        this.titre = titre;
        this.description = description; 
    }

    estDisponible(joueur = null, caseJeu = null, jeu = null) {}

    valider(joueur = null, jeu = null, caseJeu = null, banque = null) {}

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
        super("Lancer le dé", "Voulez-vous lancer le dé pour sortir de prison ?");
    }

    estDisponible() { 
        return true; 
    }

    valider(joueur, jeu, caseJeu, banque) { 
        const valeurDeplacement = jeu.de.lancer(); 
   
        if (valeurDeplacement === 12) {
            joueur.estEnPrison = false; 
            joueur.compteurPourSortirPrison = 0; 
            jeu.etat = EtatsJeu.EN_COURS;
            return { titre: "Libre", message: "Vous sortez de prison." };
        } else {
            joueur.compteurPourSortirPrison += 1; 

            if (joueur.compteurPourSortirPrison === 3) {
                joueur.estEnPrison = false; 
                joueur.compteurPourSortirPrison = 0;
                joueur.payer(50); 
                banque.recevoir(50);
                return { titre: "Raté", message: "Vous restez en prison." };
            }

            return { titre: "Raté", message: "Vous restez en prison." };
        }
    }
}

// #endregion 

// #region PropositionJouerCarteChanceSortiePrison 

export class PropositionJouerCarteChanceSortiePrison extends Proposition {
    constructor() {
        super("Jouer la carte chance", "Voulez-vous jouer la carte n° 9 'Sortir de prison' pour sortir de prison ?");
    }

    estDisponible(joueur) {
        if (joueur.carteChanceSortiePrison === true ) { 
            return true; 
        }

        return false; 
    }

    valider(joueur, jeu, caseJeu, banque) {
        if (!this.estDisponible(joueur)) return false;

        if (joueur.carteChanceSortiePrison = true) {
            joueur.carteChanceSortiePrison = false; 
            joueur.estEnPrison = false; 
            joueur.compteurPourSortirPrison = 0; 
            return { titre: "Libre", message: "Vous sortez de prison." };
        } 

        return { titre: "Raté", message: "Vous restez en prison." };
    }
}

export class PropositionAcheterCartePourSortiePrison extends Proposition {
    constructor() {
        super("Acheter la carte", "Voulez-vous acheter la carte  'Sortir de prison' pour sortir de prison ?");
    }

    estDisponible(joueur, jeu) {
        const joueurs = jeu.getJoueurs();
    
        for (let i = 0; i < joueurs.length; i ++) {
            if (joueur !== joueurs[i] && (joueurs[i].carteChanceSortiePrison === true || joueurs[i].carteFondsCommunsSortiePrison === true)) {
                this.joueur2=joueurs[i];
                return true;
            }
        }
        return false;
    }

    valider(joueur, jeu, caseJeu, banque) {
        if (!this.estDisponible(joueur, jeu)) return false;

        const versement = new VersementEffet(25, joueur, this.joueur2); 
        versement.appliquer(joueur); 

        if (this.joueur2.carteChanceSortiePrison === true) {
            this.joueur2.carteChanceSortiePrison = false; 
            joueur.carteChanceSortiePrison = true;
             joueur.estEnPrison = false; 
        } else if (this.joueur2.carteFondsCommunsSortiePrison === true) {
            this.joueur2.carteFondsCommunsSortiePrison = false; 
            joueur.carteFondsCommunsSortiePrison = true; 
            joueur.estEnPrison = false; 
        }

        return { titre: "Libre", message: `${joueur.nom} a acheté la carte pour sortir de prison.`}
    }

}

// #endregion 

// #region PropositionJouerCarteFondsCommunsSortiePrison

export class PropositionJouerCarteFondsCommunsSortiePrison extends Proposition {
    constructor() {
        super("Jouer la carte fonds commun", "Voulez-vous jouer la carte n° 5 'Sortir de prison' pour sortir de prison ?");
    }

    estDisponible(joueur) {
        if (joueur.carteFondsCommunsSortiePrison === true) {
            return true;
        }

        return false;
    }

    valider(joueur, jeu, caseJeu, banque) {
        if (!this.estDisponible(joueur)) return false;

        if (joueur.carteFondsCommunsSortiePrison = true) {
            joueur.carteFondsCommunsSortiePrison = false; 
            joueur.estEnPrison = false; 
            joueur.compteurPourSortirPrison = 0; 
            return { titre: "Libre", message: "Vous sortez de prison." };
        } 

        return { titre: "Raté", message: "Vous restez en prison." };
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
    valider(joueur, jeu, casePropriete, banque) {
        // console.log('achat n apparia pas')
        if (!this.estDisponible(joueur, casePropriete)) return false; 

        casePropriete.proprietaire = joueur; 
        joueur.proprietes.push(casePropriete); 
        // console.log("achat propiriete", joueur.proprietes)

        // console.log("achat debug proposition", casePropriete.prixAchat, joueur.argent, banque.argent)

        const versement = new VersementEffet(casePropriete.prixAchat, joueur, banque); 
        //  console.log("achat debug proposition 2", casePropriete.prixAchat, joueur.argent, banque.argent)
        
        versement.appliquer(joueur, banque); 
        return { titre: "Achat", message: `${joueur.nom} a acheté ${casePropriete.nom} pour ${casePropriete.prixAchat}€.`}
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

    valider(joueur, jeu, casePropriete, banque) {
        
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

    valider(joueur, jeu, casePropriete, banque) {
        
    }
}

// #endregion

// #region PropositionConstruireMaison 

export class PropositionConstruireMaison extends Proposition{
    constructor(quantite) {
        super("contruire une maison", "Voulez-vous construire une maison sur cette propriété ?");
    }

    estDisponible(joueur, caseRue, jeu) {
        if (!(caseRue instanceof CaseRue)) return false;

        return (
            caseRue.proprietaire === joueur && 
            jeu.possederTouteLaCollection(joueur, caseRue.couleur) && 
            caseRue.nombreMaisons < 4 && 
            joueur.argent >= caseRue.prixMaison
        );
        return false; 
    }

    valider(joueur, jeu, caseRue, banque) {
        if (!this.estDisponible(joueur, caseRue, jeu)) return false;  

        caseRue.construire("maison"); 
        return { titre: "Construction: ", message: `${joueur.nom} a construit une maison sur ${caseRue.nom}.` };
    }
}

// #endregion 

// #region  PropositionConctruireHotel 

export class PropositionConctruireHotel extends Proposition {
    constructor() {
        super("contruire un hôtel", "Voulez-vous construire un hôtel sur cette propriété ? ");
    }

    estDisponible(joueur, caseRue) {
        if (!(caseRue instanceof CaseRue)) return false;

        return (caseRue.proprietaire === joueur 
            && caseRue.nombreMaisons === 4 
            && joueur.argent >= caseRue.prixHotel
        ) ;
        
        return false; 
    }

    valider(joueur, jeu, caseRue, banque) {
        if (!this.estDisponible(joueur, caseRue)) return false; 

        caseRue.construire("hotel"); 
        return { titre: "Construction: ", message: `${joueur.nom} a construit un hôtel sur ${caseRue.nom}.` };
    }
}

// #endregion

export class PropositionDecliner extends Proposition {
    constructor() {
        super("décliner", "Aucune action vous finissez votre tour.");
    }

    estDisponible() {
        return true; 
    }

    valider(joueur, jeu, casePropriete, banque) {
        return { titre: "Refus", message: `${joueur.nom} a décliné l'achat de  ${casePropriete.nom} pour ${casePropriete.prixAchat}€.`}
    }
}

// #region LISTES (ne créer les obkets qu'une seule fois pour optimiser la mémoire et performances)

// Propositions[] liées aux propriétés 
Proposition.LISTE_PROPOSITIONS = [
    new PropositionAcheterPropriete(),
    new PropositionHypothequer(),
    new PropositionLeverHypotheque(),
    new PropositionConstruireMaison(),
    new PropositionConctruireHotel(),
    new PropositionDecliner()
]

// Propositions[] liées à l'action sortir de prison 
Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON = [
    new PropositionJouerDeSortiePrison,
    new PropositionJouerCarteChanceSortiePrison(),
    new PropositionJouerCarteFondsCommunsSortiePrison(),
    new PropositionAcheterCartePourSortiePrison(),
]

// #endregion