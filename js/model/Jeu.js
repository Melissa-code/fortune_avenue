import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import Joueur from './Joueur.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import ImagesPions from "./enums/ImagesPions.js";
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

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        joueurCourant.avancer("relatif", valeurDeplacement) //avec dé
        
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        this.listePropositions = caseJeu.arriver(joueurCourant, this);

        if (this.listePropositions.length <= 0) { 
            this.changerJoueur(); 
        } else { 
            this.etat = EtatsJeu.EN_ATTENTE; 
        }

        return this.listePropositions;
    }

    soumettreProposition(numProposition) {
        let numProp = numProposition -1; 
        console.log(numProp);
        if (numProp >this.listePropositions.length)
            return;
        if (numProp==this.listePropositions.length)
        {
            this.etat=EtatsJeu.EN_COURS;
            return;
        }
        const joueurCourant = this.joueurs[this.joueurActuelIndex]
        this.listePropositions[numProp].valider(joueurCourant, this.casesJeu[joueurCourant.position]) ;
            // appliquer la proposition
            
            this.etat=EtatsJeu.EN_COURS;
            console.log('etat' , this.etat)
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


// finir clean jeu
// tester la validation des proposition
// ajouter une proposition de "aucun choix"