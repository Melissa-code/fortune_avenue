import { jest } from "@jest/globals";
import View from "../js/view/View.js";
import EtatsJeu from "../js/model/enums/EtatsJeu.js";

// mock du contexte 2D: chaque méthode utilisée par View doit être un jest.fn()
function creerCtx() {
  return {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    globalAlpha: 1,
    shadowColor: "",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    roundRect: jest.fn(),
    drawImage: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 50 }),
    arc: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
  };
}

// mock du canvas: conserve les handlers enregistrés pour pouvoir les déclencher manuellement
function creerCanvas(ctx) {
  const handlers = {};
  return {
    width: 1000,
    height: 800,
    style: {},
    getContext: jest.fn().mockReturnValue(ctx),
    addEventListener: jest.fn((event, handler) => {
      handlers[event] = handler;
    }),
    getBoundingClientRect: jest.fn().mockReturnValue({ left: 0, top: 0 }),
    focus: jest.fn(),
    // pour déclencher un handler dans un test: canvas.__trigger("click", { clientX, clientY })
    __trigger: (event, payload) => handlers[event] && handlers[event](payload),
  };
}

function creerDocument(canvas) {
  return {
    querySelector: jest.fn().mockReturnValue(canvas),
    fonts: {
      ready: new Promise(() => {}), // jamais résolue : le refresh() auto ne se déclenche pas pendant les tests
    },
  };
}

// mock joueur (pour la vue : besoin de plus de champs que côté Controller)
function creerJoueurVue(overrides = {}) {
  return {
    nom: "Melissa",
    pion: "./images/pion1.svg",
    position: 0,
    argent: 1500,
    estEnPrison: false,
    carteChanceSortiePrison: false,
    carteFondsCommunsSortiePrison: false,
    proprietes: [],
    ...overrides,
  };
}

// mock jeu
function creerJeuVue(overrides = {}) {
  const joueurs = [creerJoueurVue()];
  return {
    etat: EtatsJeu.EN_COURS,
    joueurActuelIndex: 0,
    joueurs,
    getJoueurs: jest.fn().mockReturnValue(joueurs),
    de: { valeurAffichee: 2 },
    listeStatuts: [],
    listePropositions: [],
    ...overrides,
  };
}

// mock controller
function creerControllerVue(overrides = {}) {
  return {
    lancerDe: jest.fn(),
    soumettreProposition: jest.fn(),
    ...overrides,
  };
}

describe("View", () => {
  let ctx;
  let canvas;
  let document_;
  let jeu;
  let controller;
  let view;

  beforeEach(() => {
    // remplace Image pour contrôler .complete sans déclencher de vrai chargement réseau
    global.Image = class {
      constructor() {
        this.src = "";
        this.complete = false;
        this.onload = null;
      }
    };

    ctx = creerCtx();
    canvas = creerCanvas(ctx);
    document_ = creerDocument(canvas);
    jeu = creerJeuVue();
    controller = creerControllerVue();

    view = new View(jeu, controller, document_);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --------------- Tests identifier cible ----------------

  describe("identifierCible", () => {
    test("retourne DE si le clic est dans la zone du dé", () => {
      const x = view.positionDeX + 2;
      const y = view.positionDeY + 2;

      expect(view.identifierCible(x, y)).toBe("DE");
    });

    test("retourne un message par défaut si le clic est en dehors de toute cible", () => {
      const x = view.positionDeX - 1000;
      const y = view.positionDeY - 1000;

      expect(view.identifierCible(x, y)).toBe("Aucune cible identifiée.");
    });
  });

  // --------------- Tests initialiser evenements  ----------------

  describe("initialiserEvenement (click sur le dé)", () => {
    test("appelle controller.lancerDe() si le clic est sur le dé", () => {
      canvas.__trigger("click", {
        clientX: view.positionDeX + 2,
        clientY: view.positionDeY + 2,
      });

      expect(controller.lancerDe).toHaveBeenCalled();
    });

    test("n'appelle pas controller.lancerDe() si le clic est ailleurs", () => {
      canvas.__trigger("click", { clientX: 0, clientY: 0 });

      expect(controller.lancerDe).not.toHaveBeenCalled();
    });

    test("transmet parseInt(event.key) à controller.soumettreProposition", () => {
      canvas.__trigger("keydown", { key: "2" });

      expect(controller.soumettreProposition).toHaveBeenCalledWith(2);
    });

    test("transmet NaN si la touche n'est pas un chiffre (aucun filtrage côté View)", () => {
      canvas.__trigger("keydown", { key: "Shift" });

      expect(controller.soumettreProposition).toHaveBeenCalledWith(NaN);
    });
  });

  // --------------- Tests refresh ----------------

  describe("refresh", () => {
    test("vide le canvas avant de redessiner", () => {
      view.refresh();

      expect(ctx.clearRect).toHaveBeenCalledWith(
        0,
        0,
        canvas.width,
        canvas.height,
      );
    });

    test("affiche le menu de propositions si l'état est EN_ATTENTE", () => {
      jeu.etat = EtatsJeu.EN_ATTENTE;
      const spyMenu = jest.spyOn(view, "afficherMenuPropositions");
      const spyEvenements = jest.spyOn(view, "afficherZoneEvenements");

      view.refresh();

      expect(spyMenu).toHaveBeenCalledWith(
        jeu.listePropositions,
        jeu.joueurActuelIndex,
      );
      expect(spyEvenements).not.toHaveBeenCalled();
    });

    test("affiche la zone événements si l'état n'est pas EN_ATTENTE", () => {
      jeu.etat = EtatsJeu.EN_COURS;
      const spyMenu = jest.spyOn(view, "afficherMenuPropositions");
      const spyEvenements = jest.spyOn(view, "afficherZoneEvenements");

      view.refresh();

      expect(spyEvenements).toHaveBeenCalled();
      expect(spyMenu).not.toHaveBeenCalled();
    });
  });

  // --------------- Tests afficher le menu de propositions ----------------

  describe("afficherMenuPropositions", () => {
    test("texte au singulier si une seule proposition", () => {
      const spy = jest.spyOn(view, "afficherTexteModale");
      const propositions = [
        { titre: "Acheter", description: "Achetez cette propriété" },
      ];

      view.afficherMenuPropositions(propositions, 0);

      const [, texte] = spy.mock.calls[0];
      expect(texte).toContain(
        "Appuyez sur la touche [1] de votre clavier.",
      );
    });

    test("texte au pluriel avec la bonne borne si plusieurs propositions", () => {
      const spy = jest.spyOn(view, "afficherTexteModale");
      const propositions = [
        { titre: "Acheter", description: "..." },
        { titre: "Décliner", description: "..." },
      ];

      view.afficherMenuPropositions(propositions, 0);

      const [, texte] = spy.mock.calls[0];
      expect(texte).toContain(
        "Appuyez sur une touche de [1] à [2] de votre clavier pour choisir.",
      );
    });

    test("le titre de la modale contient le nom du joueur courant", () => {
      const spy = jest.spyOn(view, "afficherTexteModale");
      jeu.joueurs[0] = creerJoueurVue({ nom: "Bob" });

      view.afficherMenuPropositions(
        [{ titre: "Acheter", description: "..." }],
        0,
      );

      const [titre] = spy.mock.calls[0];
      expect(titre).toBe("Propositions à Bob");
    });
  });

  // --------------- Tests afficher modale ----------------

  describe("afficherModale", () => {
    test("retourne les coordonnées et dimensions de la modale", () => {
      const modale = view.afficherModale("Titre test");

      expect(modale).toHaveProperty("x");
      expect(modale).toHaveProperty("y");
      expect(modale).toHaveProperty("width");
      expect(modale).toHaveProperty("height");
      expect(modale).toHaveProperty("headerH");
    });

    test("dessine le titre passé en paramètre", () => {
      view.afficherModale("Mon titre");

      expect(ctx.fillText).toHaveBeenCalledWith(
        "Mon titre",
        expect.any(Number),
        expect.any(Number),
      );
    });
  });

  // --------------- Tests afficher le résultat du dé ----------------

  describe("afficherResultatDe", () => {
    test("ne dessine rien si l'image du dé n'est pas encore chargée (complete=false)", () => {
      view.imagesResultatsDe[0].complete = false;
      jeu.de.valeurAffichee = 2; // index 0

      view.afficherResultatDe();

      expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    test("applique une transparence (globalAlpha 0.5) si l'état est EN_ATTENTE", () => {
      jeu.etat = EtatsJeu.EN_ATTENTE;
      jeu.de.valeurAffichee = 2;
      view.imagesResultatsDe[0].complete = true;

      view.afficherResultatDe();

      expect(ctx.globalAlpha).toBe(0.5);
    });

    test("dessine l'image du dé si elle est chargée", () => {
      jeu.de.valeurAffichee = 2;
      view.imagesResultatsDe[0].complete = true;

      view.afficherResultatDe();

      expect(ctx.drawImage).toHaveBeenCalled();
    });
  });
});
