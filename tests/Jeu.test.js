import { jest } from "@jest/globals";
import Jeu from "../js/model/Jeu.js";
import { CaseJeuFactory } from '../js/model/CaseJeuFactory.js';
import { CarteEffetsFactory } from '../js/model/CarteEffetsFactory.js';
import { CasePropriete, CaseAction } from '../js/model/CaseJeu.js';
import { Proposition } from '../js/model/Proposition.js';
import EtatsJeu from '../js/model/enums/EtatsJeu.js';

// versions vides
jest.unstable_mockModule('../js/model/CaseJeuFactory.js', () => ({
    CaseJeuFactory: {
        chargerDataCasesJeu: jest.fn(() => [])
    }
}));

jest.unstable_mockModule('../js/model/CarteEffetsFactory.js', () => ({
    CarteEffetsFactory: {
        chargerDataEffetsCartes: jest.fn(() => []),
        melangerCartes: jest.fn((cartes) => cartes)
    }
}));

describe("Jeu", () => {
    // réinitialise les données après chaque test
    afterEach(() => {
        CarteEffetsFactory.melangerCartes = jest.fn();
        CaseJeuFactory.chargerDataCasesJeu = jest.fn();
    });

    // Tests ajouterJoueur()
    test('ajoute un joueur à la liste joueurs et le retourne', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Mehdi', 'chapeau');

        expect(jeu.joueurs).toContain(joueur);
        expect(joueur.nom).toBe('Mehdi');
    });

    // tests getJoueurs()
    test('retourne la liste des joueurs', () => {
        const jeu = new Jeu();
        const joueur1 = jeu.ajouterJoueur('Mélodie', 'chapeau');
        const joueur2 = jeu.ajouterJoueur('Alizé', 'voiture');

        const joueurs = jeu.getJoueurs();

        expect(joueurs).toEqual([joueur1, joueur2]);
        expect(joueurs.length).toBe(2);
        expect(joueurs[0].nom).toBe('Mélodie');
        expect(joueurs[1].nom).toBe('Alizé');

        jeu.ajouterJoueur('Alice', 'chien');

        expect(jeu.getJoueurs().length).toBe(3);
    });

    // tests changerJoueur()
    test('change le joueur actuel en suivant l\'ordre de la liste', () => {
        const jeu = new Jeu();
        jeu.ajouterJoueur('Arthur', 'chapeau');
        const joueur2 = jeu.ajouterJoueur('Elise', 'voiture');
        
        jeu.changerJoueur();
        expect(jeu.joueurActuelIndex).toBe(1);
        expect(jeu.getJoueurs()[jeu.joueurActuelIndex]).toBe(joueur2);
    }); 

    test('revient au premier joueur après le dernier (boucle)', () => {
        const jeu = new Jeu();
        jeu.ajouterJoueur('Mireille', 'chapeau');
        jeu.ajouterJoueur('Benedicte', 'voiture');

        jeu.changerJoueur(); 
        jeu.changerJoueur(); // retour index 0

        expect(jeu.joueurActuelIndex).toBe(0);
    });

    // tests possederTouteLaCollectionCases() - en hex dnas data
    test('retourne false si aucune case de cette couleur', () => {
        const jeu = new Jeu();
        jeu.casesJeu = [];

        expect(jeu.possederTouteLaCollectionCases({}, 'bleu')).toBe(false);
    });

    test('retourne true si le joueur possède toutes les cases de la couleur', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Marina', 'levrier');
        jeu.casesJeu = [
            { couleur: 'bleu', proprietaire: joueur },
            { couleur: 'bleu', proprietaire: joueur },
        ];

        expect(jeu.possederTouteLaCollectionCases(joueur, 'bleu')).toBe(true);
    });

    test('retourne false si une case de la couleur appartient à un autre joueur', () => {
        const jeu = new Jeu();
        const joueur = { nom: 'Claude' };
        const autreJoueur = { nom: 'Robert' };
        jeu.casesJeu = [
            { couleur: 'bleu', proprietaire: joueur },
            { couleur: 'bleu', proprietaire: autreJoueur }
        ];

        expect(jeu.possederTouteLaCollectionCases(joueur, 'bleu')).toBe(false);
    });

    // tests payerLoyer()
    test('ne retourne rien si le loyer est 0', () => {
        const jeu = new Jeu();
        const joueurCourant = { nom: 'Amadi', payer: jest.fn() };
        const caseJeu = { calculerLoyer: jest.fn(() => 0) };

        const messages = jeu.payerLoyer(joueurCourant, caseJeu);

        expect(messages).toEqual([]);
    });

    test('applique le versement et retourne un message si loyer > 0', () => {
        const jeu = new Jeu();
        const proprietaire = { nom: 'Brigitte', recevoir: jest.fn() };
        const joueurCourant = { nom: 'Amandine', payer: jest.fn() };
        const caseJeu = {
            nom: 'Rue Test',
            proprietaire,
            calculerLoyer: jest.fn(() => 50)
        };

        const messages = jeu.payerLoyer(joueurCourant, caseJeu);

        expect(messages).toEqual([
            'Amandine paie 50 M de loyer à Brigitte pour la propriété "Rue Test".'
        ]);
    });

    // tests filtrerPropositionsValablesSortiePrison()
    test('garde seulement les propositions disponibles', () => {
        const propositionOui = { estDisponible: jest.fn(() => true) };
        const propositionNon = { estDisponible: jest.fn(() => false) };

        jest.spyOn(Proposition, 'getListePropositionsSortiePrison')
            .mockReturnValue([propositionOui, propositionNon]);

        const jeu = new Jeu();
        const resultat = jeu.filtrerPropositionsValablesSortiePrison({ nom: 'Eugénie' });

        expect(resultat).toEqual([propositionOui]);
    });

    // avancerJoueurCourant() 
    test('sur sa propre propriété -> message', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Hervé', 'chapeau');
        joueur.avancer = jest.fn(() => { joueur.position = 3; });

        const caseRue = Object.create(CasePropriete.prototype);
        caseRue.nom = 'Rue Test';
        caseRue.proprietaire = joueur;

        jeu.casesJeu = [null, null, null, caseRue];

        jeu.avancerJoueurCourant(3);

        expect(jeu.listeStatuts).toEqual([
            'Hervé est sur sa propriété "Rue Test".'
        ]);
    });

    test('sur propriété d\'un autre propriétaire -> paie le loyer', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Mélanie', 'yacht');
        joueur.avancer = jest.fn((type, val) => { joueur.position = 3; });

        const autreProprietaire = { nom: 'Fred' };
        const caseRue = Object.create(CasePropriete.prototype);
        caseRue.nom = 'Rue Test';
        caseRue.proprietaire = autreProprietaire;
        caseRue.calculerLoyer = jest.fn(() => 20);

        jeu.casesJeu = [null, null, null, caseRue];

        jeu.avancerJoueurCourant(3);

        expect(jeu.listeStatuts.length).toBeGreaterThan(0);
    });

    test('sur une CaseAction appelle arriver()', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Alain', 'chapeau');
        joueur.avancer = jest.fn(() => { joueur.position = 3; });

        const caseAction = Object.create(CaseAction.prototype);
        caseAction.arriver = jest.fn(() => ['Message action']);

        jeu.casesJeu = [null, null, null, caseAction];

        jeu.avancerJoueurCourant(3);

        expect(caseAction.arriver).toHaveBeenCalledWith(joueur, jeu);
        expect(jeu.listeStatuts).toEqual(['Message action']);
    });

    test('sur une propriété libre -> état jeu en EN_ATTENTE', () => {
        const jeu = new Jeu();
        const joueur = jeu.ajouterJoueur('Alex', 'chapeau');
        joueur.avancer = jest.fn(() => { joueur.position = 3; });

        const proposition = { titre: 'Acheter' };
        const caseLibre = Object.create(CasePropriete.prototype);
        caseLibre.proprietaire = null;
        caseLibre.arriver = jest.fn(() => [proposition]);

        jeu.casesJeu = [null, null, null, caseLibre];

        jeu.avancerJoueurCourant(3);

        expect(jeu.listePropositions).toEqual([proposition]);
        expect(jeu.etat).toBe(EtatsJeu.EN_ATTENTE);
    });

    // soumettreProposition()
    test('ne fait rien si numProposition invalide', () => {
        const jeu = new Jeu();
        jeu.ajouterJoueur('Mahité', 'chapeau');
        jeu.listePropositions = [];

        const resultat = jeu.soumettreProposition(0);

        expect(resultat).toBeUndefined();
    });

    test('valide la proposition et retourne le succès', () => {
        const jeu = new Jeu();
        jeu.casesJeu = [{ nom: 'Case 0' }]; // au moins 1 case position 0
        const joueur = jeu.ajouterJoueur('Valéry', 'chapeau');
        const propositionValide = { titre: 'Achat', message: 'ok' };
        const proposition = { valider: jest.fn(() => propositionValide) };
        jeu.listePropositions = [proposition];

        const resultat = jeu.soumettreProposition(1);

        expect(proposition.valider).toHaveBeenCalledWith(
            joueur, jeu, jeu.casesJeu[joueur.position], jeu.banque
        );
        expect(resultat).toEqual(propositionValide);
    });

    test('retourne undefined si valider() échoue (false)', () => {
        const jeu = new Jeu();
        jeu.casesJeu = [{ nom: 'Case 0' }];
        jeu.ajouterJoueur('Michelle', 'chapeau');
        const proposition = { valider: jest.fn(() => false) };
        jeu.listePropositions = [proposition];

        const resultat = jeu.soumettreProposition(1);

        expect(resultat).toBeUndefined();
    });

    // tests terminerTour()
    test('remet etat EN_COURS et change de joueur', () => {
        const jeu = new Jeu();
        jeu.ajouterJoueur('Bérangère', 'chapeau');
        jeu.ajouterJoueur('Véronique', 'voiture');
        jeu.etat = EtatsJeu.EN_ATTENTE;

        jeu.terminerTour();

        expect(jeu.etat).toBe(EtatsJeu.EN_COURS);
        expect(jeu.joueurActuelIndex).toBe(1);
    });
});