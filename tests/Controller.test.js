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

});
