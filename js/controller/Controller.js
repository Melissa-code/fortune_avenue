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
        console.log(" LANCER DE"); 
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
            console.error("erreur avancerJoueurCourant:", error);
        }

        try {
            this.view.refresh();
        } catch (error) {
            console.error("erreur view.refresh():", error);
        }

        //DEBUG
        console.log("après refresh - listeStatuts:", this.jeu.listeStatuts.length);
        console.log("listePropositions:", this.jeu.listePropositions.length);
        console.log("caseApresDeplacementCarte:", this.jeu.caseApresDeplacementCarte);

        if (this.jeu.listePropositions.length > 0) {
            this.view.afficherMenuPropositions(this.jeu.listePropositions, this.jeu.joueurActuelIndex);
        } 
        else if (this.jeu.listeStatuts.length > 0) {
            this.view.afficherZoneEvenements(); 

            console.log("caseApresDeplacementCarte:", this.jeu.caseApresDeplacementCarte); // DEBUG

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
     * recupérer message , ex: "Achat", "Le joueur ... a acheté la case ..." qui disparait ap 2sec 
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
