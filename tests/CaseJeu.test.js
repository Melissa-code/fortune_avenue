import { jest } from "@jest/globals";
import { CaseJeu, CasePropriete, CaseRue, CaseGare, CaseSociete, CaseAction } from '../js/model/CaseJeu.js';
import EtatsJeu from '../js/model/enums/EtatsJeu.js';
import { Proposition, PropositionDecliner } from '../js/model/Proposition.js';

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



