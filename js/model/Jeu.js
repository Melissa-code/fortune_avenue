import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import ImagesPions from "./enums/ImagesPions.js";
import Joueur from './Joueur.js'; 
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';
import De from './De.js';
import Banque from './Banque.js'; 
import EtatsJeu from './enums/EtatsJeu.js';

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
            const montant = caseJeu.loyers[indexLoyer]; 
            const proprietaire = caseJeu.proprietaire; 
            console.log("proprietaire : ", proprietaire.nom, "paie ", montant, " à ", proprietaire.nom); 

            joueurCourant.payer(montant); 
            proprietaire.recevoir(montant); 
        }
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre affiché sur le dé
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        console.log(caseJeu)

        // check si proprietaire de la case 
        if (caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            this.payerLoyer(joueurCourant, caseJeu); 
        }

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

