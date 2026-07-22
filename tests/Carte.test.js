import { Carte, CarteAction } from '../js/model/Carte.js';

//----------------------- Tests Carte ---------------------------

describe('Carte', () => {
    
    test('executer() retourne les messages des effets appliqués', () => {
        const carte = new Carte('Test Titre Carte');
        expect(carte.executer()).toEqual([]);
    }); 
}); 

//----------------------- Tests Carte Action ---------------------

describe('CarteAction', () => {

    test('executer() retourne les messages des effets appliqués', () => {
        const effet1 = { appliquer: () => ['Message effet 1'] };
        const effet2 = { appliquer: () => ['Message effet 2'] };
        const carteAction = new CarteAction(
            'Test Titre Carte Action', 
            'Description', 
            [effet1, effet2]
        );
        expect(carteAction.executer()).toEqual(
            ['Message effet 1', 'Message effet 2']
        );
    });

    test('ajouterEffet() ajoute un effet à la liste des effets', () => {
        const carteAction = new CarteAction(
            'Test Titre Carte Action', 
            'Description'
        );
        const effetMock = { appliquer: () => ['Message effet mock'] };
        carteAction.ajouterEffet(effetMock);
        expect(carteAction.effets).toContain(effetMock);
    });

    test('ajouterEffet() ajoute un effet à la liste des effets', () => {
        const carteAction = new CarteAction(
            'Test Titre Carte Action', 
            'Description'
        );
        const effetMock = { appliquer: () => ['Message effet mock'] };
        carteAction.ajouterEffet(effetMock);
        expect(carteAction.effets).toHaveLength(1);
    });        
}); 