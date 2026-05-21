// throw new Error("STOP ! LE FICHIER EST BIEN LU");
import TypesMessagesModale from "./enums/TypesMessagesModale.js";  
import EtatsJeu from './enums/EtatsJeu.js';
import Joueur from './Joueur.js'; 
import De from './De.js';
import Banque from './Banque.js'; 
import { CasePropriete, CaseAction } from './CaseJeu.js';
import { Proposition } from './Proposition.js';
import effetsChanceJson from "../../data/effets_chance.js";
import effetsFondsCommunsJson from "../../data/effets_fonds_communs.js"; 
import { CarteEffetsFactory } from './CarteEffetsFactory.js';
import { CaseJeuFactory } from './CaseJeuFactory.js';
// import { Carte } from "./Carte.js";


class Jeu {
    constructor() {
        console.log("Initialisation du jeu...");
        this.joueurActuelIndex = 0;
        this.joueurs = []; 
        this.estPartieFinie = false; 
        this.de = new De();
        this.banque = new Banque();
        this.etat = EtatsJeu.EN_COURS; 
        this.listePropositions = []; 

        this.casesJeu = CaseJeuFactory.chargerDataCasesJeu(); 

        this.piocheChance = CarteEffetsFactory.chargerDataEffetsCartes(effetsChanceJson);
        CarteEffetsFactory.melangerCartes(this.piocheChance);

        this.piocheFondsCommun = CarteEffetsFactory.chargerDataEffetsCartes(effetsFondsCommunsJson);
        CarteEffetsFactory.melangerCartes(this.piocheFondsCommun);

        // console.log("cartes fonds communs : ", this.piocheFondsCommun);
   
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
            console.log(joueurCourant.nom + "paye " + montantLoyer + " à " + proprietaire.nom)

            return this.createMessage("loyer", {
                joueur: joueurCourant.nom,  
                propriete: caseJeu.nom,
                montant: montantLoyer,
                proprietaire: proprietaire.nom  
            }); 
        } 

        // return null; 
        return [[], []]; 
    }

    /**
     * Proposer au joueur options possibles pour sortir de prison (dépend de l'etat du joueur)
     */
    filtrerPropositionsValablesSortiePrison(joueur, jeu) {
        const propositions = Proposition.getListePropositionsSortiePrison(); 
        const propositionsValables = [];

        for (let propositionValable of propositions) {
            if (propositionValable.estDisponible(joueur, jeu)) { 
                propositionsValables.push(propositionValable); 
            }
        }

        return propositionsValables; 
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 

        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre du dé
        
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        console.log("Case:", caseJeu.nom, "- Type:", caseJeu.constructor.name);

        // check si la case a un propriétaire (-> payer loyer )
        if (caseJeu instanceof CasePropriete && caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            return this.payerLoyer(joueurCourant, caseJeu); //loyer: objet message loyer ou null
        }
        
        // []array de messages des effets appliqués
        if (caseJeu instanceof CaseAction) {
            const messagesEffets = caseJeu.arriver(joueurCourant, this); 
            console.log("Messages des effets :", messagesEffets);
            return [messagesEffets, []]; 
        }

        // []array de propositions valables (acheter, payer loyer, decliner...)
        else if (caseJeu instanceof CasePropriete) {
            this.listePropositions = caseJeu.arriver(joueurCourant, this); 
            if (this.listePropositions.length > 0) {
                this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
                return [[], this.listePropositions]; 
            }
        }

        this.terminerTour();
        return [[],[]]; //pas d'effets pour les cases Départ/Parc/Visite Prison 
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

        if (numProp < 0 || numProp > this.listePropositions.length) return; 

        // sortir du menu de propositions (dernier chiffre)
        if (numProp === this.listePropositions.length) return this.decliner(joueurCourant, this.casesJeu[joueurCourant.position]);
        
        // Valider proposition (bool) et appliquer ses effets (ex: acheter la case/payer pour sortir de prison...)
        const success = this.listePropositions[numProp].valider(joueurCourant, this, this.casesJeu[joueurCourant.position], this.banque);
        if (!success) return; 

        return success;
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

// cartes chance: 
// faire l'effet piocherCarte 
// jouer position 7 carte chance 

// sinon perdu jeu fini