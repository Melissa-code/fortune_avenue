import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';
import View from '../view/View.js';


function demarrer() {
    const jeu = new Jeu(); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", PionsDisponibles.BASKET)
    const joueur2 = jeu.ajouterJoueur("Pierre", PionsDisponibles.DRONE)
    jeu.casesJeu;
    const view = new View(jeu, document, 800); 
    jeu.view = view;

    const canvas = document.querySelector("#game-canvas");

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left; //x coin gauche du canvas
      const y = event.clientY - rect.top; //y haut du canvas
    
      let cible = view.identifierCible(x, y); //return type de Cible);

      if (cible === "DE") {
        const resultatDe = jeu.de.lancer();
        const listePropositions = jeu.avancerJoueurCourant(resultatDe);

        //method view à controler par controleur pour afficher une liste de saisie (pop in pop up modal)
        //et return choix sélectionné
        //ensuite controller signale le choix pour l'appliqer (model)
      
        view.refresh();
        view.afficherMenuPropositions(listePropositions);
      }
    });
     
}

demarrer();
