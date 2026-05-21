import EtatsJeu from '../model/enums/EtatsJeu.js';


class Controller {
    constructor(jeu) {
        this.jeu = jeu;
        this.propositions = [];
    }

    sortirDePrison(joueurCourant) {
        const propositionsSortiePrison = this.jeu.filtrerPropositionsValablesSortiePrison(joueurCourant, jeu);
        this.view.refresh();

        if (propositionsSortiePrison.length > 0) {
            this.jeu.listePropositions = propositionsSortiePrison; 
            this.jeu.etat = EtatsJeu.EN_ATTENTE; 
            this.view.afficherMenuPropositions(this.jeu.listePropositions);
            console.log('Affiche les propositions pour sortir de prison ')
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
        // this.view.refresh();

        this.jeu.avancerJoueurCourant(valeurDeplacement); 

        this.view.refresh();

        if (this.jeu.listePropositions.length > 0) {
            this.view.afficherMenuPropositions(this.jeu.listePropositions); 
        } 
        else if (this.jeu.listeStatuts.length > 0) {
            this.view.afficherZoneStatuts(); 
            this.jeu.terminerTour();
        } 
        else {
            this.jeu.terminerTour();
        }

        // this.view.refresh();
        // TODO [[],[]]
        // faire une zone statut pour affficher messages des effets
        // fix refresh ()
        
        // les info de status seronmt implemente differement que les proposition ( a traver un tableau de statu chez le jeu
        // la vue doit juste afficher le contenu du tableau de status
        // lo model met a jour le tableau de status en fonction des effets
        // 
    }

    /**
     * numProposition (n° proposition choisie par le user)
     * recupérer message , ex: "Achat", "Le joueur ... a acheté la case ..." qui disparait ap 3sec 
     */
    soumettreProposition(numProposition) {
        if (this.jeu.etat === EtatsJeu.EN_ATTENTE && !isNaN(numProposition)) {
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
