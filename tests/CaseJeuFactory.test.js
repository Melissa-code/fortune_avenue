import { CaseJeuFactory } from "../js/model/CaseJeuFactory.js";
import {
  CaseRue,
  CaseGare,
  CaseSociete,
  CaseAction,
} from "../js/model/CaseJeu.js";
import { VersementEffet, PrisonEffet, PiocheEffet } from "../js/model/Effet.js";
import TypesCases from "../js/model/enums/TypesCases.js";

describe("CaseJeuFactory", () => {
  // tests charger data cases jeu
  test("retourne un tableau de la même taille que les données", () => {
    const cases = CaseJeuFactory.chargerDataCasesJeu();

    expect(Array.isArray(cases)).toBe(true);
    expect(cases.length).toBeGreaterThan(0);
  });

  // tests generateCase()
  test("type RUE retourne une CaseRue", () => {
    const dataObj = {
      nom: "Rue Test",
      type: TypesCases.RUE,
      prixAchat: 100,
      loyers: [10],
    };
    const resultat = CaseJeuFactory.generateCase(dataObj);
    expect(resultat).toBeInstanceOf(CaseRue);
  });

  test("type GARE retourne une CaseGare", () => {
    const dataObj = {
      nom: "Gare Test",
      type: TypesCases.GARE,
      prixAchat: 200,
      loyers: [25],
    };
    const resultat = CaseJeuFactory.generateCase(dataObj);
    expect(resultat).toBeInstanceOf(CaseGare);
  });

  test("type SOCIETE retourne une CaseSociete", () => {
    const dataObj = {
      nom: "Societe Test",
      type: TypesCases.SOCIETE,
      prixAchat: 150,
      loyers: [],
    };
    const resultat = CaseJeuFactory.generateCase(dataObj);
    expect(resultat).toBeInstanceOf(CaseSociete);
  });

  test('type CHANCE ajoute un PiocheEffet("chance")', () => {
    const dataObj = { nom: "Chance 1", type: TypesCases.CHANCE };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat).toBeInstanceOf(CaseAction);
    expect(resultat.effets[0]).toBeInstanceOf(PiocheEffet);
    expect(resultat.effets[0].typePioche).toBe("chance");
  });

  test('type FONDS_COMMUNS ajoute un PiocheEffet("fonds_communs")', () => {
    const dataObj = { nom: "Fonds communs 1", type: TypesCases.FONDS_COMMUNS };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets[0]).toBeInstanceOf(PiocheEffet);
    expect(resultat.effets[0].typePioche).toBe("fonds_communs");
  });

  test("type DEPART ajoute un VersementEffet(200, banque, joueur)", () => {
    const dataObj = { nom: "Départ", type: TypesCases.DEPART };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets[0]).toBeInstanceOf(VersementEffet);
    expect(resultat.effets[0].montant).toBe(200);
    expect(resultat.effets[0].source).toBe("banque");
    expect(resultat.effets[0].destinataire).toBe("joueur");
  });

  test("type PARC_GRATUIT ne rajoute aucun effet", () => {
    const dataObj = { nom: "Parc gratuit", type: TypesCases.PARC_GRATUIT };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets).toEqual([]);
  });

  test("type PRISON ajoute un PrisonEffet(false)", () => {
    const dataObj = { nom: "Prison", type: TypesCases.PRISON };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets[0]).toBeInstanceOf(PrisonEffet);
    expect(resultat.effets[0].allerEnPrison).toBe(false);
  });

  test("type TAXE ajoute un VersementEffet avec le bon montant", () => {
    const dataObj = {
      nom: "Taxe de luxe",
      type: TypesCases.TAXE,
      prixAchat: 75,
    };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets[0]).toBeInstanceOf(VersementEffet);
    expect(resultat.effets[0].montant).toBe(75);
    expect(resultat.effets[0].source).toBe("joueur");
    expect(resultat.effets[0].destinataire).toBe("banque");
  });

  test("type ALLEZ_EN_PRISON ajoute un PrisonEffet(true)", () => {
    const dataObj = {
      nom: "Allez en prison",
      type: TypesCases.ALLEZ_EN_PRISON,
    };
    const resultat = CaseJeuFactory.generateCase(dataObj);

    expect(resultat.effets[0]).toBeInstanceOf(PrisonEffet);
    expect(resultat.effets[0].allerEnPrison).toBe(true);
  });

  // parseRue, parseGare, parseSociete, parseAction tests
  test("crée une CaseRue avec les bonnes propriétés", () => {
    const dataObj = {
      nom: "Rue de la Paix",
      type: TypesCases.RUE,
      prixAchat: 200,
      loyers: [10, 20, 30, 40, 50, 60],
      couleur: "bleu",
      prixMaison: 50,
      prixHotel: 100,
      hypotheque: 100,
    };

    const caseRue = CaseJeuFactory.parseRue(dataObj);

    expect(caseRue).toBeInstanceOf(CaseRue);
    expect(caseRue.nom).toBe("Rue de la Paix");
    expect(caseRue.prixAchat).toBe(200);
    expect(caseRue.couleur).toBe("bleu");
  });

  test("crée une CaseGare avec les bonnes propriétés", () => {
    const dataObj = {
      nom: "Gare du Nord",
      type: TypesCases.GARE,
      prixAchat: 200,
      loyers: [25, 50, 100, 200],
      hypotheque: 100,
    };

    const caseGare = CaseJeuFactory.parseGare(dataObj);

    expect(caseGare).toBeInstanceOf(CaseGare);
    expect(caseGare.nom).toBe("Gare du Nord");
    expect(caseGare.prixAchat).toBe(200);
  });

  test("crée une CaseSociete avec les bonnes propriétés", () => {
    const dataObj = {
      nom: "Compagnie des eaux",
      type: TypesCases.SOCIETE,
      prixAchat: 150,
      loyers: [],
      hypotheque: 75,
    };

    const caseSociete = CaseJeuFactory.parseSociete(dataObj);

    expect(caseSociete).toBeInstanceOf(CaseSociete);
    expect(caseSociete.nom).toBe("Compagnie des eaux");
  });

  test("crée une CaseAction avec nom et type", () => {
    const dataObj = { nom: "Chance 1", type: TypesCases.CHANCE };

    const caseAction = CaseJeuFactory.parseAction(dataObj);

    expect(caseAction).toBeInstanceOf(CaseAction);
    expect(caseAction.nom).toBe("Chance 1");
    expect(caseAction.type).toBe(TypesCases.CHANCE);
  });
});
