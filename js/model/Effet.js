import Joueur from "./Joueur.js";
import Banque from "./Banque.js";
import TypesCases from "./enums/TypesCases.js";
import { CaseAction } from "./CaseJeu.js";
import EtatsJeu from "./enums/EtatsJeu.js";
import { Proposition } from "./Proposition.js";

/**
 * classe abstraite
 */
export class Effet {
  appliquer(_joueur = null, _jeu = null, _banque = null) {
    // surcharger la methd
  }
}

//----------------------- Deplacement effet -----------------------------------

/**
 * type de deplacement: absolu (index case) ou relatif (nb de pas/N° sur dé)
 */
export class DeplacementEffet extends Effet {
  constructor(typeDeplacement, valeurDeplacement, bonusDePassage = 0) {
    super();
    this.typeDeplacement = typeDeplacement;
    this.valeurDeplacement = valeurDeplacement;
    this.bonusDePassage = bonusDePassage;
  }

  appliquer(joueur, jeu = null, _banque = null) {
    const anciennePosition = jeu.casesJeu[joueur.position].nom;
    let messages = [];

    this.#deplacerJoueur(joueur);

    const nouvellePosition = jeu.casesJeu[joueur.position].nom;
    messages.push(
      `${joueur.nom} s'est déplacé(e) de ${anciennePosition} à ${nouvellePosition}.`,
    );

    messages.push(...this.#gererCaseDepart(joueur));
    messages.push(...this.#gererCaseArrivee(joueur, jeu));

    return messages;
  }

  #deplacerJoueur(joueur) {
    if (this.typeDeplacement === "absolu") {
      joueur.avancer("absolu", this.valeurDeplacement);
    } else if (this.valeurDeplacement) {
      joueur.avancer("relatif", this.valeurDeplacement, this.bonusDePassage);
    }
  }

  #gererCaseDepart(joueur) {
    if (joueur.aTraverseCaseDepart) {
      joueur.recevoir(200);
      return [`${joueur.nom} passe par la case départ et reçoit 200 M.`];
    }
    return [];
  }

  #gererCaseArrivee(joueur, jeu) {
    const caseArrivee = jeu.casesJeu[joueur.position];
    if (caseArrivee instanceof CaseAction) {
      return caseArrivee.arriver(joueur, jeu);
    }
    jeu.caseApresDeplacementCarte = caseArrivee;
    return [];
  }
}

//----------------------- Gare la plus proche effet --------------------------

export class GareProcheEffet extends Effet {
  constructor() {
    super();
  }

  appliquer(joueur, jeu = null, _banque = null) {
    let messages = [];

    const gareLaPlusProche = this.trouverGareLaPlusProche(joueur.position);
    joueur.avancer("absolu", gareLaPlusProche);

    const nouvellePosition = jeu.casesJeu[joueur.position].nom;
    messages.push(
      `${joueur.nom} se rend à la gare la plus proche : ${nouvellePosition}.`,
    );

    if (joueur.aTraverseCaseDepart) {
      messages.push(`${joueur.nom} passe par la case départ et reçoit 200 M.`);
    }

    // pour propositions (ex achat)
    jeu.caseApresDeplacementCarte = jeu.casesJeu[joueur.position];

    return messages;
  }

  trouverGareLaPlusProche(positionActuelle) {
    const garesPositions = [5, 15, 25, 35];

    for (const gare of garesPositions) {
      if (gare > positionActuelle) {
        return gare;
      }
    }

    return 5; // revenir à la 1re gare
  }
}

//----------------------- Choix effet ----------------------------------------

/**
 * Choix: versement amende ou tirer une carte chance
 */
export class ChoixEffet extends Effet {
  constructor(montant, source, destinataire) {
    super();
    this.montant = montant;
    this.source = source;
    this.destinataire = destinataire;
  }

  appliquer(joueur, jeu = null, _banque = null) {
    jeu.listePropositions = Proposition.getListePropositionsFondsCommuns();
    jeu.etat = EtatsJeu.EN_ATTENTE;

    return [];
  }
}

//----------------------- Versement effet -------------------------------------

/**
 * montant, source(banque/joueur), destination (banque/joueur)
 */
export class VersementEffet extends Effet {
  constructor(montant, source, destinataire, estCollectif = false) {
    super();
    this.montant = montant;
    this.source = source;
    this.destinataire = destinataire;
    this.estCollectif = estCollectif; // si plusieurs joueurs
  }

  appliquer(joueur, jeu = null, banque = null) {
    if (this.estCollectif) return this.#versementCollectif(joueur, jeu);
    if (this.source === "joueur" && this.destinataire === "banque") {
      return this.#versementStrJoueurVersBanque(joueur, banque);
    }
    if (this.source === "banque" && this.destinataire === "joueur") {
      return this.#versementStrBanqueVersJoueur(joueur, banque);
    }
    if (this.source instanceof Joueur && this.destinataire instanceof Banque) {
      return this.#versementObjJoueurVersBanque();
    }
    if (this.source instanceof Joueur && this.destinataire instanceof Joueur) {
      return this.#versementObjJoueurVersJoueur();
    }
    if (this.source instanceof Banque && this.destinataire instanceof Joueur) {
      return this.#versementObjBanqueVersJoueur();
    }

    return [];
  }

  #versementCollectif(joueur, jeu) {
    const messages = [];

    for (let joueurAdverse of jeu.getJoueurs()) {
      if (joueurAdverse !== joueur) {
        joueurAdverse.payer(this.montant);
        joueur.recevoir(this.montant);
        messages.push(
          `${joueur.nom} reçoit ${this.montant} M de ${joueurAdverse.nom}.`,
        );
      }
    }
    return messages;
  }

  #versementStrJoueurVersBanque(joueur, banque) {
    const messages = [];
    joueur.payer(this.montant);
    banque.recevoir(this.montant);
    this.montant > 0
      ? messages.push(`${joueur.nom} paye ${this.montant} M à la banque.`)
      : messages.push(`${joueur.nom} ne paie rien à la banque.`);
    return messages;
  }

  #versementStrBanqueVersJoueur(joueur, banque) {
    const messages = [];
    joueur.recevoir(this.montant);
    banque.payer(this.montant);
    messages.push(`${joueur.nom} reçoit ${this.montant} M de la banque.`);
    return messages;
  }

  #versementObjJoueurVersBanque() {
    const messages = [];
    this.source.payer(this.montant);
    this.destinataire.recevoir(this.montant);
    messages.push(
      `${this.destinataire.nom} reçoit ${this.montant} M de ${this.source.nom}.`,
    );
    return messages;
  }

  #versementObjJoueurVersJoueur() {
    const messages = [];
    this.source.payer(this.montant);
    this.destinataire.recevoir(this.montant);
    messages.push(
      `${this.destinataire.nom} reçoit ${this.montant} M de ${this.source.nom}.`,
    );
    return messages;
  }

  #versementObjBanqueVersJoueur() {
    const messages = [];
    this.source.payer(this.montant);
    this.destinataire.recevoir(this.montant);
    messages.push(
      `${this.destinataire.nom} reçoit ${this.montant} M de ${this.source.nom}.`,
    );
    return messages;
  }
}

//----------------------- Reparations effet -----------------------------------

export class ReparationsEffet extends Effet {
  constructor(montant_par_maison, montant_par_hotel, source, destinataire) {
    super();
    this.montant_par_maison = montant_par_maison;
    this.montant_par_hotel = montant_par_hotel;
    this.source = source;
    this.destinataire = destinataire;
  }

  appliquer(joueur, _jeu = null, banque = null) {
    let messages = [];
    const totalMaisonsHotels = joueur.calculerTotalMaisonsHotels();
    const nbMaisons = totalMaisonsHotels[0];
    const nbHotels = totalMaisonsHotels[1];
    const montantTotal =
      nbMaisons * this.montant_par_maison + nbHotels * this.montant_par_hotel;

    if (nbMaisons === 0 && nbHotels === 0) {
      messages.push(
        `${joueur.nom} n'a ni maison ni d'hôtel. Pas de réparations.`,
      );
      return messages;
    }

    joueur.payer(montantTotal);
    banque.recevoir(montantTotal);
    messages.push(`${joueur.nom} paie ${montantTotal} M pour les réparations.`);

    return messages;
  }
}

//----------------------- Prison effet ----------------------------------------

/**
 * Entree/Sortie:
 * - déplacement du joueur en prison
 * - joueur.estEnPrison = true/false
 */
export class PrisonEffet extends Effet {
  constructor(allerEnPrison) {
    super();
    this.allerEnPrison = allerEnPrison; //bool
  }

  appliquer(joueur, _jeu = null, _banque = null) {
    let messages = [];

    if (this.allerEnPrison) {
      joueur.position = 10;
      joueur.estEnPrison = true;
      messages.push(`${joueur.nom} est envoyé(e) en prison !`);
    } else if (joueur.estEnPrison) {
      joueur.estEnPrison = false;
      messages.push(`${joueur.nom} est libéré(e) de prison !`);
    } else {
      // visite (ex: case départ -> direct case 10)
      messages.push(`Prison : ${joueur.nom} est en simple visite.`);
    }

    return messages;
  }
}
//----------------------- Pioche effet ---------------------------------------

/**
 * Pioche une carte dans la pioche chance ou fonds commun
 * @return {Array} messages de str
 */
export class PiocheEffet extends Effet {
  constructor(typePioche) {
    super();
    this.typePioche = typePioche; // chance/fonds_commmun
  }

  appliquer(joueur, jeu = null, banque = null) {
    if (this.typePioche === TypesCases.CHANCE) {
      return this.#piocher(
        jeu.piocheChance,
        "Chance 9",
        "carteChanceSortiePrison",
        joueur,
        jeu,
        banque,
      );
    } else {
      return this.#piocher(
        jeu.piocheFondsCommun,
        "Fonds communs 5",
        "carteFondsCommunsSortiePrison",
        joueur,
        jeu,
        banque,
      );
    }
  }

  #piocher(
    pioche,
    titreCarteSortiePrison,
    carteSortiePrisonJoueur,
    joueur,
    jeu,
    banque,
  ) {
    const carteTiree = pioche.shift();
    pioche.push(carteTiree); // remet la carte au fond
    const messages = [];
    messages.push(`**Carte ${carteTiree.titre}`);
    messages.push(`//"${carteTiree.description}"`);

    // cartes pour sortie de prison
    if (carteTiree.titre === titreCarteSortiePrison) {
      joueur[carteSortiePrisonJoueur] = true;
      messages.push("Vous pouvez sortir de prison avec cette carte.");
      // appliquer les effets de la carte
    } else {
      const messagesEffets = carteTiree.executer(joueur, jeu, banque);
      for (let message of messagesEffets) {
        messages.push(message);
      }
    }

    return messages;
  }
}
