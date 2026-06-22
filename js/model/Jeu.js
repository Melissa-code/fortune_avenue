import effetsChanceJson from "../../data/effets_chance.js";
import effetsFondsCommunsJson from "../../data/effets_fonds_communs.js"; 
import TypesMessagesModale from "./enums/TypesMessages.js";  
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet, PiocheEffet } from './Effet.js'; 
import EtatsJeu from './enums/EtatsJeu.js';
import Joueur from './Joueur.js'; 
import De from './De.js';
import Banque from './Banque.js'; 
import { CasePropriete, CaseAction } from './CaseJeu.js';
import { Proposition } from './Proposition.js';
import { CarteEffetsFactory } from './CarteEffetsFactory.js';
import { CaseJeuFactory } from './CaseJeuFactory.js';


class Jeu {
    constructor() {
        this.joueurActuelIndex = 0;
        this.joueurs = []; 
        this.estPartieFinie = false; 
        this.de = new De();
        this.banque = new Banque();
        this.etat = EtatsJeu.EN_COURS; 
        this.listePropositions = []; 
        this.listeStatuts = [];
        this.casesJeu = CaseJeuFactory.chargerDataCasesJeu(); 

        this.piocheChance = CarteEffetsFactory.chargerDataEffetsCartes(effetsChanceJson);
        CarteEffetsFactory.melangerCartes(this.piocheChance);

        this.piocheFondsCommun = CarteEffetsFactory.chargerDataEffetsCartes(effetsFondsCommunsJson);
        CarteEffetsFactory.melangerCartes(this.piocheFondsCommun);
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
        const casesCollection = [];

        for (let caseJeu of this.casesJeu) {
            if (caseJeu.couleur === couleur) {
                casesCollection.push(caseJeu);
            }
        }
        
        if (casesCollection.length === 0) return false; // aucune case de la couleur
        
        for (let caseCollection of casesCollection) {
            if (caseCollection.proprietaire !== joueur) {
                return false; 
            }
        }
        return true;
    }
    
    /**
     * Payer le loyer au proprietaire de la case (autre joueur) si elle en a un 
     * return obj message ou  null
     */
    payerLoyer(joueurCourant, caseJeu) {
        const messages = []; 
        const montantLoyer = caseJeu.calculerLoyer(this); // 0 pour case d'action

        if (montantLoyer > 0) {
            const proprietaire = caseJeu.proprietaire; 
            const versement = new VersementEffet(montantLoyer, joueurCourant, proprietaire ); 
            versement.appliquer(joueurCourant, this.banque); 
            messages.push(`${joueurCourant.nom} paie ${montantLoyer} M de loyer à ${proprietaire.nom} pour la propriété "${caseJeu.nom}".`);
        }
        return messages;
    }

    /**
     * Proposer au joueur options possibles pour sortir de prison (dépend de l'etat du joueur)
     */
    filtrerPropositionsValablesSortiePrison(joueur) {
        const propositions = Proposition.getListePropositionsSortiePrison(); 
        const propositionsValables = [];

        for (let propositionValable of propositions) {
            if (propositionValable.estDisponible(joueur, this)) { 
                propositionsValables.push(propositionValable); 
            }
        }

        return propositionsValables; 
    }

    filtrerPropositionsValablesFondsCommuns(joueur) {
        return Proposition.getListePropositionsFondsCommuns(); 
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 

        joueurCourant.avancer("relatif", valeurDeplacement); //chiffre du dé
        
        const caseJeu = this.casesJeu[joueurCourant.position];

        // check si la case a un propriétaire (-> payer loyer )
        if (caseJeu instanceof CasePropriete && caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            this.listeStatuts = this.payerLoyer(joueurCourant, caseJeu); //loyer: objet message loyer ou null
            return; 
        }
        else if (caseJeu instanceof CasePropriete && caseJeu.proprietaire === joueurCourant) {
            this.listeStatuts = [`${joueurCourant.nom} est sur sa propriété "${caseJeu.nom}".`];
            return;
        }
        
        if (caseJeu instanceof CaseAction) {
            this.listeStatuts  = caseJeu.arriver(joueurCourant, this); //obj message ou liste propositions
            return;
        }

        if (caseJeu instanceof CasePropriete) {
            this.listePropositions = caseJeu.arriver(joueurCourant, this); 
            if (this.listePropositions.length > 0) {
                this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
            }
        }
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
        return this.createMessage("Refus", {
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

// chercher comment déclencher 2e effet après effet pioche (ex: carte chance 2: payer 50 M à chaque joueur)
// ecrire payer un loyer dans evenemnts + hypothequer a corriger 