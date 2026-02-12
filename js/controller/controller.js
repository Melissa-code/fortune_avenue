import ImagesPions from '../model/enums/ImagesPions.js';
import Jeu from '../model/Jeu.js';
import { Proposition } from '../model/Proposition.js';

class Controller {
    constructor(jeu) {
        this.jeu = jeu;
        this.propositions = [];
    }

    lancerDe() {
        const valeurDeplacement = this.jeu.de.lancer();
        this.propositions = this.jeu.avancerJoueurCourant(valeurDeplacement);

        if (this.propositions.length > 0) {
            console.log("Propositions disponibles ICI :");  
            const modal = this.jeu.view.afficherMenuPropositions(this.propositions);
          
         }
    }

    soumettreProposition(numProposition) {
        this.jeu.soumettreProposition(numProposition);
    }

}

export default Controller;