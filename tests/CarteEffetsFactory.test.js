import { jest } from "@jest/globals";
import { CarteEffetsFactory } from "../js/model/CarteEffetsFactory.js";
import TypesEffets from "../js/model/enums/TypesEffets.js";
import { CarteAction } from "../js/model/Carte.js";
import {
  DeplacementEffet,
  VersementEffet,
  GareProcheEffet,
  ReparationsEffet,
  PrisonEffet,
  ChoixEffet,
} from "../js/model/Effet.js";

describe("CarteEffetsFactory", () => {
  // tests charger DataEffetsCartes
  test("chargerDataEffetsCartes() retourne un tableau de cartes", () => {
    const effetsCartesJson = [
      {
        titre: "Chance 1",
        description: "Allez sur la case départ.",
        type: TypesEffets.DEPLACEMENT,
        type_deplacement: "absolu",
        index_case: 5,
        nombreDePas: 0,
        bonusPassage: 200,
      },
      {
        titre: "Chance 2",
        description: "Versez 100 M à la banque.",
        type: TypesEffets.VERSEMENT,
        montant: 100,
        source: "banque",
        destinataire: "joueur",
      },
    ];

    const cartes = CarteEffetsFactory.chargerDataEffetsCartes(effetsCartesJson);

    expect(cartes).toHaveLength(2);
    expect(cartes[0]).toBeInstanceOf(CarteAction);
    expect(cartes[1]).toBeInstanceOf(CarteAction);
  });

  // tests sur generateCarte()
  test("appelle le bon parseur selon le type", () => {
    const effetsCartesJson = {
      type: TypesEffets.DEPLACEMENT,
      titre: "Chance 1",
      description: "test",
      type_deplacement: "absolu",
      index_case: 5,
    };

    const carte = CarteEffetsFactory.generateCarte(effetsCartesJson);

    expect(carte.effets[0]).toBeInstanceOf(DeplacementEffet);
  });

  test("retourne null pour un type inconnu", () => {
    const effetsCartesJson = {
      type: "type_inexistant",
      titre: "X",
      description: "Y",
    };

    const carte = CarteEffetsFactory.generateCarte(effetsCartesJson);

    expect(carte).toBeNull();
  });

  // tests parseCarteDeplacement()
  test("parseCarteDeplacement() deplacement absolu", () => {
    const jsonObj = {
      titre: "Chance 1",
      description: "Allez sur la case départ.",
      type: TypesEffets.DEPLACEMENT,
      type_deplacement: "absolu",
      index_case: 2,
      nombreDePas: 0,
      bonusPassage: 200,
    };

    const carte = CarteEffetsFactory.parseCarteDeplacement(jsonObj);

    expect(carte).toBeInstanceOf(CarteAction);
    expect(carte.effets[0]).toBeInstanceOf(DeplacementEffet);
    expect(carte.effets[0].typeDeplacement).toBe("absolu");
    expect(carte.effets[0].valeurDeplacement).toBe(2); // index_case
    expect(carte.effets[0].bonusDePassage).toBe(200);
  });

  test("parseCarteDeplacement() déplacement relatif (nombreDePas)", () => {
    const json = {
      titre: "Chance 2",
      description: "Avancez de 3 cases",
      type_deplacement: "relatif",
      nombreDePas: 3,
    };

    const carte = CarteEffetsFactory.parseCarteDeplacement(json);

    expect(carte.effets[0].valeurDeplacement).toBe(3);
    expect(carte).toBeInstanceOf(CarteAction);
    expect(carte.effets[0]).toBeInstanceOf(DeplacementEffet);
  });

  // tests parseCarteGareProche()
  test("crée une carte avec un GareProcheEffet", () => {
    const json = {
      titre: "Chance 15",
      description: "Allez à la gare la plus proche",
    };

    const carte = CarteEffetsFactory.parseCarteGareProche(json);

    expect(carte.effets[0]).toBeInstanceOf(GareProcheEffet);
  });

  // tests parseCarteVersement()
  test("crée un VersementEffet non collectif par défaut", () => {
    const json = {
      titre: "Chance 5",
      description: "Payez 15 M",
      montant: 15,
      source: "joueur",
      destinataire: "banque",
    };

    const carte = CarteEffetsFactory.parseCarteVersement(json);

    expect(carte.effets[0]).toBeInstanceOf(VersementEffet);
    expect(carte.effets[0].montant).toBe(15);
    expect(carte.effets[0].estCollectif).toBe(false);
  });

  test('détecte "Fonds communs 9" comme versement collectif', () => {
    const json = {
      titre: "Fonds communs 9",
      description: "Chaque joueur vous verse 10 M",
      montant: 10,
      source: "joueur",
      destinataire: "joueur",
    };

    const carte = CarteEffetsFactory.parseCarteVersement(json);

    expect(carte.effets[0].estCollectif).toBe(true);
  });

  // tests parseCarteAllerEnPrison()
  test("crée un PrisonEffet(true)", () => {
    const json = {
      titre: "Chance 30",
      description: "Allez en prison",
    };

    const carte = CarteEffetsFactory.parseCarteAllerEnPrison(json);

    expect(carte.effets[0]).toBeInstanceOf(PrisonEffet);
    expect(carte.effets[0].allerEnPrison).toBe(true);
  });

  // tests parseCarteSortirDePrison()
  test("crée un PrisonEffet(false)", () => {
    const json = {
      titre: "Chance 9",
      description: "Sortez de prison",
    };

    const carte = CarteEffetsFactory.parseCarteSortirDePrison(json);

    expect(carte.effets[0]).toBeInstanceOf(PrisonEffet);
    expect(carte.effets[0].allerEnPrison).toBe(false);
  });

  // tests parseCarteReparations()
  test("crée un ReparationsEffet avec les bons montants", () => {
    const json = {
      titre: "Chance 23",
      description: "Réparations",
      montant_par_maison: 25,
      montant_par_hotel: 100,
      source: "joueur",
      destinataire: "banque",
    };

    const carte = CarteEffetsFactory.parseCarteReparations(json);

    expect(carte.effets[0]).toBeInstanceOf(ReparationsEffet);
    expect(carte.effets[0].montant_par_maison).toBe(25);
    expect(carte.effets[0].montant_par_hotel).toBe(100);
  });

  // tests parseCarteChoix()
  test("crée un ChoixEffet", () => {
    const json = {
      titre: "Fonds communs 9",
      description: "Choix",
      montant: 10,
      source: "joueur",
      destinataire: "banque",
    };

    const carte = CarteEffetsFactory.parseCarteChoix(json);

    expect(carte.effets[0]).toBeInstanceOf(ChoixEffet);
  });

  // tests melangerCartes()
  test("conserve le même nombre de cartes", () => {
    const cartes = [1, 2, 3, 4, 5];

    const resultat = CarteEffetsFactory.melangerCartes(cartes);

    expect(resultat.length).toBe(5);
  });

  test("contient toujours les mêmes éléments (juste réordonnés)", () => {
    const cartes = ["c", "d", "a", "b"];

    const resultat = CarteEffetsFactory.melangerCartes(cartes);

    expect(resultat.sort()).toEqual(["a", "b", "c", "d"]);
  });

  test("mélange de façon prévisible quand Math.random est mocké", () => {
    const cartes = [1, 2, 3];
    jest.spyOn(Math, "random").mockReturnValue(0);

    const resultat = CarteEffetsFactory.melangerCartes(cartes);

    expect(resultat).toEqual([2, 3, 1]); // algo de melange Fisher-Yates avec Math.random() = 0
    jest.restoreAllMocks(); // rétablit le comportement normal de Math.random() après le test
  });
});
