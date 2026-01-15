import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';
import View from '../view/View.js'; 

async function demarrer() {
    const jeu = new Jeu(); 
    jeu.ajouterJoueur("Melissa", PionsDisponibles.BASKET)
    jeu.ajouterJoueur("Pierre", PionsDisponibles.DRONE)

    jeu.casesJeu ;
    console.log('40 Cases du plateau:', jeu.casesJeu);

    const view = new View(jeu, document, 650, 650); 
    jeu.view = view;
   

}

demarrer();
