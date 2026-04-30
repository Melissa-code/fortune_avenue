import { CarteRue } from './Carte.js';
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'; 
import { Proposition, PropositionAcheterPropriete, PropositionHypothequer, PropositionLeverHypotheque, PropositionConstruireMaison, PropositionConctruireHotel, PropositionDecliner } from './Proposition.js';
import TypesMessagesModale from "./enums/TypesMessagesModale.js"; 

// #region Case (propriete, action) 

export class CaseJeu {
    constructor(nom) {
        this.nom = nom;
    }

    arriver() {
        return []; // par defaut aucune proposition
    }
}

// #endregion 


// #region Case de proprietes (rue, gare, societe)

export class CasePropriete extends CaseJeu {
    constructor(nom, prix, loyers) {
        super(nom); 
        this.proprietaire = null;
        this.prixAchat = prix || null;
        this.hypotheque = false; //venduà la banque temporairement -> pas de loyer (lever hyp en payant un suppl à banque)
        this.loyers = loyers;
        this.listePropositionsPropriete = [];
        this.effet = null;
    }

    /**
     * proposer au joueur d'acheter la propriete s'il n'y a pas de proprietaire, sinon proposer de payer le loyer 
     */
    filtrerPropositionsValables(joueur) {
        // traverser listeProp et prendre celles valides (estDisponible(jeu, joueur, caseJeu) true)
        const propositions = Proposition.getListePropositions(); 
        const propositionsValables = [];

        for (let propositionValable of propositions) {
            if (propositionValable.estDisponible(joueur, this)) { 
                propositionsValables.push(propositionValable); 
            }
        }
        if (propositionsValables.length === 1 && propositionsValables[0] instanceof PropositionDecliner) {
            return []; 
        }
        return propositionsValables; 
    }

    estLibre() {
        return !this.proprietaire;
    }

    /**
     * Retourne l'index du loyer en fonction du nombre de propriétés du même type
     */

    calculerLoyer() {
        // à surcharger
    }

    /**
     * si la case est libre, proposer d'acheter sinon payer le loyer
     */
    arriver(joueur) {
        return this.filtrerPropositionsValables(joueur) || [];
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

// #endregion 


// #region Case rue

export class CaseRue extends CasePropriete {
    constructor(nom, prix, loyers, couleur) {
        super(nom, prix, loyers);
        this.nombreMaisons = 0; 
        this.nombreHotels = 0; 
        this.couleur = couleur || null;
    }

    acheter(typeConstruction) {
        if (!this.proprietaire) return; 

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

        let effet = new VersementEffet(prixConstruction, this.proprietaire.argent, banque);
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

    
    /**
     * surcharge de la méthode calculerIndexLoyer pour les rues 
     */
    calculerLoyer(jeu) {
        if (this.hypotheque || !this.proprietaire) return 0; 

        if (this.nombreHotels > 0) return this.loyers[5];
        if (this.nombreMaisons > 0) return this.loyers[this.nombreMaisons];  // 1à4
        if (jeu.possederTouteLaCollectionCases(this.proprietaire, this.couleur)) return this.loyers.length - 1; //possederTouteLaCollectionCases(joueur, couleur) 

        return this.loyers[0]; 
    }
}

// #endregion 


// #region Case gare

export class CaseGare extends CasePropriete {
    constructor(nom, prix, loyers, typeCase) {
        super(nom, prix, loyers);
        this.typeCase = typeCase; 
    }

    calculerLoyer(jeu=null) {
        if (this.hypotheque || this.estLibre()) return 0; 
        let montant = 0; 

        const joueurProprietes = this.proprietaire.proprietes || []; 
        const nbGares = joueurProprietes.filter( (propriete) => propriete instanceof CaseGare).length; 
        
        montant = this.loyers[nbGares -1];
        console.log("montant loyer gare" , montant)

        return montant; 
    }
}

// #endregion


// #region Case Societe

export class CaseSociete extends CasePropriete {
    constructor(nom, prix, loyers) {
        super(nom, prix, loyers);
    }

    calculerLoyer(jeu) {
        if (this.hypotheque || this.estLibre()) return 0; 
        
        let montant = 0;
        const joueurProprietes = this.proprietaire.proprietes || []; 
        const nbSocietes = joueurProprietes.filter( (propriete) => propriete instanceof CaseSociete).length; 

        if (nbSocietes === 0) { 
            montant = jeu.de.valeurAffichee * 4; // 1 société -> 4 fois le résultat du dé
        }  
        else { 
            montant = jeu.de.valeurAffichee * 10;           // 2 societes -> 10 fois le résultat
        }                              

        return montant; 
    }
   
}

// #endregion


// #region Case d'action 

export class CaseAction extends CaseJeu {
    constructor(nom, type = null, prix = null) {
        super(nom); 
        this.type = type; 
        this.effets = [];
        this.prix = prix; 
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    arriver(joueur, jeu) {
        console.log(`Arrivée sur la case d'action: ${this.nom}`);
        console.log('effets', this.effets)
        const messagesEffets = [];
       
        if (this.effets.length === 0) { 
            console.log('Aucun effet associé à cette case d\'action.'); 
        } 

        for (let effet of this.effets) {
            const messages = effet.appliquer(joueur, jeu, jeu.banque); // return array de messages
            messagesEffets.push(...messages);
        }

        // return []; // vide pour les propositions sinon undefined 
        console.log("Messages des effets appliqués  (caseJeu):", messagesEffets);
        return messagesEffets;
    }

    calculerLoyer(jeu=null) { 
        console.log('JE SUIS UNE CASE D\'ACTION !');
        return 0; // montant loyer = 0
    }
}

// #endregion


