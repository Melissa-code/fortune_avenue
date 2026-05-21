import ImagesPions from './js/model/enums/ImagesPions.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js';

window.jeu = new Jeu(); 


function demarrer(jeu) {
    // const jeu = new Jeu(); 
    const controller = new Controller(jeu); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa\naaa", ImagesPions.MOTO)
    const joueur2 = jeu.ajouterJoueur("Pierre", ImagesPions.SMARTPHONE)

    //joueur1.estEnPrison=true;
    // joueur1.position=2;
    joueur2.carteChanceSortiePrison=true;
    
    const view = new View(jeu, controller, document, 800); // view appelle controller pour signaler les actions user (click, choix proposition) 
    controller.view = view; // controller appelle view pour afficher les propositions et refresh ap actions user
}

demarrer(window.jeu);
