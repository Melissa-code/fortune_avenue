import { Carte, CarteAction } from './Carte.js';
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet, PiocheEffet } from './Effet.js'; 
import { Proposition, PropositionTirerCarteChance, PropositionPayerAmende, PropositionAcheterPropriete, PropositionHypothequer, PropositionLeverHypotheque, PropositionConstruireMaison, PropositionConctruireHotel, PropositionDecliner } from './Proposition.js';
import TypesMessagesModale from "./enums/TypesMessages.js"; 
import EtatsJeu from './enums/EtatsJeu.js';


export class CaseJeu {
    constructor(nom) {
        this.nom = nom;
    }

    arriver(joueur, jeu) {
        return []; // par defaut aucune proposition
    }
}

// Case de proprietes (rue, gare, societe)
export class CasePropriete extends CaseJeu {
    constructor(nom, prix, loyers) {
        super(nom); 
        this.proprietaire = null;
        this.prixAchat = prix || null;
        this.isHypotheque = false; //venduà la banque temporairement -> pas de loyer (lever hyp en payant un suppl à banque)
        this.loyers = loyers;
        this.listePropositionsPropriete = [];
        this.effet = null;
    }

    /**
     * proposer au joueur d'acheter la propriete s'il n'y a pas de proprietaire, sinon proposer de payer le loyer 
     */
    filtrerPropositionsValables(joueur, jeu) {
        // traverser listeProp et prendre celles valides (estDisponible(jeu, joueur, caseJeu) true)
        const propositions = Proposition.getListePropositions(); 
        const propositionsValables = [];

        for (let propositionValable of propositions) {
            if (propositionValable.estDisponible(joueur, this, jeu)) { 
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

    assignerProprietaire(joueur, banque) {
        if (!this.estLibre()) return false;

        const paiement = new VersementEffet(this.prixAchat, "joueur", "banque");
        paiement.appliquer(joueur, banque);

        // MAJ proprietaire 
        this.proprietaire = joueur;          
        joueur.proprietes.push(this);   

        return true;
    }

    /**
     * si la case est libre, proposer d'acheter sinon payer le loyer
     */
    arriver(joueur, jeu) {
        return this.filtrerPropositionsValables(joueur, jeu) || [];
    }

    hypothequer() {
        if (this.proprietaire === joueur && this.isHypotheque) {
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


// Case rue
export class CaseRue extends CasePropriete {
    constructor(nom, prix, loyers, couleur, prixMaison, prixHotel, hypotheque) {
        super(nom, prix, loyers);
        this.nombreMaisons = 0; 
        this.nombreHotels = 0; 
        this.couleur = couleur || null;
        this.prixMaison = prixMaison || null;
        this.prixHotel = prixHotel || null;
        this.hypotheque = hypotheque || null;//montant
    }

    acheter(typeConstruction, banque) {
        if (!this.proprietaire) return; 

        let prixConstruction = 0; 

        switch(typeConstruction) {
            case "maison":
                prixConstruction = this.prixMaison;
                break;
            case "hotel":
                prixConstruction = this.prixHotel;
                break;
            default: 
                console.log('Aucun type de construction reconnu.'); 
        }

        let effet = new VersementEffet(prixConstruction, this.proprietaire, banque);
        effet.appliquer(this.proprietaire, banque);
        
        console.log(`${this.proprietaire.nom} paye ${prixConstruction}€ pour construire un(e) ${typeConstruction}.`);
    }

    construire(typeConstruction, banque) {
        if (typeConstruction === "maison") {
            this.nombreMaisons++; 
            this.acheter("maison", banque);
        } else if (typeConstruction === "hotel") {
            if (this.nombreMaisons === 4) {
                this.nombreHotels++; 
                this.nombreMaisons = 0; 
                this.acheter("hotel", banque);
            }
        } else {
            console.log(`type de construction inconnu: ${type}`)
        }
    }

    /**
     * surcharge de la méthode calculerIndexLoyer pour les rues 
     */
    calculerLoyer(jeu) {
        if (this.isHypotheque || !this.proprietaire) return 0; 

        if (this.nombreHotels > 0) return this.loyers[5];
        if (this.nombreMaisons > 0) return this.loyers[this.nombreMaisons];  // 1 à 4

        if (jeu.possederTouteLaCollectionCases(this.proprietaire, this.couleur)) {
            return this.loyers[this.loyers.length - 1]; //possederTouteLaCollectionCases(joueur, couleur) 
        }
        return this.loyers[0]; //loyer de base
    }
}

// Case gare
export class CaseGare extends CasePropriete {
    constructor(nom, prix, loyers, typeCase, hypotheque) {
        super(nom, prix, loyers);
        this.typeCase = typeCase; 
        this.hypotheque = hypotheque || null;
    }

    calculerLoyer(jeu=null) {
        if (this.hypotheque || this.estLibre()) return 0; 
        let montant = 0; 

        const joueurProprietes = this.proprietaire.proprietes || []; 
        const nbGares = joueurProprietes.filter( (propriete) => propriete instanceof CaseGare).length; 
        
        montant = this.loyers[nbGares -1];
        return montant; 
    }
}

// Case Societe
export class CaseSociete extends CasePropriete {
    constructor(nom, prix, loyers, hypotheque) {
        super(nom, prix, loyers);
        this.hypotheque = hypotheque || null;
    }

    calculerLoyer(jeu) {
        if (this.hypotheque || this.estLibre()) return 0; 
        
        let montant = 0;
        const joueurProprietes = this.proprietaire.proprietes || []; 
        const nbSocietes = joueurProprietes.filter( (propriete) => propriete instanceof CaseSociete).length; 

        if (nbSocietes === 1) { 
            montant = jeu.de.valeurAffichee * 4;  // 1 société -> 4 fois le résultat du dé
        }  
        else { 
            montant = jeu.de.valeurAffichee * 10; // 2 societes -> 10 fois le résultat du dé
        }                              

        console.log("montant loyer société" , montant)
        return montant; 
    }
}

// Case d'action 

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
        if (this.nom === "Fonds communs 13") { 
            console.log("CAse Fonds communs 13: filtrer propositions valables")
            jeu.listePropositions = this.filtrerPropositionsValablesFondsCommuns(joueur);
            jeu.etat = EtatsJeu.EN_ATTENTE; 
            return jeu.listePropositions|| [];
        }

        const messagesEffets = [];
       
        if (this.effets.length === 0) { 
            console.log('Aucun effet associé à cette case d\'action.'); 
        } 

        console.log('effets case',this);

        for (let effet of this.effets) {
            if (effet instanceof VersementEffet) {
                if (effet.montant===undefined)
                    console.trace("effet montant undefined",effet)
            }
            const messages = effet.appliquer(joueur, jeu, jeu.banque); // return array de messages
            messagesEffets.push(...messages);
        }

        return messagesEffets;
    }

    calculerLoyer(jeu=null) {
        return 0; // montant loyer = 0
    }
}



