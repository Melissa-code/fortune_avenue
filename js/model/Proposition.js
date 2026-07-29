import { VersementEffet, PiocheEffet } from "./Effet.js";
import EtatsJeu from "./enums/EtatsJeu.js";
import { CaseRue } from "./CaseJeu.js";

/**
 * classe abstraite pour les propositions faites au joueur
 */
export class Proposition {
  static LISTE_PROPOSITIONS = [];
  static LISTE_PROPOSITIONS_SORTIE_PRISON = [];
  static LISTE_PROPOSITIONS_FONDSCOMMUNS = [];

  constructor(titre, description) {
    this.titre = titre;
    this.description = description;
  }

  estDisponible(_joueur = null, _caseJeu = null, _jeu = null) {}

  valider(_joueur = null, _jeu = null, _caseJeu = null, _banque = null) {}

  /**
   * static car ne depend d'aucune donnee ou etat d'objet
   */
  static getListePropositions() {
    return Proposition.LISTE_PROPOSITIONS;
  }

  static getListePropositionsSortiePrison() {
    return Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON;
  }

  static getListePropositionsFondsCommuns() {
    return Proposition.LISTE_PROPOSITIONS_FONDSCOMMUNS;
  }
}

// ------------------------- sortir de prison ----------------------------

export class PropositionJouerDeSortiePrison extends Proposition {
  constructor() {
    super(
      "Lancer le dé",
      "Voulez-vous tenter de faire un 12 pour sortir de prison ?",
    );
  }

  estDisponible() {
    return true;
  }

  valider(joueur, jeu, caseJeu, banque) {
    const valeurDeplacement = jeu.de.lancer();

    if (valeurDeplacement === 12) {
      joueur.estEnPrison = false;
      joueur.compteurPourSortirPrison = 0;
      jeu.etat = EtatsJeu.EN_COURS;
      return {
        titre: "Libre",
        message: `${valeurDeplacement} ! Vous sortez de prison !`,
      };
    } else {
      joueur.compteurPourSortirPrison += 1;

      if (joueur.compteurPourSortirPrison === 3) {
        joueur.estEnPrison = false;
        joueur.compteurPourSortirPrison = 0; // apres 3 il sort d'office
        joueur.payer(50);
        banque.recevoir(50);
        return {
          titre: "Libération forcée",
          message: `${valeurDeplacement} ! 3ème échec : vous payez 50 M et sortez de prison !`,
        };
      }

      return {
        titre: "Raté",
        message: `${valeurDeplacement} ! Vous restez en prison !`,
      };
    }
  }
}

export class PropositionJouerCarteChanceSortiePrison extends Proposition {
  constructor() {
    super(
      "Jouer la carte chance",
      "Voulez-vous jouer la carte n° 9 'Sortir de prison' pour sortir de prison ?",
    );
  }

  estDisponible(joueur) {
    if (joueur.carteChanceSortiePrison === true) {
      return true;
    }

    return false;
  }

  valider(joueur, _jeu, _caseJeu, _banque) {
    if (!this.estDisponible(joueur)) return false;

    if (joueur.carteChanceSortiePrison === true) {
      joueur.carteChanceSortiePrison = false;
      joueur.estEnPrison = false;
      joueur.compteurPourSortirPrison = 0;
      return { titre: "Libre", message: "Vous sortez de prison !" };
    }

    return { titre: "Raté", message: "Vous restez en prison !" };
  }
}

export class PropositionJouerCarteFondsCommunsSortiePrison extends Proposition {
  constructor() {
    super(
      "Jouer la carte fonds commun",
      "voulez-vous jouer la carte n° 5 'Sortir de prison' pour sortir de prison ?",
    );
  }

  estDisponible(joueur) {
    if (joueur.carteFondsCommunsSortiePrison === true) {
      return true;
    }

    return false;
  }

  valider(joueur, _jeu, _caseJeu, _banque) {
    if (!this.estDisponible(joueur)) return false;

    if (joueur.carteFondsCommunsSortiePrison === true) {
      joueur.carteFondsCommunsSortiePrison = false;
      joueur.estEnPrison = false;
      joueur.compteurPourSortirPrison = 0;
      return { titre: "Libre", message: "Vous sortez de prison !" };
    }

    return { titre: "Raté", message: "Vous restez en prison !" };
  }
}

export class PropositionAcheterCartePourSortiePrison extends Proposition {
  constructor() {
    super(
      "Acheter la carte",
      "voulez-vous acheter la carte 'Sortir de prison' pour sortir de prison ?",
    );
  }

  estDisponible(joueur, jeu) {
    const joueurs = jeu.getJoueurs();

    for (let i = 0; i < joueurs.length; i++) {
      if (
        joueur !== joueurs[i] &&
        (joueurs[i].carteChanceSortiePrison === true ||
          joueurs[i].carteFondsCommunsSortiePrison === true)
      ) {
        this.joueur2 = joueurs[i];
        return true;
      }
    }
    return false;
  }

  valider(joueur, jeu, _caseJeu, _banque) {
    if (!this.estDisponible(joueur, jeu)) return false;

    const versement = new VersementEffet(25, joueur, this.joueur2);
    versement.appliquer(joueur);

    if (this.joueur2.carteChanceSortiePrison === true) {
      this.joueur2.carteChanceSortiePrison = false;
      joueur.carteChanceSortiePrison = true;
      joueur.estEnPrison = false;
    } else if (this.joueur2.carteFondsCommunsSortiePrison === true) {
      this.joueur2.carteFondsCommunsSortiePrison = false;
      joueur.carteFondsCommunsSortiePrison = true;
      joueur.estEnPrison = false;
    }

    return {
      titre: "Libre",
      message: `${joueur.nom} a acheté la carte pour sortir de prison.`,
    };
  }
}

// -------------------- Choix (carte fonds commun) --------------------------

export class PropositionPayerAmende extends Proposition {
  constructor(montant = 10) {
    super("Payer une amende", `voulez-vous payer l'amende de ${montant} M ?`);
    this.montant = montant;
  }

  estDisponible() {
    return true;
  }

  valider(joueur, jeu, caseJeu, banque) {
    const versement = new VersementEffet(this.montant, joueur, banque);
    versement.appliquer(joueur, banque);
    return {
      titre: "Paiement",
      message: `${joueur.nom} a choisi de payer l'amende de ${this.montant} M.`,
    };
  }
}

export class PropositionTirerCarteChance extends Proposition {
  constructor() {
    super("Tirer une carte chance", "voulez-vous tirer une carte chance ?");
  }

  estDisponible() {
    return true;
  }

  valider(joueur, jeu, caseJeu, banque, _typePioche) {
    const piocheEffet = new PiocheEffet("chance");
    const messages = piocheEffet.appliquer(joueur, jeu, banque);
    jeu.listeStatuts = messages;
    return { titre: "Carte Chance", message: "Vous tirez une carte chance..." }; //object (!= array)
  }
}

// ---------------------------- Propriété ----------------------------------

export class PropositionAcheterPropriete extends Proposition {
  constructor() {
    super("Acheter", "voulez-vous acheter cette propriété ?");
  }

  estDisponible(joueur, casePropriete) {
    if (casePropriete.estLibre() && joueur.argent >= casePropriete.prixAchat) {
      this.description = `voulez-vous acheter "${casePropriete.nom}" pour ${casePropriete.prixAchat} M ?`;
      return true;
    }
    return false;
  }

  /**
   * valider l'achat de la propriete (return bool):
   * proprietaire de la case + transfert argent joueur -> banque
   */
  valider(joueur, jeu, casePropriete, banque) {
    if (!this.estDisponible(joueur, casePropriete)) return false;

    casePropriete.proprietaire = joueur;
    joueur.proprietes.push(casePropriete);

    const versement = new VersementEffet(
      casePropriete.prixAchat,
      joueur,
      banque,
    );
    versement.appliquer(joueur, banque);
    return {
      titre: "Achat",
      message: `${joueur.nom} a acheté ${casePropriete.nom} pour ${casePropriete.prixAchat} M.`,
    };
  }
}

export class PropositionHypothequer extends Proposition {
  constructor() {
    super("Hypothéquer", "voulez-vous hypothéquer cette propriété ?");
  }

  estDisponible(_joueur, _casePropriete) {}

  valider(_joueur, _jeu, _casePropriete, _banque) {}
}

export class PropositionLeverHypotheque extends Proposition {
  constructor() {
    super(
      "Lever l'hypothèque",
      "voulez-vous lever l'hypothèque sur cette propriété ?",
    );
  }

  estDisponible(_joueur, _casePropriete) {}

  valider(_joueur, _jeu, _casePropriete, _banque) {}
}

export class PropositionConstruireMaison extends Proposition {
  constructor(_quantite) {
    super(
      "Contruire une maison",
      "voulez-vous construire une maison sur cette propriété ?",
    );
  }

  estDisponible(joueur, caseRue, jeu) {
    if (!(caseRue instanceof CaseRue)) return false;

    return (
      caseRue.proprietaire === joueur &&
      jeu.possederTouteLaCollectionCases(joueur, caseRue.couleur) &&
      caseRue.nombreMaisons < 4 &&
      joueur.argent >= caseRue.prixMaison
    );
  }

  valider(joueur, jeu, caseRue, banque) {
    if (!this.estDisponible(joueur, caseRue, jeu)) return false;

    caseRue.construire("maison", banque);

    return {
      titre: "Construction: ",
      message: `${joueur.nom} a construit une maison sur ${caseRue.nom}.`,
    };
  }
}

export class PropositionConctruireHotel extends Proposition {
  constructor() {
    super(
      "Construire un hôtel",
      "voulez-vous construire un hôtel sur cette propriété ? ",
    );
  }

  estDisponible(joueur, caseRue) {
    if (!(caseRue instanceof CaseRue)) return false;

    return (
      caseRue.proprietaire === joueur &&
      caseRue.nombreMaisons === 4 &&
      joueur.argent >= caseRue.prixHotel
    );
  }

  valider(joueur, jeu, caseRue, banque) {
    if (!this.estDisponible(joueur, caseRue)) return false;

    caseRue.construire("hotel", banque);
    return {
      titre: "Construction: ",
      message: `${joueur.nom} a construit un hôtel sur ${caseRue.nom}.`,
    };
  }
}

export class PropositionDecliner extends Proposition {
  constructor() {
    super("Décliner", "aucune action vous finissez votre tour.");
  }

  estDisponible() {
    return true;
  }

  valider(joueur, jeu, casePropriete, _banque) {
    return {
      titre: "Refus",
      message: `${joueur.nom} a décliné l'achat de ${casePropriete.nom} pour ${casePropriete.prixAchat} M.`,
    };
  }
}

// -------------------------------------------------------------------------------------------
//  LISTES (ne créer les objets qu'une seule fois pour optimiser la mémoire et performances)

// Propositions[] liées aux propriétés (acaht/refus/construire...)
Proposition.LISTE_PROPOSITIONS = [
  new PropositionAcheterPropriete(),
  new PropositionHypothequer(),
  new PropositionLeverHypotheque(),
  new PropositionConstruireMaison(),
  new PropositionConctruireHotel(),
  new PropositionDecliner(),
];

// Propositions[] liées à l'action sortir de prison
Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON = [
  new PropositionJouerDeSortiePrison(),
  new PropositionJouerCarteChanceSortiePrison(),
  new PropositionJouerCarteFondsCommunsSortiePrison(),
  new PropositionAcheterCartePourSortiePrison(),
];

// Propositions[] liées à l'action fonds communs 13 (payer amende ou tirer carte chance)
Proposition.LISTE_PROPOSITIONS_FONDSCOMMUNS = [
  new PropositionPayerAmende(),
  new PropositionTirerCarteChance(),
];
