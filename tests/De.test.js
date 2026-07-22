import De from '../js/model/De.js';

describe('De', () => {
    
    test('lancer() retourne la valeur affichée', () => {
        const de = new De('Test Titre Carte');
        expect(de.lancer()).toBeGreaterThanOrEqual(2);
        expect(de.lancer()).toBeLessThanOrEqual(12);
    }); 
}); 