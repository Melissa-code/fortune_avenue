import ImagesPions from './js/model/enums/ImagesPions.js';
import Jeu from './js/model/Jeu.js';
import View from './js/view/View.js';
import Controller from './js/controller/Controller.js';

window.jeu = new Jeu(); // var globale pour debug avec window.jeu dans console

function demarrer(jeu) {
    const controller = new Controller(jeu); 

    // création des 2 joueurs
    const joueur1 = jeu.ajouterJoueur("Melissa", ImagesPions.MOTO)
    const joueur2 = jeu.ajouterJoueur("Pierre", ImagesPions.SMARTPHONE)

    // calcul dynamique taille du plateau (40% largeur ecran)
    const largeurEcran = window.innerWidth;
    let taillePlateauJeu = Math.floor(largeurEcran * 0.40); //40%
    if (taillePlateauJeu > 768) taillePlateauJeu = 768; 
    if (taillePlateauJeu < 550) taillePlateauJeu = 550;

    const view = new View(jeu, controller, document, taillePlateauJeu); // view appelle controller pour signaler les actions user (click, choix proposition) 
    controller.view = view; // controller appelle view pour afficher les propositions et refresh ap actions user
}

demarrer(window.jeu);
