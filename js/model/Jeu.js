import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import ImagesPions from "./enums/ImagesPions.js";
import Joueur from './Joueur.js'; 
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';
import De from './De.js';
import Banque from './Banque.js'; 
import EtatsJeu from './enums/EtatsJeu.js';
import { CaseSociete, CaseGare } from './CaseJeu.js';

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

    payerLoyer(joueurCourant, caseJeu) {
        const indexLoyer = caseJeu.calculerLoyer();

        if (indexLoyer >= 0) {
            let montant = caseJeu.loyers[indexLoyer]; 
            const proprietaire = caseJeu.proprietaire; 
            console.log("joueurcourant : ", joueurCourant.nom, "paie ", montant, "* le dé à ", proprietaire.nom); 

            // case "Société": loyer en fonction du résultat du dé
            if (caseJeu instanceof CaseSociete) {
                const resultatDe = this.de.valeurAffichee;
                console.log("résultat du dé pour calcul loyer société : ", resultatDe);

                if (indexLoyer === 0) { montant = resultatDe * 4; } // 1 société -> 4 fois le résultat du dé
                else { montant = resultatDe * 10; } // 2 sociétés -> 10 fois le résultat du dé
            }

            joueurCourant.payer(montant); 
            proprietaire.recevoir(montant); 
        }
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre affiché sur le dé
        
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        // check si la case a un propriétaire (-> payer loyer )
        if (caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            this.payerLoyer(joueurCourant, caseJeu); 
        }

        // propositions au joueur 
        this.listePropositions = caseJeu.arriver(joueurCourant);
        if (this.listePropositions.length <= 1) { 
            this.changerJoueur(); 
        } else { 
            this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
        }
        return this.listePropositions;
    }

    soumettreProposition(numProposition) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]
        const numProp = numProposition - 1; // n-1 dans la liste de propositions
        console.log("numProp dans jeu ", numProp);

        if (numProp >= this.listePropositions.length || numProp < 0) {
            console.log("hors jeu")
            return;
        }
        
        // le dernier chiffre permet de sortir du menu de propositions sans en choisir une
        if (numProp === this.listePropositions.length) {
            this.etat = EtatsJeu.EN_COURS;
            return;
        }

        // valider une proposition
        this.listePropositions[numProp].valider(joueurCourant, this.casesJeu[joueurCourant.position], this.banque);
        this.etat = EtatsJeu.EN_COURS;
        console.log('etat du jeu ap validation proposition : ' , this.etat)

        this.changerJoueur();
    }

    verifierFinDuJeu() {

    }
}

export default Jeu; 

