import ImagesPions from './js/model/enums/ImagesPions.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js';
import EtatsJeu from './js/model/enums/EtatsJeu.js';


window.jeu = new Jeu(); // var globale pour debug avec window.jeu dans console

function demarrer(jeu) {
    const controller = new Controller(jeu);
    // window.controller = controller; 

    const joueur1 = jeu.ajouterJoueur("Melissa", ImagesPions.MOTO);
    const joueur2 = jeu.ajouterJoueur("Pierre", ImagesPions.SMARTPHONE);

    const view = new View(jeu, controller, document); // view appelle controller pour signaler les actions user (click, choix proposition) 
    controller.view = view; // controller appelle view pour afficher les propositions et refresh ap actions user

    controller.view.refresh();

    //  TEST 
    joueur1.position = 22;
    const caseChance = jeu.casesJeu[22];
    jeu.listeStatuts = caseChance.arriver(joueur1, jeu);
    controller.view.refresh();

}

demarrer(window.jeu);
