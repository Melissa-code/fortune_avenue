import EtatsJeu from '../model/enums/EtatsJeu.js';

class Controller {
    constructor(jeu) {
        this.jeu = jeu;
        this.propositions = [];
    }

    sortirDePrison(joueurCourant) {
        const propositionsSortiePrison = this.jeu.filtrerPropositionsValablesSortiePrison(joueurCourant);
        this.view.refresh();

        if (propositionsSortiePrison.length > 0) {
            this.jeu.listePropositions = propositionsSortiePrison; 
            this.jeu.etat = EtatsJeu.EN_ATTENTE; 
            this.view.afficherMenuPropositions(this.jeu.listePropositions, this.jeu.joueurActuelIndex);
            return; 
        }
    }

    lancerDe() {
        if (this.jeu.etat !== EtatsJeu.EN_COURS) return; //sécurité: ne pas lancer le dé si en attente de propositions

        const joueurCourant = this.jeu.joueurs[this.jeu.joueurActuelIndex];

        // vérifier si joueur courant est en prison -> essayer de sortir 
        if (joueurCourant.estEnPrison) {
            this.sortirDePrison(joueurCourant); 
            return; 
        }

        // lancer le dé et avancer 
        let valeurDeplacement = this.jeu.de.lancer();
        this.jeu.listePropositions = []; 
        this.jeu.listeStatuts = []; //pour le vider à chaque tour
        this.view.refresh();

        try {
            this.jeu.avancerJoueurCourant(valeurDeplacement);  
        } catch (error) {
            console.error("ERREUR avancerJoueurCourant:", error.stack);
        }

        try {
            this.view.refresh();
        } catch (error) {
            console.error("ERREUR refresh:", error.stack);
        }

        if (this.jeu.listePropositions.length > 0) {
            if (this.jeu.listeStatuts.length > 0 && this.jeu.listeStatuts[0].startsWith("**Fonds communs")) {
                // carte avec choix -> afficher événements d'abord puis modale
                this.view.afficherZoneEvenements();
                setTimeout(() => {
                    this.view.afficherMenuPropositions(this.jeu.listePropositions, this.jeu.joueurActuelIndex);
                }, 4000);
            } else {
                this.view.afficherMenuPropositions(this.jeu.listePropositions, this.jeu.joueurActuelIndex);
            }
        } 
        else if (this.jeu.listeStatuts.length > 0) {
            this.view.afficherZoneEvenements(); 

            // modale propositions après carte 
            if (this.jeu.caseApresDeplacementCarte) {
                console.log("stockage case arrivée:", this.jeu.casesJeu[this.jeu.joueurs[this.jeu.joueurActuelIndex].position].nom); 
                setTimeout(() => {
                    const caseArrivee = this.jeu.caseApresDeplacementCarte;
                    this.jeu.caseApresDeplacementCarte = null;
                    
                    const propositions = caseArrivee.arriver(this.jeu.joueurs[this.jeu.joueurActuelIndex], this.jeu);
                    if (propositions && propositions.length > 0) {
                        this.jeu.listePropositions = propositions;
                        this.jeu.etat = EtatsJeu.EN_ATTENTE;
                        this.view.refresh();
                        this.view.afficherMenuPropositions(this.jeu.listePropositions, this.jeu.joueurActuelIndex);
                    } else {
                        this.jeu.terminerTour();
                    }
                }, 4000); 
            } else {
            this.jeu.terminerTour();
            }
        } else {
            this.jeu.terminerTour();
        }
    }

    /**
     * numProposition (n° proposition choisie par le user)
     * recupérer message qui disparait ap 2sec 
     */
    soumettreProposition(numProposition) {
        if (this.jeu.etat === EtatsJeu.EN_ATTENTE && !isNaN(numProposition)) {
            const resultat = this.jeu.soumettreProposition(numProposition); 
            this.view.refresh();

            if (resultat) {
                this.view.afficherTexteModale(resultat.titre, resultat.message);
                setTimeout(() => {
                    this.view.refresh();

                    // si listeStatuts après proposition, afficher zoneEvenements
                    if (this.jeu.listeStatuts.length > 0) {
                        this.view.afficherZoneEvenements();
                    }
                    this.jeu.terminerTour();
                    this.view.refresh();
                }, 2000);
            }
        } 
    }
}

export default Controller;
