import ImagesPions from './js/model/enums/ImagesPions.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js';


function demarrer() {
    const jeu = new Jeu(); 
    const controller = new Controller(jeu); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", ImagesPions.MOTO)
    const joueur2 = jeu.ajouterJoueur("Pierre", ImagesPions.SMARTPHONE)
    
    jeu.casesJeu;

    const view = new View(jeu, controller, document, 800); 
    controller.view = view;
}

demarrer();
