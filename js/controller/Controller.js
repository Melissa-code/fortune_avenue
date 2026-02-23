import ImagesPions from '../model/enums/ImagesPions.js';
import Jeu from '../model/Jeu.js';
import { Proposition } from '../model/Proposition.js';
import EtatsJeu from '../model/enums/EtatsJeu.js';

class Controller {
    constructor(jeu) {
        this.jeu = jeu;
        this.propositions = [];
    }

    lancerDe() {
        //sécurité: ne pas lancer de dé si en attente de proposition
        if (this.jeu.etat !== EtatsJeu.EN_COURS) return; 

        const valeurDeplacement = this.jeu.de.lancer();
        this.propositions = this.jeu.avancerJoueurCourant(valeurDeplacement);
        if (this.propositions.length > 0) {
            this.view.afficherMenuPropositions(this.propositions);
        } 
    }

    /**
     * numProposition (n° proposition choisie par le user)
     * recupérer message , ex: "Achat", "Le joueur ... a acheté la case ..."
     */
    soumettreProposition(numProposition) {
        if (this.jeu.etat === EtatsJeu.EN_ATTENTE &&! isNaN(numProposition)) {
            const resultat = this.jeu.soumettreProposition(numProposition); 
            this.view.refresh();

            if (resultat) {
                this.view.afficherTexteModale(resultat.titre, resultat.message);
            }
        } 
    }
}


export default Controller;
