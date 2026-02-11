import PionsDisponibles from './js/model/enums/PionsDisponibles.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js'; 


function demarrer() {
    const jeu = new Jeu(); 
    const controller = new Controller(jeu); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", PionsDisponibles.LEVRIER)
    const joueur2 = jeu.ajouterJoueur("Pierre", PionsDisponibles.VOITURE)
    
    jeu.casesJeu;
    const view = new View(jeu, controller, document, 800); 
    jeu.view = view;
}

demarrer();
