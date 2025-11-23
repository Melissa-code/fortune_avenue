import { Carte, CarteAction, Effet, DeplacementEffet, VersementEffet, PrisonEffet, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import Joueur from './Joueur.js'; 
import PlateauJeu from './PlateauJeu.js';

class Jeu {

    constructor() {
        this.joueurActuel = 1;
        this.joueurs = []; 
        this.plateauJeu = new PlateauJeu(); 
        this.partieFinie = false; 
    }

    async initialiserJeu() {
        await this.plateauJeu.chargerDataCasesJeu('../../data/cases_jeu.json');
    }

    determinerPremierJoueur() {

    }

    distribuerArgent() {

    }

    lancerDes() {

    }

    changerJoueur() {

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