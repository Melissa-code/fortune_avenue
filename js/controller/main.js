import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';
import View from '../view/View.js';
import Controller from '../controller/Controller.js'; 


function demarrer() {
    const jeu = new Jeu(); 
    const controller = new Controller(jeu); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", PionsDisponibles.BASKET)
    const joueur2 = jeu.ajouterJoueur("Pierre", PionsDisponibles.DRONE)
    
    jeu.casesJeu;
    const view = new View(jeu, controller, document, 800); 
    jeu.view = view;
}

demarrer();
