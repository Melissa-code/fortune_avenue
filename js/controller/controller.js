import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';
import View from '../view/View.js';

function demarrer() {
    const jeu = new Jeu(); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", PionsDisponibles.BASKET)
    const joueur2 = jeu.ajouterJoueur("Pierre", PionsDisponibles.DRONE)
    console.table(jeu.getJoueurs());

    joueur1.avancer('relatif', 5);
    joueur2.avancer('absolu', 38);
    console.log(`Position de ${joueur1.nom} = ${joueur1.position}`);
    console.log(`Position de ${joueur2.nom} = ${joueur2.position}`);

    jeu.casesJeu ;
    //console.log('40 Cases du plateau:', jeu.casesJeu);

    const view = new View(jeu, document, 650); 
    jeu.view = view;
    view.refresh();
}

demarrer();
