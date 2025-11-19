import Jeu from '../model/Jeu.js';
import View from '../view/View.js'; 

async function demarrer() {
    const jeu = new Jeu(); 
    const view = new View(jeu, document, 0, 0); 

    await jeu.initialiserJeu(); 
    console.log('40 Cases du plateau:', jeu.plateauJeu.casesJeu);
}

demarrer();
