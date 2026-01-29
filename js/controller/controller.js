import PionsDisponibles from '../model/enums/PionsDisponibles.js';
import Jeu from '../model/Jeu.js';
import De from '../model/De.js';
import View from '../view/View.js';

function demarrer() {
    const jeu = new Jeu(); 

    //joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", PionsDisponibles.BASKET)
    const joueur2 = jeu.ajouterJoueur("Pierre", PionsDisponibles.DRONE)
    console.log(jeu.getJoueurs());

    jeu.casesJeu ;
    //console.log('40 Cases du plateau:', jeu.casesJeu);

    const view = new View(jeu, document, 650); 
    jeu.view = view;

    const canvas = document.querySelector("#game-canvas");
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left; //x coin gauche du canvas
      const y = event.clientY - rect.top; //y haut du canvas
    
      let cible = view.identifierCible(x, y); //return type de Cible);
       // si la cible est le de, jouer le des dans le modele (jeu)
       // jouer le des dans le modele consiste a ler lancer, recuperer le total et faire avancer 
       // le joureur courant de la position du des

      if (cible === "DE") {
        // console.log('cible: ' + cible);
        const resultatDe = jeu.de.lancer();
    
        jeu.avancerJoueurCourant(resultatDe);//listeProp

        //method view à controler par controleur pour afficher une liste de saisie (pop in pop up modal)
        //et return choix sélectionné
        //ensuite controller signale le choix pour l'appliqer (model)
      

        view.refresh();
      }
    });
     
}

demarrer();
