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


    //tester possederTouteLaCollectionCases
    // joueur1.proprietes = [jeu.casesJeu[1], jeu.casesJeu[3]];
    // jeu.casesJeu[1].proprietaire = joueur1;
    // jeu.casesJeu[3].proprietaire = joueur1;

    // joueur1.position = 1;
    // jeu.etat = 'EN_ATTENTE';
    // // jeu.casesJeu[1].nombreMaisons = 4; 
    // jeu.listePropositions = window.jeu.casesJeu[1].filtrerPropositionsValables(window.jeu.getJoueurs()[0], window.jeu);
  

    const view = new View(jeu, controller, document); // view appelle controller pour signaler les actions user (click, choix proposition) 
    controller.view = view; // controller appelle view pour afficher les propositions et refresh ap actions user

    controller.view.refresh();
}

demarrer(window.jeu);
