import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import Joueur from './Joueur.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import PionsDisponibles from "./enums/PionsDisponibles.js";
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';


class Jeu {
    constructor() {
        this.joueurActuelIndex = 0;
        this.joueurs = []; 
        this.estPartieFinie = false; 
        this.piocheChance = [];
        this.piocheFondsCommun = []; 
        this.casesJeu = CaseJeuFactory.chargerDataCasesJeu(); 
        this.cartesChances = CarteFactory.chargerDataEffetsChance();
    }

    ajouterJoueur(nom, pion) {
        const joueur = new Joueur(nom, pion); 
        this.joueurs.push(joueur);
    }


    
    lancerDes() {

    }

    determinerPremierJoueur() {

    }

    getJoueurs() {
        return this.joueurs;
    }

    changerJoueur() {
        this.joueurActuelIndex = (this.joueurActuelIndex + 1) % this.joueurs.length;
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

// finir l'ajout des actions pour les cases d'action (effetChance)
// faire factory pioches chances et fonds 
// faire le test survoler/atterrir sur Case départ ->recevoir 200 joueur
// vérifier si on peut remplacer entrée/sortie prison par effet déplacement 