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

});
