import Banque from '../js/model/Banque.js';

//----------------------- Tests Banque ---------------------------

describe('Banque', () => {
    // payer 
    test('payer() maj de l\'argent de la banque', () => {
        const banque = new Banque();
        const montant = 1000;
        banque.payer(montant);
        expect(banque.argent).toEqual(14640 - montant); // 13640
    });

    test('payer() ne peut pas payer plus que ce qu\'il reste', () => {
        const banque = new Banque();
        banque.payer(20000); 
        expect(banque.argent).toEqual(0); // ne peut pas être négatif
    });

    // recevoir 
    test('recevoir() met à jour l\'argent de la banque', () => {
        const banque = new Banque();
        banque.recevoir(14640);
        expect(banque.argent).toEqual(29280);
    });
}); 