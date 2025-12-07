import { CarteRue } from './Carte.js';
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'; 
import { Proposition, PropositionAcheterPropriete, PropositionHypothequer, PropositionLeverHypotheque, PropositionConstruireMaison, PropositionConctruireHotel, PropositionPayerLoyer } from './Proposition.js';

/* ******************  Case (propriete, action) ****************** */

export class CaseJeu {
    constructor(data) {
        this.nom = data.nom;
    }

    arriver() {
        //
    }
}

/* ******************  Case de proprietes (rue, gare, societe) ****************** */

export class CasePropriete extends CaseJeu {
    constructor(data, carte) {
        super(data); 
        this.proprietaire = null;
        this.prixAchat = data.prix || null;
        this.hypotheque = false; //venduà la banque temporairement -> pas de loyer (lever hyp en payant un suppl à banque)
        this.carte = carte;
        this.listePropositionsPropriete = [];
    }

    filtrerPropositionsValables(joueur, jeu) {
        // traverser listeProp et prendre celles valides (estDisponible(jeu, joueur, caseJeu) true)
        const propositions = Proposition.getListePropositions(); 
        const propositionsValables = [];

        for (let propositionValable of propositions) {
            if (propositionValable.estDisponible(jeu, joueur, this)) { 
                propositionsValables.push(propositionValable); 
            }
        }

        return propositionsValables; 
    }

    estLibre() {
        return !this.proprietaire;
    }

    acheterPropriete() {
        if (this.estLibre()) {
            const versement = new VersementEffet(this.prixAchat, joueur, banque); 
            versement.appliquer(joueur, banque)
            this.proprietaire = joueur;
            return true;
        }
        return false;
    }

    calculerLoyer() {
        // methd abstraite (impl dans les cl filles)
    }

    /**
     * toutes les rues de la meme couleur, toutes les gares ou toutes les sociétés
     */
    possederTouteLaCollection() {
        // couleur, gare ou societe
    }

    hypothequer() {
        if (this.proprietaire === joueur && this.hypotheque) {
            const montantHypotheque = this.prixAchat / 2;
            const remboursement = new VersementEffet(montantHypotheque, banque, joueur);
            remboursement.appliquer(joueur, banque);
            this.hypotheque = true;
            return true;
        }
        return false;
    }

    leverHypotheque(joueur, banque) {
        if (this.proprietaire === joueur && !this.hypotheque) {
            const montantAPayer = (this.prixAchat / 2) * 10 / 100 ; //10% interet
            const paiement = new VersementEffet(montantAPayer, joueur, banque);
            paiement.appliquer(joueur, banque);
            this.hypotheque = false;
            return true;
        }
        return false;
    }
}

/* ******************  Case rue ****************** */

export class CaseRue extends CasePropriete {
    constructor(data, proprietaire) {
        super(data, proprietaire);
        this.nombreMaisons = 0; 
        this.nombreHotels = 0; 
        this.couleur = data.couleur || null;
    }

    acheter(typeConstruction) {
        if (!this.proprietaire) { return; }

        let prixConstruction = 0; 

        switch(typeConstruction) {
            case "maison":
                prixConstruction = this.carte.prixMaison;
                break;
            case "hotel":
                prixConstruction = this.carte.prixHotel;
                break;
            default: 
                console.log('Aucun type de construction reconnu.'); 
        }

        let effet = new VersementEffet(prix, this.proprietaire.argent, banque);
        effet.appliquer(this.proprietaire, banque);
        console.log(`${this.proprietaire.nom} paye ${prixConstruction}€ pour construire un(e) ${typeConstruction}.`);
    }

    construire(typeConstruction) {
        if (typeConstruction === "maison") {
            this.nombreMaisons++; 
            this.acheter("maison");
        } else if (typeConstruction === "hotel") {
            if (this.nombreMaisons === 4) {
                this.nombreHotels++; 
                this.nombreMaisons = 0; 
                this.acheter("hotel");
            }
        } else {
            console.log(`type de construction inconnu: ${type}`)
        }
    }

    possederTouteLaCollection() {
        if (!this.proprietaire) return false;

        const couleurCase = this.couleur;
        const totalParCouleur = this.data.totalParFamille;
        let proprietes = this.proprietaire.proprietes; 
        let compteur = 0;

        for (let propriete of proprietes) {
            if (propriete instanceof CaseRue) {
                if (propriete.couleur === couleurCase) {
                    compteur++;
                }
            }
        }
        return compteur === totalParCouleur;
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

        if (this.nombreHotels > 0) {
            return this.data.loyers[5]; 
        }
        else if (this.nombreMaisons > 0) {
            return this.data.loyers[this.nombreMaisons];
        } 
        else if (this.possederTouteLaCollection()) {
            return this.data.loyers[this.data.loyers.length - 1]; 
        }
        else return this.data.loyers[0];
    }
}

/* ******************  Case gare  ****************** */

export class CaseGare extends CasePropriete {
    constructor(data, nom, proprietaire, prixAchat) {
        super(data, nom, proprietaire, prixAchat);
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

    }
}

/* ******************  Case societe  ****************** */

export class CaseSociete extends CasePropriete {
    constructor(data, nom, proprietaire, prixAchat) {
        super(data, nom, proprietaire, prixAchat);
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

    }
}


/* ******************  Case d'action  ****************** */

export class CaseAction extends CaseJeu {
    constructor(data, nom) {
        super(data, nom); 
        this.effets = [];
        
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    arriver(joueur,plateauJeu) {
        for (let effet of this.effets) {
            effet.appliquer(joueur, plateauJeu)
        }
    }
}



