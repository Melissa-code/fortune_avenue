import { jest } from "@jest/globals";
import { 
    Proposition, 
    PropositionJouerDeSortiePrison, 
    PropositionJouerCarteChanceSortiePrison, 
    PropositionJouerCarteFondsCommunsSortiePrison, 
    PropositionAcheterCartePourSortiePrison 
} from '../js/model/Proposition.js';
import EtatsJeu from '../js/model/enums/EtatsJeu.js';

describe('Proposition', () => {
    // tests estDisponible() 
    test('retourne undefined par défaut (méthode à surcharger)', () => {
        const proposition = new Proposition('Titre', 'Description');

        expect(proposition.estDisponible()).toBeUndefined();
    });

    test('retourne true si la proposition est disponible', () => {
        const proposition = new Proposition('Titre', 'Description');
        proposition.estDisponible = () => true; 

        expect(proposition.estDisponible()).toBe(true);
    });

    test('retourne false si la proposition n\'est pas disponible', () => {
        const proposition = new Proposition('Titre', 'Description');
        proposition.estDisponible = () => false;    

    expect(proposition.estDisponible()).toBe(false);
    });

    test('accepte des arguments sans planter', () => {
        const proposition = new Proposition('Titre', 'Description');
        const joueur = { nom: 'Magali' };
        const caseJeu = { nom: 'Rue Test' };
        const jeu = {};

        expect(() => proposition.estDisponible(joueur, caseJeu, jeu)).not.toThrow();
    });

    // tests valider()
    test('retourne undefined par défaut (méthode à surcharger)', () => {
        const proposition = new Proposition('Test', 'Description');

        expect(proposition.valider()).toBeUndefined();
    });

    // tests getListePropositions() toBe() => égalité stricte de référence
    test('retourne la liste statique LISTE_PROPOSITIONS', () => {
        const resultat = Proposition.getListePropositions();

        expect(resultat).toBe(Proposition.LISTE_PROPOSITIONS);
    });

    // tests getListePropositionsSortiePrison()
    test('retourne la liste statique LISTE_PROPOSITIONS_SORTIE_PRISON', () => {
        const resultat = Proposition.getListePropositionsSortiePrison();

        expect(resultat).toBe(Proposition.LISTE_PROPOSITIONS_SORTIE_PRISON);
    });

    // tests getListePropositionsFondsCommuns()
    test('retourne la liste statique LISTE_PROPOSITIONS_FONDSCOMMUNS', () => {
        const resultat = Proposition.getListePropositionsFondsCommuns();

        expect(resultat).toBe(Proposition.LISTE_PROPOSITIONS_FONDSCOMMUNS);
    });
}); 

// ------------------ tests pour sortir de prison ---------------------------

describe('PropositionJouerDeSortiePrison', () => {

    // estDisponible() retourne true par défaut
    test('retourne true si la proposition est disponible', () => {
        const proposition = new Proposition('Titre', 'Description');
        proposition.estDisponible = () => true;

        expect(proposition.estDisponible()).toBe(true);
    });

    test('retourne false si la proposition n\'est pas disponible', () => {
        const proposition = new Proposition('Titre', 'Description');
        proposition.estDisponible = () => false;    

        expect(proposition.estDisponible()).toBe(false);
    });

    // tests valider()
    test('12 : le joueur sort de prison', () => {
        const proposition = new PropositionJouerDeSortiePrison();
        const joueur = {
            estEnPrison: true,
            compteurPourSortirPrison: 1,
            payer: jest.fn(),
        };
        const banque = { recevoir: jest.fn() };
        const jeu = {
            de: { lancer: jest.fn(() => 12) },
            etat: EtatsJeu.EN_ATTENTE,
        };

        const resultat = proposition.valider(joueur, jeu, null, banque);

        expect(joueur.estEnPrison).toBe(false);
        expect(joueur.compteurPourSortirPrison).toBe(0);
        expect(jeu.etat).toBe(EtatsJeu.EN_COURS);
        expect(joueur.payer).not.toHaveBeenCalled();
        expect(banque.recevoir).not.toHaveBeenCalled();
        expect(resultat).toEqual({
            titre: 'Libre',
            message: '12 ! Vous sortez de prison !'
        });
    });

    test('raté, 3ème échec : libération forcée avec paiement', () => {
        const proposition = new PropositionJouerDeSortiePrison();
        const joueur = {
            estEnPrison: true,
            compteurPourSortirPrison: 2, //incrémenté à 3
            payer: jest.fn(),
        };
        const banque = { recevoir: jest.fn() };
        const jeu = {
            de: { lancer: jest.fn(() => 5) },
        };

        const resultat = proposition.valider(joueur, jeu, null, banque);

        expect(joueur.compteurPourSortirPrison).toBe(0); // remis à 0
        expect(joueur.estEnPrison).toBe(false);
        expect(joueur.payer).toHaveBeenCalledWith(50);
        expect(banque.recevoir).toHaveBeenCalledWith(50);
        expect(resultat).toEqual({
            titre: 'Libération forcée',
            message: '5 ! 3ème échec : vous payez 50 M et sortez de prison !'
        });
    });

    test('raté simple (compteur < 3) : reste en prison', () => {
        const proposition = new PropositionJouerDeSortiePrison();
        const joueur = {
            estEnPrison: true,
            compteurPourSortirPrison: 0, // incrémenté à 1
            payer: jest.fn(),
        };
        const banque = { recevoir: jest.fn() };
        const jeu = {
            de: { lancer: jest.fn(() => 7) },
        };

        const resultat = proposition.valider(joueur, jeu, null, banque);

        expect(joueur.compteurPourSortirPrison).toBe(1);
        expect(joueur.estEnPrison).toBe(true);
        expect(joueur.payer).not.toHaveBeenCalled();
        expect(banque.recevoir).not.toHaveBeenCalled();
        expect(resultat).toEqual({
            titre: 'Raté',
            message: '7 ! Vous restez en prison !'
        });
    });
}); 