import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import ImagesPions from "./enums/ImagesPions.js";
import TypesMessagesModale from "./enums/TypesMessagesModale.js";   
import Joueur from './Joueur.js'; 
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';
import De from './De.js';
import Banque from './Banque.js'; 
import EtatsJeu from './enums/EtatsJeu.js';
import { CasePropriete, CaseSociete, CaseGare, CaseAction } from './CaseJeu.js';

class Jeu {
    constructor() {
        this.joueurActuelIndex = 0;
        this.joueurs = []; 
        this.estPartieFinie = false; 
        this.de = new De();
        this.piocheChance = [];
        this.piocheFondsCommun = []; 
        this.casesJeu = CaseJeuFactory.chargerDataCasesJeu(); 
        this.cartesChances = CarteFactory.chargerDataEffetsChance();
        this.banque = new Banque();
        this.etat = EtatsJeu.EN_COURS; 
        this.listePropositions = []; 
        //console.log("effets ", this.casesJeu[30].effets)
    }

    ajouterJoueur(nom, pion) {
        const joueur = new Joueur(nom, pion); 
        this.joueurs.push(joueur);

        return joueur;
    }

    determinerPremierJoueur() {

    }

    getJoueurs() {
        return this.joueurs;
    }

    changerJoueur() {
        this.joueurActuelIndex = (this.joueurActuelIndex + 1) % this.joueurs.length;
    }


    /**
     * Posséder toutes les cases Rue de la meme couleur 
     */
    possederTouteLaCollectionCases(joueur, couleur) {
        for (let caseJeu of this.casesJeu) {
            if (caseJeu.couleur === couleur && caseJeu.proprietaire !== joueur )
                return false;
            }
        return true;
    }
    
    /**
     * Payer le loyer au proprietaire de la case (autre joueur) si elle en a un 
     * return obj message ou  null
     */
    payerLoyer(joueurCourant, caseJeu) {
        const montantLoyer = caseJeu.calculerLoyer(this); //0 pour case d'action

        if (montantLoyer > 0) {
            const proprietaire = caseJeu.proprietaire; 
            joueurCourant.payer(montantLoyer); 
            proprietaire.recevoir(montantLoyer); 

            return this.createMessage("loyer", {
                joueur: joueurCourant.nom,  
                propriete: caseJeu.nom,
                montant: montantLoyer,
                proprietaire: proprietaire.nom  
            }); 
        } 

        return null; 
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 

        // estt prison
        if (joueurCourant.estEnPrison) {
            if (valeurDeplacement === 12) {
                joueurCourant.estEnPrison = false; 
                this.etat = EtatsJeu.EN_COURS;
                return []; 
            } else {
                this.terminerTour() ;
                return [];
            }
        }

        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre du dé
        
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        console.log("Case:", caseJeu.nom, "- Type:", caseJeu.constructor.name);

        // check si la case a un propriétaire (-> payer loyer )
        if (caseJeu instanceof CasePropriete && caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            return this.payerLoyer(joueurCourant, caseJeu); //loyer: objet message loyer ou null
        }
        
        this.listePropositions = caseJeu.arriver(joueurCourant, this); // []array de propositions valables (acheter, payer loyer, decliner...)

        // if (effets && effets.titre) {
        //     return effets;
        // } else 
        if (this.listePropositions.length > 0) {
            //this.listePropositions = effets; // propositions au joueur 

            this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
            console.log(this.listePropositions)
            return this.listePropositions; // []array de propositions valables (acheter, payer loyer, decliner...)
        }

        this.terminerTour();
        return []; //pas d'effets pour les cases Départ/Parc/Prison 
    }

    /**
     * Choix message (dans modale) en fonction du type d'action: achat, loyer, chance/fonds commun, taxe... 
     */
    createMessage(type, details) {
        const message = TypesMessagesModale[type](details); //enum 
        const messageError = { titre: "Erreur: ", message: details };
        return (message) ? message : messageError ; 
    }

    /**
     * Refuser l'achat d'une propriété (proposition)
     */
    decliner(joueurCourant, casePropriete) {
        return this.createMessage("refus", {
            joueur: joueurCourant.nom,
            propriete: casePropriete.nom
        });
    }   

    /**
     * Valider proposition du joueur et appliquer ses effets
     */
    soumettreProposition(numProposition) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        const numProp = numProposition - 1; // n-1 dans la liste de propositions

        if (numProp > this.listePropositions.length || numProp < 0) return; 

        // sortir du menu de propositions (dernier chiffre)
        if (numProp === this.listePropositions.length ) return this.decliner(joueurCourant, this.casesJeu[joueurCourant.position]);
        
        // Valider proposition (bool) et appliquer ses effets (ex: acheter la case/payer pour sortir de prison...)
        const success = this.listePropositions[numProp].valider(joueurCourant, this.casesJeu[joueurCourant.position], this.banque);
        if (!success) return; 

        return this.createMessage("achat", {
            joueur: joueurCourant.nom,  
            propriete: this.casesJeu[joueurCourant.position].nom,
            montant: this.casesJeu[joueurCourant.position].prixAchat
        });
    }

    terminerTour() {
        this.etat = EtatsJeu.EN_COURS;
        this.changerJoueur(); 
        // this.verifierFinJeu(); 
    }   

    verifierFinJeu() {

    }
}

export default Jeu; 

// logique prison: 3 essais de 12 pour sortir :compteurPourSortirPrison = 0; 
// sinon payer 
// sinon avoir une carte chance (conservée)
// sinon acheter à l'autre joueuur sa carte sortir de prison : commbien? 
// sinon perdu jeu fini