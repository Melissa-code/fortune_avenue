import { jest } from "@jest/globals";
import Controller from "../js/controller/Controller.js";
import EtatsJeu from "../js/model/enums/EtatsJeu.js";

// mock joueur
function creerJoueur(estEnPrison = false, position = 0, nom = "Melissa") {
  return {
    nom,
    position,
    estEnPrison,
  };
}

// mock jeu
function creerJeu(overrides = {}) {
  return {
    etat: EtatsJeu.EN_COURS,
    joueurActuelIndex: 0,
    joueurs: [creerJoueur()],
    de: { lancer: jest.fn().mockReturnValue(4) },
    listePropositions: [],
    listeStatuts: [],
    caseApresDeplacementCarte: null,
    casesJeu: [{ nom: "Départ" }],
    filtrerPropositionsValablesSortiePrison: jest.fn().mockReturnValue([]),
    avancerJoueurCourant: jest.fn(),
    soumettreProposition: jest.fn(),
    terminerTour: jest.fn(),
  };
}

// mock view
function creerView(overrides = {}) {
  return {
    refresh: jest.fn(),
    afficherMenuPropositions: jest.fn(),
    afficherZoneEvenements: jest.fn(),
    afficherTexteModale: jest.fn(),
  };
}

describe("Controller", () => {
  let jeu;
  let view;
  let controller;

  beforeEach(() => {
    jest.useFakeTimers();
    jeu = creerJeu();
    view = creerView();
    controller = new Controller(jeu);
    controller.view = view;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // ----------------- Tests Lancer le dé ----------------------

  test("ne fait rien si l'état n'est pas EN_COURS", () => {
    jeu.etat = EtatsJeu.EN_ATTENTE;

    controller.lancerDe();

    expect(jeu.de.lancer).not.toHaveBeenCalled();
    expect(jeu.avancerJoueurCourant).not.toHaveBeenCalled();
  });

  test("lance le dé et déplace le joueur si non en prison", () => {
    controller.lancerDe();

    expect(jeu.de.lancer).toHaveBeenCalled();
    expect(jeu.avancerJoueurCourant).toHaveBeenCalledWith(4);
  });

  test("termine le tour si ni proposition ni statut après déplacement", () => {
    jeu.listePropositions = [];
    jeu.listeStatuts = [];

    controller.lancerDe();

    expect(jeu.terminerTour).toHaveBeenCalled();
  });


  // ---------- Tests déplacer le joueur courant ---------------

  test("réinitialise listePropositions et listeStatuts avant déplacement", () => {
    jeu.listePropositions = ["ancienne"];
    jeu.listeStatuts = ["ancien"];

    controller.deplacerJoueurCourant();

    expect(jeu.listePropositions).toEqual([]);
    expect(jeu.listeStatuts).toEqual([]);
  });

  test("appelle avancerJoueurCourant avec la valeur du dé", () => {
    jeu.de.lancer.mockReturnValue(6);

    controller.deplacerJoueurCourant();

    expect(jeu.avancerJoueurCourant).toHaveBeenCalledWith(6);
  });

  test("rafraîchit la vue avant et après le déplacement", () => {
    controller.deplacerJoueurCourant();
    expect(view.refresh).toHaveBeenCalledTimes(2);
  });

  
  // --------- Tests traiter le résultat du déplacement ------------

  test("affiche les propositions si listePropositions est non vide", () => {
    jeu.listePropositions = ["acheter"];
    const spy = jest.spyOn(controller, "afficherPropositionsApresDeplacement");

    controller.traiterResultatDeplacement();

    expect(spy).toHaveBeenCalled();
  });

  test("affiche la carte si pas de proposition mais des statuts", () => {
    jeu.listePropositions = [];
    jeu.listeStatuts = ["Vous gagnez 200€."];
    const spy = jest.spyOn(
      controller,
      "afficherCarteEtResoudreDeplacementEventuel",
    );

    controller.traiterResultatDeplacement();

    expect(spy).toHaveBeenCalled();
  });

  test("termine le tour si ni proposition ni statut", () => {
    jeu.listePropositions = [];
    jeu.listeStatuts = [];

    controller.traiterResultatDeplacement();

    expect(jeu.terminerTour).toHaveBeenCalled();
  });

  test("priorise les propositions sur les statuts si les deux sont présents", () => {
    jeu.listePropositions = ["acheter"];
    jeu.listeStatuts = ["un statut"];

    const spyProp = jest.spyOn(
      controller,
      "afficherPropositionsApresDeplacement",
    );
    const spyCarte = jest.spyOn(
      controller,
      "afficherCarteEtResoudreDeplacementEventuel",
    );

    controller.traiterResultatDeplacement();

    expect(spyProp).toHaveBeenCalled();
    expect(spyCarte).not.toHaveBeenCalled();
  });

  
  // ------ Tests afficher les propositions après le déplacement -------

  test("affiche directement le menu si ce n'est pas une carte Fonds communs avec choix", () => {
    jeu.listePropositions = ["acheter"];
    jeu.listeStatuts = ["Taxe de luxe"];

    controller.afficherPropositionsApresDeplacement();

    expect(view.afficherMenuPropositions).toHaveBeenCalledWith(["acheter"], 0);
    expect(view.afficherZoneEvenements).not.toHaveBeenCalled();
  });

  test("affiche d'abord les événements puis le menu après le délai si carte Fonds communs avec choix", () => {
    jeu.listePropositions = ["choix1", "choix2"];
    jeu.listeStatuts = ["**Fonds communs: choisissez"];

    controller.afficherPropositionsApresDeplacement();

    expect(view.afficherZoneEvenements).toHaveBeenCalled();
    expect(view.afficherMenuPropositions).not.toHaveBeenCalled();

    jest.advanceTimersByTime(Controller.DELAI_AFFICHAGE_EVENEMENT);

    expect(view.afficherMenuPropositions).toHaveBeenCalledWith(
      ["choix1", "choix2"],
      0,
    );
  });

    
  // ---- Tests afficher la carte et résoudre le déplacement éventuel ------

  test("affiche la zone événements dans tous les cas", () => {
    controller.afficherCarteEtResoudreDeplacementEventuel();
    expect(view.afficherZoneEvenements).toHaveBeenCalled();
  });

  test("termine le tour s'il n'y a pas de case à résoudre après la carte", () => {
    jeu.caseApresDeplacementCarte = null;

    controller.afficherCarteEtResoudreDeplacementEventuel();

    expect(jeu.terminerTour).toHaveBeenCalled();
  });


  // ----- Tests appliquer l'effet de la case destination de la carte -------

  test("planifie appliquerEffetCaseDestinationCarte après le délai s'il y a une case à résoudre", () => {
    jeu.caseApresDeplacementCarte = { arriver: jest.fn().mockReturnValue([]) };
    const spy = jest.spyOn(controller, "appliquerEffetCaseDestinationCarte");

    controller.afficherCarteEtResoudreDeplacementEventuel();

    expect(spy).not.toHaveBeenCalled();
    expect(jeu.terminerTour).not.toHaveBeenCalled();

    jest.advanceTimersByTime(Controller.DELAI_AFFICHAGE_EVENEMENT);

    expect(spy).toHaveBeenCalled();
  });

  test("remet caseApresDeplacementCarte à null", () => {
    jeu.caseApresDeplacementCarte = { arriver: jest.fn().mockReturnValue([]) };

    controller.appliquerEffetCaseDestinationCarte();

    expect(jeu.caseApresDeplacementCarte).toBeNull();
  });

  test("affiche le menu de propositions si la case en génère", () => {
    const propositions = ["acheter", "enchérir"];
    jeu.caseApresDeplacementCarte = {
      arriver: jest.fn().mockReturnValue(propositions),
    };

    controller.appliquerEffetCaseDestinationCarte();

    expect(jeu.listePropositions).toBe(propositions);
    expect(jeu.etat).toBe(EtatsJeu.EN_ATTENTE);
    expect(view.afficherMenuPropositions).toHaveBeenCalledWith(propositions, 0);
  });

  test("termine le tour si la case ne génère aucune proposition", () => {
    jeu.caseApresDeplacementCarte = { arriver: jest.fn().mockReturnValue([]) };

    controller.appliquerEffetCaseDestinationCarte();

    expect(jeu.terminerTour).toHaveBeenCalled();
  });

  test("termine le tour si arriver() retourne null/undefined", () => {
    jeu.caseApresDeplacementCarte = {
      arriver: jest.fn().mockReturnValue(null),
    };

    controller.appliquerEffetCaseDestinationCarte();

    expect(jeu.terminerTour).toHaveBeenCalled();
  });
});

  
  // ----------- Tests soumettre une proposition -------------------

  describe("soumettreProposition", () => {

    beforeEach(() => {
      jest.useFakeTimers();
      jeu = creerJeu();
      view = creerView();
      controller = new Controller(jeu);
      controller.view = view;

      jeu.etat = EtatsJeu.EN_ATTENTE;
      jeu.listePropositions = ["choix0", "choix1", "choix2"];
    });

    test("ne fait rien si l'état n'est pas EN_ATTENTE", () => {
      jeu.etat = EtatsJeu.EN_COURS;

      controller.soumettreProposition(1);

      expect(jeu.soumettreProposition).not.toHaveBeenCalled();
    });

    test("ne fait rien si numProposition n'est pas un nombre", () => {
      controller.soumettreProposition(NaN);
      expect(jeu.soumettreProposition).not.toHaveBeenCalled();
    });

    test("ne fait rien si numProposition est négatif", () => {
      controller.soumettreProposition(-1);
      expect(jeu.soumettreProposition).not.toHaveBeenCalled();
    });

    test("ne fait rien si numProposition dépasse les propositions disponibles (régression bug clavier)", () => {
      controller.soumettreProposition(9);
      expect(jeu.soumettreProposition).not.toHaveBeenCalled();
    });

    test("appelle jeu.soumettreProposition avec un index valide", () => {
      jeu.soumettreProposition.mockReturnValue(null);

      controller.soumettreProposition(1);

      expect(jeu.soumettreProposition).toHaveBeenCalledWith(1);
      expect(view.refresh).toHaveBeenCalled();
    });

    test("n'affiche pas de modale si jeu.soumettreProposition ne retourne rien", () => {
      jeu.soumettreProposition.mockReturnValue(null);

      controller.soumettreProposition(0);

      expect(view.afficherTexteModale).not.toHaveBeenCalled();
    });

    test("affiche la modale puis termine le tour après le délai si un résultat est retourné", () => {
      const resultat = {
        titre: "Achat",
        message: "Vous avez acheté la propriété",
      };
      jeu.soumettreProposition.mockReturnValue(resultat);
      const spy = jest.spyOn(controller, "terminerTourApresModale");

      controller.soumettreProposition(0);

      expect(view.afficherTexteModale).toHaveBeenCalledWith(
        resultat.titre,
        resultat.message,
      );
      expect(spy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(Controller.DELAI_AFFICHAGE_MODALE);

      expect(spy).toHaveBeenCalled();
    });
  });

