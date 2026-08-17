import EtatsJeu from "../model/enums/EtatsJeu.js";

class Controller {
  static DELAI_AFFICHAGE_EVENEMENT = 4000;
  static DELAI_AFFICHAGE_MODALE = 2000;

  constructor(jeu) {
    this.jeu = jeu;
    this.propositions = [];
  }

  sortirDePrison(joueurCourant) {
    const propositionsSortiePrison =
      this.jeu.filtrerPropositionsValablesSortiePrison(joueurCourant);

    this.view.refresh();

    if (propositionsSortiePrison.length > 0) {
      this.jeu.listePropositions = propositionsSortiePrison;
      this.jeu.etat = EtatsJeu.EN_ATTENTE;
      this.view.afficherMenuPropositions(
        this.jeu.listePropositions,
        this.jeu.joueurActuelIndex,
      );
    }
  }

  lancerDe() {
    if (this.jeu.etat !== EtatsJeu.EN_COURS) return; //ne pas lancer le dé si en attente de propositions

    const joueurCourant = this.jeu.joueurs[this.jeu.joueurActuelIndex];

    if (joueurCourant.estEnPrison) {
      this.sortirDePrison(joueurCourant);
      return;
    }

    this.deplacerJoueurCourant();
    this.traiterResultatDeplacement();
  }

  deplacerJoueurCourant() {
    const valeurDeplacement = this.jeu.de.lancer();
    this.jeu.listePropositions = [];
    this.jeu.listeStatuts = [];
    this.view.refresh();

    this.jeu.avancerJoueurCourant(valeurDeplacement);
    this.view.refresh();
  }

  traiterResultatDeplacement() {
    const aDesPropositions = this.jeu.listePropositions.length > 0;
    const aDesStatuts = this.jeu.listeStatuts.length > 0; // msg effets

    if (aDesPropositions) {
      this.afficherPropositionsApresDeplacement();
    } else if (aDesStatuts) {
      this.afficherCarteEtResoudreDeplacementEventuel();
    } else {
      this.jeu.terminerTour();
    }
  }

  /**
   * afficher les propositions après le déplacement du joueur
   * si carte avec choix (Fonds Communs), afficher zoneEvenements puis modale après 4sec
   * sinon afficher modale directement
   */
  afficherPropositionsApresDeplacement() {
    const estCarteAvecChoix =
      this.jeu.listeStatuts[0]?.startsWith("**Fonds communs");

    if (estCarteAvecChoix) {
      this.view.afficherZoneEvenements();
      setTimeout(() => {
        this.view.afficherMenuPropositions(
          this.jeu.listePropositions,
          this.jeu.joueurActuelIndex,
        );
      }, Controller.DELAI_AFFICHAGE_EVENEMENT);
    } else {
      this.view.afficherMenuPropositions(
        this.jeu.listePropositions,
        this.jeu.joueurActuelIndex,
      );
    }
  }

  /**
   * Affiche la carte tirée Chance/Communauté
   * ensuite, si cette carte a envoyé le joueur sur une nouvelle case (ex: "Avancez jusqu'à..."),
   * elle déclenche la résolution de cette nouvelle case après un délai
   */
  afficherCarteEtResoudreDeplacementEventuel() {
    this.view.afficherZoneEvenements();

    if (!this.jeu.caseApresDeplacementCarte) {
      this.jeu.terminerTour();
      return;
    }

    setTimeout(
      () => this.appliquerEffetCaseDestinationCarte(),
      Controller.DELAI_AFFICHAGE_EVENEMENT,
    );
  }

  /**
   * applique l'effet de la case sur laquelle le joueur a atterri
   * à cause de la carte (ex:"avancez à la case Départ")
   * il faut traiter l'arrivée sur cette case Départ
   */
  appliquerEffetCaseDestinationCarte() {
    const caseArrivee = this.jeu.caseApresDeplacementCarte;
    this.jeu.caseApresDeplacementCarte = null;

    const joueurCourant = this.jeu.joueurs[this.jeu.joueurActuelIndex];
    const propositions = caseArrivee.arriver(joueurCourant, this.jeu);

    if (propositions && propositions.length > 0) {
      this.jeu.listePropositions = propositions;
      this.jeu.etat = EtatsJeu.EN_ATTENTE;
      this.view.refresh();
      this.view.afficherMenuPropositions(
        this.jeu.listePropositions,
        this.jeu.joueurActuelIndex,
      );
    } else {
      this.jeu.terminerTour();
    }
  }

  /**
   * numProposition (n° proposition choisie par le user)
   * recupérer message qui disparait ap 2sec
   */
  soumettreProposition(numProposition) {
    if (this.jeu.etat !== EtatsJeu.EN_ATTENTE || isNaN(numProposition)) return;
    if (
      numProposition < 0 ||
      numProposition >= this.jeu.listePropositions.length
    )
      return;

    const resultat = this.jeu.soumettreProposition(numProposition);
    this.view.refresh();

    if (!resultat) return;

    this.view.afficherTexteModale(resultat.titre, resultat.message);
    setTimeout(
      () => this.terminerTourApresModale(),
      Controller.DELAI_AFFICHAGE_MODALE,
    );
  }

  terminerTourApresModale() {
    this.view.refresh();

    if (this.jeu.listeStatuts.length > 0) {
      this.view.afficherZoneEvenements();
    }

    this.jeu.terminerTour();
    this.view.refresh();
  }
}

export default Controller;
