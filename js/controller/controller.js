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
        if (this.jeu.etat !== EtatsJeu.EN_COURS)  return ;

        const valeurDeplacement = this.jeu.de.lancer();
        this.propositions = this.jeu.avancerJoueurCourant(valeurDeplacement);

        if (this.propositions.length > 0) {
            console.log("Propositions disponibles :", this.propositions);  
            this.view.afficherMenuPropositions(this.propositions);
        }
    }

    soumettreProposition(numProposition) {
        if (this.jeu.etat === EtatsJeu.EN_ATTENTE &&! isNaN(numProposition)) {
            this.jeu.soumettreProposition(numProposition);
            this.view.refresh();
        } 
    }

}

export default Controller;