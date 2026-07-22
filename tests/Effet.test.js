import { jest } from '@jest/globals';
import { 
    Effet, 
    DeplacementEffet, 
    GareProcheEffet, 
    ChoixEffet, 
    VersementEffet, 
    PrisonEffet, 
    ReparationsEffet,
    PiocheEffet 
} from '../js/model/Effet.js';


// mock joueur
function creerJoueur(position = 0) {
    return {
        nom: 'Melissa',
        position,
        aTraverseCaseDepart: false,
        recevoir: jest.fn(),
        avancer: jest.fn()
    };
}

// mock jeu
function creerJeu(cases) {
    return {
        casesJeu: cases,
        caseApresDeplacementCarte: null
    };
}

//----------------------- Tests Deplacement effet  --------------------------

describe('DeplacementEffet', () => {

    test('appliquer() déplacement absolu', () => {
        const joueur = creerJoueur(5);
        const jeu = creerJeu({ 5: { nom: 'Case 5' }, 10: { nom: 'Case 10' } });
        const effet = new DeplacementEffet('absolu', 10);

        effet.appliquer(joueur, jeu);

        expect(joueur.avancer).toHaveBeenCalledWith('absolu', 10);
    });

    test('appliquer() déplacement relatif', () => {
        const joueur = creerJoueur(5);
        const jeu = creerJeu({ 5: { nom: 'Case 5' }, 8: { nom: 'Case 8' } });
        const effet = new DeplacementEffet('relatif', 3);

        effet.appliquer(joueur, jeu);

        expect(joueur.avancer).toHaveBeenCalledWith('relatif', 3, 0);
    });

    test('appliquer() bonus case départ', () => {
        const joueur = creerJoueur(5);
        joueur.aTraverseCaseDepart = true;
        const jeu = creerJeu({ 5: { nom: 'Case 5' }, 1: { nom: 'Belleville' } });
        const effet = new DeplacementEffet('absolu', 1);

        const messages = effet.appliquer(joueur, jeu);

        expect(joueur.recevoir).toHaveBeenCalledWith(200);
        expect(messages).toContain('Melissa passe par la case départ et reçoit 200 M.');
    });
});

//----------------------- Tests Gare la plus proche effet --------------------------

describe('GareProcheEffet', () => {

    test('appliquer() déplacement vers la prochaine gare', () => {
        const joueur = creerJoueur(6);
        const caseGare1 = { nom: 'Gare du Nord' };
        const jeu = creerJeu({ 6: { nom: 'Case 6' }, 15: caseGare1 });
        
        const effet = new GareProcheEffet();
        // simule joueur.avancer() pour MAJ position du joueur ('absolu', 15)
        joueur.avancer.mockImplementation((type, position) => {
            joueur.position = position;  
        });
        effet.appliquer(joueur, jeu);

        expect(joueur.avancer).toHaveBeenCalledWith('absolu', 15);
        expect(jeu.caseApresDeplacementCarte).toBe(caseGare1);
    });

    test('appliquer() revient à la case 5 si pas de gare après la position actuelle', () => {
        const joueur = creerJoueur(39);
        const caseGare1 = { nom: 'Gare de Lyon' };
        const jeu = creerJeu({ 39: { nom: 'Case 39' }, 5: caseGare1 });

        const effet = new GareProcheEffet();
        joueur.avancer.mockImplementation((type, position) => {
            joueur.position = position;  
        });
        effet.appliquer(joueur, jeu);

        expect(joueur.avancer).toHaveBeenCalledWith('absolu', 5);
        expect(jeu.caseApresDeplacementCarte).toBe(caseGare1);
    }); 
});

describe('trouverGareLaPlusProche() déplacement', () => {
    const effet = new GareProcheEffet();

    test('position 0 => gare 5', () => {
        expect(effet.trouverGareLaPlusProche(0)).toBe(5);
    });

    test('position 4 => gare 5', () => {
        expect(effet.trouverGareLaPlusProche(4)).toBe(5);
    });

    test('position 5 => gare 15', () => {
        expect(effet.trouverGareLaPlusProche(5)).toBe(15);
    });

    test('position 34 => gare 35', () => {
        expect(effet.trouverGareLaPlusProche(34)).toBe(35);
    });

    test('position 35 => gare 5 (boucle)', () => {
        expect(effet.trouverGareLaPlusProche(35)).toBe(5);
    });
});

//----------------------- Tests Choix effet  --------------------------

describe('ChoixEffet', () => {
    test('appliquer() met listePropositions et état EN_ATTENTE', () => {
        const joueur = creerJoueur();
        const jeu = { listePropositions: [], etat: 'EN_COURS' };
        const effet = new ChoixEffet(10, 'joueur', 'banque');

        effet.appliquer(joueur, jeu);

        expect(jeu.listePropositions.length).toBeGreaterThan(0);
        expect(jeu.etat).toBe('EN_ATTENTE');
    });

    test('appliquer() retourne un tableau vide', () => {
        const joueur = creerJoueur();
        const jeu = { listePropositions: [], etat: 'EN_COURS' };
        const effet = new ChoixEffet(10, 'joueur', 'banque');

        const messages = effet.appliquer(joueur, jeu);

        expect(messages).toEqual([]);
    });
});