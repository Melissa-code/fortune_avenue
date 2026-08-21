import { jest } from "@jest/globals";
import Controller from "../js/controller/Controller.js";
import Jeu from "../js/model/Jeu.js";
import EtatsJeu from "../js/model/enums/EtatsJeu.js";
import { CaseRue } from "../js/model/CaseJeu.js";
import { CaseJeuFactory } from "../js/model/CaseJeuFactory.js";
import { CarteEffetsFactory } from "../js/model/CarteEffetsFactory.js";

// on ne mocke QUE le chargement des données JSON tout le reste est réel
jest.unstable_mockModule("../js/model/CaseJeuFactory.js", () => ({
  CaseJeuFactory: {
    chargerDataCasesJeu: jest.fn(() => []),
  },
}));

jest.unstable_mockModule("../js/model/CarteEffetsFactory.js", () => ({
  CarteEffetsFactory: {
    chargerDataEffetsCartes: jest.fn(() => []),
    melangerCartes: jest.fn((cartes) => cartes),
  },
}));

// mock view (seule dépendance mockée pour éviter tout le Canvas)
function creerViewMock(overrides = {}) {
  return {
    refresh: jest.fn(),
    afficherMenuPropositions: jest.fn(),
    afficherZoneEvenements: jest.fn(),
    afficherTexteModale: jest.fn(),
    ...overrides,
  };
}

// une rue "standard" pour les tests (prix, loyers, couleur cohérents)
function creerRueTest(overrides = {}) {
  return Object.assign(
    new CaseRue(
      "Rue de la Paix",
      200, // prixAchat
      [10, 20, 30, 40, 50, 60], // loyers
      "bleu",
      100, // prixMaison
      200, // prixHotel
      70, // hypotheque
    ),
    overrides,
  );
}

describe("Intégration Controller + Jeu + CaseJeu + Proposition", () => {
  afterEach(() => {
    CarteEffetsFactory.melangerCartes = jest.fn();
    CaseJeuFactory.chargerDataCasesJeu = jest.fn();
    jest.restoreAllMocks();
  });

  test("lancerDe() sur une rue libre propose Acheter et Décliner (chaîne réelle Controller -> Jeu -> CaseRue -> Proposition)", () => {
    const jeu = new Jeu();
    const controller = new Controller(jeu);
    const view = creerViewMock(); // seul mock pour éviter le Canvas
    controller.view = view;

    const joueur = jeu.ajouterJoueur("Test", "chapeau");
    jest.spyOn(jeu.de, "lancer").mockReturnValue(3);

    const rue = creerRueTest();
    jeu.casesJeu = [null, null, null, rue];

    controller.lancerDe();

    expect(joueur.position).toBe(3);
    expect(jeu.etat).toBe(EtatsJeu.EN_ATTENTE);

    const titres = jeu.listePropositions.map((p) => p.titre); // on ne teste pas l'ordre exact, juste la présence des titres
    expect(titres).toEqual(expect.arrayContaining(["Acheter", "Décliner"]));
    expect(view.afficherMenuPropositions).toHaveBeenCalledWith(
      jeu.listePropositions,
      jeu.joueurActuelIndex,
    );
  });

  test("acheter la propriété via soumettreProposition(1) l'assigne réellement au joueur", () => {
    const jeu = new Jeu();
    const controller = new Controller(jeu);
    const view = creerViewMock();
    controller.view = view;

    const joueur = jeu.ajouterJoueur("Test", "chapeau");
    jest.spyOn(jeu.de, "lancer").mockReturnValue(3);

    const rue = creerRueTest();
    jeu.casesJeu = [null, null, null, rue];

    controller.lancerDe(); // remplit jeu.listePropositions = [Acheter, Décliner] dans cet ordre

    const argentInitialJoueur = joueur.argent;
    const argentInitialBanque = jeu.banque.argent;

    controller.soumettreProposition(1); // 1 = "Acheter" (1-indexé, comme affiché à l'écran)

    expect(rue.proprietaire).toBe(joueur);
    expect(joueur.proprietes).toContain(rue);
    expect(joueur.argent).toBe(argentInitialJoueur - rue.prixAchat);
    expect(jeu.banque.argent).toBe(argentInitialBanque + rue.prixAchat);
    expect(view.afficherTexteModale).toHaveBeenCalledWith(
      "Achat",
      expect.stringContaining("Rue de la Paix"),
    );
  });

  test("décliner via soumettreProposition(2) ne modifie pas le propriétaire", () => {
    const jeu = new Jeu();
    const controller = new Controller(jeu);
    const view = creerViewMock();
    controller.view = view;

    jeu.ajouterJoueur("Test", "chapeau");
    jest.spyOn(jeu.de, "lancer").mockReturnValue(3);

    const rue = creerRueTest();
    jeu.casesJeu = [null, null, null, rue];

    controller.lancerDe();
    controller.soumettreProposition(2); // 2 = "Décliner"

    expect(rue.proprietaire).toBeNull();
    expect(view.afficherTexteModale).toHaveBeenCalledWith(
      "Refus",
      expect.stringContaining("Rue de la Paix"),
    );
  });

  test("soumettre un index hors bornes ne casse pas la chaîne Controller + Jeu (régression bug clavier)", () => {
    const jeu = new Jeu();
    const controller = new Controller(jeu);
    const view = creerViewMock();
    controller.view = view;

    jeu.ajouterJoueur("Test", "chapeau");
    jest.spyOn(jeu.de, "lancer").mockReturnValue(3);

    const rue = creerRueTest();
    jeu.casesJeu = [null, null, null, rue];

    controller.lancerDe(); // 2 propositions disponibles : indices valides 1 et 2

    expect(() => controller.soumettreProposition(9)).not.toThrow();
    expect(view.afficherTexteModale).not.toHaveBeenCalled();
    expect(rue.proprietaire).toBeNull(); // rien n'a été validé
  });

  test("Jeu.soumettreProposition() reste sûr même appelé directement avec un index hors bornes (défense en profondeur)", () => {
    const jeu = new Jeu();
    jeu.ajouterJoueur("Test", "chapeau");
    jeu.etat = EtatsJeu.EN_ATTENTE;
    const rue = creerRueTest();
    jeu.casesJeu = [rue];
    jeu.listePropositions = [{ titre: "Acheter", valider: jest.fn() }];

    expect(() => jeu.soumettreProposition(9)).not.toThrow();
    expect(jeu.soumettreProposition(9)).toBeUndefined();
  });

  test("sortirDePrison avec un vrai Jeu propose de lancer le dé si aucune carte de sortie n'est possédée", () => {
    const jeu = new Jeu();
    const controller = new Controller(jeu);
    const view = creerViewMock();
    controller.view = view;

    const joueur = jeu.ajouterJoueur("Test", "chapeau");
    joueur.estEnPrison = true;
    // par défaut : pas de carte, pas d'autre joueur -> seule "Lancer le dé" est disponible

    controller.lancerDe();

    expect(jeu.etat).toBe(EtatsJeu.EN_ATTENTE);
    const titres = jeu.listePropositions.map((p) => p.titre);
    expect(titres).toEqual(["Lancer le dé"]);
    expect(view.afficherMenuPropositions).toHaveBeenCalledWith(
      jeu.listePropositions,
      jeu.joueurActuelIndex,
    );
  });
});
