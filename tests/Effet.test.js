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

describe('DeplacementEffet', () => {

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