import Joueur from '../js/model/Joueur.js';
import { CaseRue } from '../js/model/CaseJeu.js';

describe('Joueur', () => {

    // Tests de la méthode gererArriveeSurCase()
    test('gererArriveeSurCase() MAJ correctement', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        
        // traverse case départ
        joueur.position = 35;// nouvelle position
        joueur.gererArriveeSurCase(39, false);//ancienne position
        expect(joueur.aTraverseCaseDepart).toBe(true);

        // ne traverse pas case départ
        joueur.position = 5; 
        joueur.gererArriveeSurCase(9, true);
        expect(joueur.aTraverseCaseDepart).toBe(false);
    });

    test('gererArriveeSurCase() ne traverse pas case départ si position = 0', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        joueur.position = 0; 
        joueur.gererArriveeSurCase(39, false);
        expect(joueur.aTraverseCaseDepart).toBe(false);
    });

    // Tests de la méthode avancer()
    test('avancer() MAJ correctement la position du joueur', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        
        // déplacement relatif positif
        joueur.position = 5; 
        joueur.avancer('relatif', 3); 
        expect(joueur.position).toBe(8);

        // déplacement relatif négatif
        joueur.position = 5; 
        joueur.avancer('relatif', -2); 
        expect(joueur.position).toBe(3);

        // déplacement absolu
        joueur.position = 5; 
        joueur.avancer('absolu', 10); 
        expect(joueur.position).toBe(10);
    });

    test('avancer() traverse case départ correctement', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        
        // traverse case départ
        joueur.position = 38; 
        joueur.avancer('relatif', 5); // nouvelle position = 3
        expect(joueur.aTraverseCaseDepart).toBe(true);

        // ne traverse pas case départ
        joueur.position = 5; 
        joueur.avancer('relatif', -2); // nouvelle position = 3
        expect(joueur.aTraverseCaseDepart).toBe(false);
    });

    test('avancer() ne traverse pas case départ si position = 0', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        joueur.position = 0; 
        joueur.avancer('relatif', 5); // nouvelle position = 5
        expect(joueur.aTraverseCaseDepart).toBe(false);
    });

    test('avancer() ne traverse pas case départ si déplacement absolu', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        joueur.position = 10; 
        joueur.avancer('absolu', 30); // nouvelle position = 3
        expect(joueur.aTraverseCaseDepart).toBe(false);
    });

    // Tests de la méthode recevoir() 
    test('recevoir() MAJ de l\'argent du joueur', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const montant = 100;
        joueur.recevoir(montant);
        expect(joueur.argent).toBe(1600); // 1500 + 100
    }); 

    test('recevoir() ne peut pas recevoir un montant négatif', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const montant = -50;
        joueur.recevoir(montant);
        expect(joueur.argent).toBe(1500); 
    });

    // Tests de la méthode payer()
    test('payer() MAJ de l\'argent du joueur', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const montant = 200;
        joueur.payer(montant);
        expect(joueur.argent).toBe(1300); // 1500 - 200
    });

    test('payer() ne peut pas payer un montant négatif', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const montant = -100;
        joueur.payer(montant);
        expect(joueur.argent).toBe(1500); 
    });

    // Tests de la méthode calculerTotalMaisonsHotels()
    test('calculerTotalMaisonsHotels() retourne le nombre total de maisons et d\'hôtels possédés par le joueur', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const propriete1 = new CaseRue('Rue 1', 100, 10, 50, 200, 500, 1000);
        propriete1.nombreMaisons = 2;
        propriete1.nombreHotels = 0;

        const propriete2 = new CaseRue('Rue 2', 150, 15, 75, 300, 600, 1200);
        propriete2.nombreMaisons = 0;
        propriete2.nombreHotels = 1;

        const propriete3 = new CaseRue('Rue 3', 200, 20, 100, 400, 700, 1400);
        propriete3.nombreMaisons = 3;
        propriete3.nombreHotels = 0;

        joueur.proprietes.push(propriete1, propriete2, propriete3);

        const [totalMaisons, totalHotels] = joueur.calculerTotalMaisonsHotels();
        expect(totalMaisons).toBe(5); 
        expect(totalHotels).toBe(1); 
    });

    test('calculerTotalMaisonsHotels() retourne 0 si le joueur ne possède aucune propriété', () => {
        const joueur = new Joueur('Test Joueur 1', 'Pion du joueur 1');
        const [totalMaisons, totalHotels] = joueur.calculerTotalMaisonsHotels();
        expect(totalMaisons).toBe(0); 
        expect(totalHotels).toBe(0); 
    });
    
}); 