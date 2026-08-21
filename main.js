import ImagesPions from './js/model/enums/ImagesPions.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js';

/**
 * Démarre une nouvelle partie: crée le jeu, les joueurs, 
 * le controller et la vue (les relie entre eux)
 */
function demarrer() {
    const jeu = new Jeu();
    const controller = new Controller(jeu);

    jeu.ajouterJoueur("Melissa", ImagesPions.MOTO);
    jeu.ajouterJoueur("Pierre", ImagesPions.SMARTPHONE);

    // view appelle controller pour signaler les actions user (click, choix proposition)
    const view = new View(jeu, controller, document);
    // controller appelle view pour afficher les propositions et rafraîchir après les actions user
    controller.view = view;
    controller.view.refresh();

    return jeu;
}

// var globale pour debug avec window.jeu dans la console
window.jeu = demarrer();

