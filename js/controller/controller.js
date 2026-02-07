import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';

class Controller {
    constructor(jeu) {
        this.jeu = jeu;
    }

    lancerDe() {
        const valeurDeplacement = this.jeu.de.lancer();
        this.jeu.avancerJoueurCourant(valeurDeplacement);
    }

    soumettreProposition(numProposition) {
        this.jeu.soumettreProposition(numProposition);
    }

}

export default Controller;