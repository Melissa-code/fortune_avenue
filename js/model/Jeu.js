import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import Joueur from './Joueur.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import PionsDisponibles from "./enums/PionsDisponibles.js";
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';
import De from './De.js';
import Banque from './Banque.js'; 


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

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 

        joueurCourant.avancer("relatif", valeurDeplacement) //avec dé

        const caseJeu = this.casesJeu[joueurCourant.position]; 
        const listePropositions = caseJeu.arriver(joueurCourant, this);

        if (listePropositions.length <= 0) this.changerJoueur(); 
    
        return listePropositions; 
    }

    jouer() {

    }

    determinerCaseOccupee(joueur, numeroCase) {

    }

    envoyerEnPrison() {

    }

    proposerAchat() {
        
    }

    piocherCarteChance() {

    }

    piocherCarteFondsCommun() {

    }

    verifierFinDuJeu() {

    }
}

export default Jeu; 
