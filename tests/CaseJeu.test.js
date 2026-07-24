import { jest } from "@jest/globals";
import { CaseJeu, CasePropriete, CaseRue, CaseGare, CaseSociete, CaseAction } from '../js/model/CaseJeu.js';
import EtatsJeu from '../js/model/enums/EtatsJeu.js';
import { Proposition, PropositionDecliner } from '../js/model/Proposition.js';
import Joueur from '../js/model/Joueur.js';
import Banque from '../js/model/Banque.js';

//--------------------------- Tests Case -------------------------------------

describe('CaseJeu', () => {
    test('nom de la case', () => {
        const caseJeu = new CaseJeu('Départ');
        expect(caseJeu.nom).toBe('Départ');
    }); 

    test('arriver() sur la case', () => {
        const caseJeu = new CaseJeu('Départ');
        const joueur = { nom: 'Alice' };
        const jeu = { etat: EtatsJeu.EN_COURS };

        caseJeu.arriver(joueur, jeu);

        expect(caseJeu.nom).toBe('Départ');
    });
}); 

//-------------------------  Tests Case Propriete ----------------------------

describe('CasePropriete', () => {
    // tests filtrerPropositionsValables()
    test('garde seulement la proposition disponible', () => {
        const propositionOui = { estDisponible: () => true };   
        const propositionNon = { estDisponible: () => false };  

        jest.spyOn(Proposition, 'getListePropositions')
            .mockReturnValue([propositionOui, propositionNon]);

        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        const joueur = { nom: 'Michel' };
        const resultat = caseJeu.filtrerPropositionsValables(joueur, {});

        expect(resultat).toEqual([propositionOui]);
    });

    test('filtrerPropositionsValables() retourne [] si seule proposition est decliner', () => {
        const propositionDecliner = new PropositionDecliner();
        propositionDecliner.estDisponible = () => true;

        jest.spyOn(Proposition, 'getListePropositions')
            .mockReturnValue([propositionDecliner]);

        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        const joueur = { nom: 'Michel' };
        const resultat = caseJeu.filtrerPropositionsValables(joueur, {});

        expect(resultat).toEqual([]);
    });

    // tests pour estLibre()
    test('estLibre() retourne true si pas de proprietaire', () => {
        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        expect(caseJeu.estLibre()).toBe(true);
    });

    test('estLibre() retourne false si proprietaire existe', () => {
        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        caseJeu.proprietaire = { nom: 'Bobby' };
        expect(caseJeu.estLibre()).toBe(false);
    });

    // tests assigner un proprietaire
    test('assigner un proprietaire', () => {
        const caseJeu = new CasePropriete('Rue Test P', 100, [10]);
        const proprietaire = { nom: 'Bobby' };
        caseJeu.proprietaire = proprietaire;

        expect(caseJeu.proprietaire).toBe(proprietaire);
        expect(caseJeu.estLibre()).toBe(false);
        expect(caseJeu.nom).toBe('Rue Test P');
    });

    test('assigner un proprietaire null', () => {
        const caseJeu = new CasePropriete('Rue Test P', 100, [10]);
        caseJeu.proprietaire = null;

        expect(caseJeu.proprietaire).toBe(null);
        expect(caseJeu.estLibre()).toBe(true);
        expect(caseJeu.nom).toBe('Rue Test P');
    });

    test('assignerProprietaire() retourne false si case deja possedee', () => {     
        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        caseJeu.proprietaire = { nom: 'Bobby' }; 

        const joueur = { nom: 'Alice', proprietes: [] };
        const banque = { nom: 'Banque' };

        const resultat = caseJeu.assignerProprietaire(joueur, banque);
        
        expect(resultat).toBe(false);
        expect(caseJeu.proprietaire.nom).toBe('Bobby'); 
    }); 

    test('arriver() sur une case propriete libre propose d\'acheter', () => {
        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        const joueur = { nom: 'Alice', proprietes: [] };
        const jeu = { etat: EtatsJeu.EN_COURS };

        // retourne proposition d'achat
        jest.spyOn(caseJeu, 'filtrerPropositionsValables').mockReturnValue([{ type: 'acheter' }]);

        caseJeu.arriver(joueur, jeu);

        expect(caseJeu.filtrerPropositionsValables).toHaveBeenCalledWith(joueur, jeu);
    }); 

    test('arriver() sur une case propriete possedee retourne false', () => {
        const caseJeu = new CasePropriete('Rue Test', 100, [10]);
        caseJeu.proprietaire = { nom: 'Bobby' };
        const joueur = { nom: 'Alice', proprietes: [] };
        const jeu = { etat: EtatsJeu.EN_COURS };

        const resultat = caseJeu.arriver(joueur, jeu);

        expect(resultat).toEqual([]);
    });
});

// ---------------------  tests Cases rues ----------------------------------

describe('CaseRue', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('acheter maison : payer le prix de la maison au propriétaire', () => {
        const proprietaire = new Joueur('Alice');
        const banque = new Banque();
        jest.spyOn(proprietaire, 'payer');
        jest.spyOn(banque, 'recevoir');

        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        rue.proprietaire = proprietaire;

        rue.acheter('maison', banque);

        expect(proprietaire.payer).toHaveBeenCalledWith(50);
        expect(banque.recevoir).toHaveBeenCalledWith(50);
    });

    test('acheter hotel: payer le prix de l\'hôtel', () => {
        const proprietaire = new Joueur('Bob');
        const banque = new Banque();
        jest.spyOn(proprietaire, 'payer');
        jest.spyOn(banque, 'recevoir');

        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        rue.proprietaire = proprietaire;
        rue.nombreHotels = 0;

        rue.acheter('hotel', banque);

        expect(proprietaire.payer).toHaveBeenCalledWith(100);
        expect(banque.recevoir).toHaveBeenCalledWith(100);
    });

    test('acheter() ne fait rien si pas de propriétaire', () => {
        const banque = new Banque();
        jest.spyOn(banque, 'recevoir');

        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        // rue.proprietaire reste null

        rue.acheter('maison', banque);

        expect(banque.recevoir).not.toHaveBeenCalled();
    });

    // tests pour construire
    test('construire maison : incrémente nombreMaisons', () => {
        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        rue.proprietaire = new Joueur('Alice');
        jest.spyOn(rue, 'acheter').mockImplementation(() => {}); // on ignore le paiement ici

        rue.construire('maison', {});

        expect(rue.nombreMaisons).toBe(1);
        expect(rue.acheter).toHaveBeenCalledWith('maison', {});
    });

    test('construire hotel: transforme 4 maisons en 1 hôtel', () => {
        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        rue.proprietaire = new Joueur('Alice');
        rue.nombreMaisons = 4; // condition pour construire un hôtel
        jest.spyOn(rue, 'acheter').mockImplementation(() => {});

        rue.construire('hotel', {});

        expect(rue.nombreHotels).toBe(1);
        expect(rue.nombreMaisons).toBe(0); // remis à 0
        expect(rue.acheter).toHaveBeenCalledWith('hotel', {});
    });

    test('construire hotel: ne fait rien si moins de 4 maisons', () => {
        const rue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        rue.nombreMaisons = 2;
        jest.spyOn(rue, 'acheter').mockImplementation(() => {});

        rue.construire('hotel', {});

        expect(rue.nombreHotels).toBe(0);
        expect(rue.acheter).not.toHaveBeenCalled();
    });

    // calculerLoyer() pour les rues
    test('retourne 0 si hypothéquée', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');
        rue.proprietaire = { nom: 'Julien' };
        rue.isHypotheque = true;

        expect(rue.calculerLoyer({})).toBe(0);
    });

    test('retourne 0 si pas de propriétaire', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');

        expect(rue.calculerLoyer({})).toBe(0);
    });

    test('retourne le loyer max si un hôtel est construit', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');
        rue.proprietaire = { nom: 'Ali' };
        rue.nombreHotels = 1;

        expect(rue.calculerLoyer({})).toBe(60); // loyers[5]
    });

    test('retourne le loyer selon le nombre de maisons', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');
        rue.proprietaire = { nom: 'Alice' };
        rue.nombreMaisons = 2;

        expect(rue.calculerLoyer({})).toBe(30); // loyers[2]
    });

    test('retourne le loyer doublé si le joueur possède toute la collection', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');
        rue.proprietaire = { nom: 'Alice' };
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(rue.calculerLoyer(jeu)).toBe(60); 
    });

    test('retourne le loyer de base sinon', () => {
        const rue = new CaseRue('Rue Test', 200, [10, 20, 30, 40, 50, 60], 'bleu');
        rue.proprietaire = { nom: 'Alice' };
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => false) };

        expect(rue.calculerLoyer(jeu)).toBe(10); // loyers[0]
    });
});

// ------------------------ Tests Cases Gares ----------------------------------

describe('CaseGare', () => {
    //tests pour calculerLoyer()
    test('calculerLoyer() retourne 0 si hypothéquée', () => {
        const gare = new CaseGare('Gare du Nord', 200, [25, 50, 100, 200]);
        gare.proprietaire = { nom: 'Judith', proprietes: [] };
        gare.hypotheque = 100;

        expect(gare.calculerLoyer()).toBe(0);
    });

    test('calculerLoyer() retourne 0 si pas de propriétaire', () => {
        const gare = new CaseGare('Gare du Nord', 200, [25, 50, 100, 200]);

        expect(gare.calculerLoyer()).toBe(0);
    });

    test('calculerLoyer() retourne loyers[0] si le joueur possède 1 seule gare', () => {
        const gare = new CaseGare('Gare du Nord', 200, [25, 50, 100, 200]);
        const proprietaire = { nom: 'Alain', proprietes: [gare] };
        gare.proprietaire = proprietaire;

        expect(gare.calculerLoyer()).toBe(25);
    });

    test('calculerLoyer() retourne loyers[1] si le joueur possède 2 gares', () => {
        const gare1 = new CaseGare('Gare du Nord', 200, [25, 50, 100, 200]);
        const gare2 = new CaseGare('Gare de Lyon', 200, [25, 50, 100, 200]);
        const proprietaire = { nom: 'Marie', proprietes: [gare1, gare2] };
        gare1.proprietaire = proprietaire;

        expect(gare1.calculerLoyer()).toBe(50);
    });

    test('calculerLoyer() retourne loyers[3] si le joueur possède 4 gares', () => {
        const gare1 = new CaseGare('Gare 1', 200, [25, 50, 100, 200]);
        const gare2 = new CaseGare('Gare 2', 200, [25, 50, 100, 200]);
        const gare3 = new CaseGare('Gare 3', 200, [25, 50, 100, 200]);
        const gare4 = new CaseGare('Gare 4', 200, [25, 50, 100, 200]);
        const proprietaire = { 
            nom: 'Eve', 
            proprietes: [gare1, gare2, gare3, gare4] 
        };
        gare1.proprietaire = proprietaire;

        expect(gare1.calculerLoyer()).toBe(200);
    });
});


// ---------------------  tests Cases societes -------------------------------

describe('CaseSociete', () => {
    test('calculerLoyer() retourne 0 si hypothéquée', () => {
        const societe = new CaseSociete('Société Test', 150, [4, 10]);
        societe.proprietaire = { nom: 'Julien', proprietes: [] };
        societe.hypotheque = 100;
        
        expect(societe.calculerLoyer({ de: { valeurAffichee: 5 } })).toBe(0);
    });

    test('calculerLoyer() retourne 0 si pas de propriétaire', () => {
        const societe = new CaseSociete('Société Test', 150, [4, 10]);
        const jeu = { de: { valeurAffichee: 6 } };

        expect(societe.calculerLoyer(jeu)).toBe(0);
    });

    test('retourne dé x4 si le joueur possède 1 seule société', () => {
        const societe = new CaseSociete('Compagnie des eaux', 150, []);
        const proprietaire = { nom: 'May', proprietes: [societe] };
        societe.proprietaire = proprietaire;
        const jeu = { de: { valeurAffichee: 6 } };

        expect(societe.calculerLoyer(jeu)).toBe(24); // 6 * 4
    });

    test('retourne dé x10 si le joueur possède 2 sociétés', () => {
        const societe1 = new CaseSociete('Compagnie des eaux', 150, []);
        const societe2 = new CaseSociete('Compagnie électricité', 150, []);
        const proprietaire = { nom: 'Alice', proprietes: [societe1, societe2] };
        societe1.proprietaire = proprietaire;
        const jeu = { de: { valeurAffichee: 5 } };

        expect(societe1.calculerLoyer(jeu)).toBe(50); // 5 * 10
    });
});

// -------------------------- Tests Case d'action ----------------------------


