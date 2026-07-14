import { Carte, CarteAction } from '../js/model/Carte.js';

describe('Carte', () => {
    test('executer()retourne les messages des effets appliqués', () => {
        const carte = new Carte('Test Carte');
        expect(carte.executer()).toEqual([]);
    })
})