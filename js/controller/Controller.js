import ImagesPions from '../model/enums/ImagesPions.js';
import Jeu from '../model/Jeu.js';
import { Proposition } from '../model/Proposition.js';
import EtatsJeu from '../model/enums/EtatsJeu.js';

class Controller {
    constructor(jeu) {
        this.jeu = jeu;
        this.propositions = [];
    }

    jouerCarte() {
        const reponse = this.jeu.jouerCarteSortiePrison(); 
    }

    lancerDe() {
        //sécurité: ne pas lancer de dé si en attente de proposition
        if (this.jeu.etat !== EtatsJeu.EN_COURS) return; 

        let valeurDeplacement = this.jeu.de.lancer();
        
        console.log("val depla",valeurDeplacement)
        const reponseCase = this.jeu.avancerJoueurCourant(valeurDeplacement);

        this.view.refresh();

        // if (reponseCase && reponseCase.titre) {
        //     this.view.afficherTexteModale(reponseCase.titre, reponseCase.message);
        //     setTimeout(() => {
        //         this.view.refresh();
        //         this.jeu.terminerTour();
        //         this.view.refresh();
        //     }, 2000);
        // }

        //cf https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
        if (reponseCase.length > 0) {
            this.propositions = reponseCase; 
            this.view.afficherMenuPropositions(this.propositions);
        }   
    
        else {
            console.log("Aucun message ou proposition à afficher.");
            // this.jeu.terminerTour();
            this.view.refresh();
        }
    }

    /**
     * numProposition (n° proposition choisie par le user)
     * recupérer message , ex: "Achat", "Le joueur ... a acheté la case ..." qui disparait ap 3sec 
     */
    soumettreProposition(numProposition) {
        if (this.jeu.etat === EtatsJeu.EN_ATTENTE &&! isNaN(numProposition)) {
            const resultat = this.jeu.soumettreProposition(numProposition); 
            this.view.refresh();

            if (resultat) {
                this.view.afficherTexteModale(resultat.titre, resultat.message);
                setTimeout(() => {
                    this.view.refresh();
                    this.jeu.terminerTour();
                    this.view.refresh();
                }, 2000);
            }
        } 
    }
}

export default Controller;
