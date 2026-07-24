import { jest } from '@jest/globals';
import { Effet, DeplacementEffet, GareProcheEffet, ChoixEffet, VersementEffet, PrisonEffet, ReparationsEffet, PiocheEffet } from '../js/model/Effet.js';
import Joueur from '../js/model/Joueur.js';
import Banque from '../js/model/Banque.js';
import TypesCases from '../js/model/enums/TypesCases.js';

// mock joueur
function creerJoueur(position = 0, nom = 'Melissa') {
    return {
        nom,
        position,
        aTraverseCaseDepart: false,
        recevoir: jest.fn(),
        payer: jest.fn(),
        avancer: jest.fn()
    };
}

// mock banque
function creerBanque() {
    return {
        recevoir: jest.fn(),
        payer: jest.fn(),
    };
}

// mock jeu
function creerJeu(cases, joueurs = [], piocheChance = [], piocheFondsCommun = []) {
    return {
        casesJeu: cases,
        caseApresDeplacementCarte: null,
        getJoueurs: () => joueurs,
        piocheChance: piocheChance,
        piocheFondsCommun: piocheFondsCommun,
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

//----------------------- Tests Versement effet -------------------------------------

describe('VersementEffet', () => {
    test('appliquer() estCollectif: chaque adversaire paie', () => {
        const melanie = creerJoueur('Mélanie');
        const john = creerJoueur('John');
        const jude = creerJoueur('Jude');
        const jeu = creerJeu([], [melanie, john, jude]);//cases

        const effet = new VersementEffet(20, null, null, true);
        const messages = effet.appliquer(melanie, jeu);

        expect(john.payer).toHaveBeenCalledWith(20);
        expect(jude.payer).toHaveBeenCalledWith(20);
        expect(melanie.recevoir).toHaveBeenCalledWith(20);
        expect(melanie.recevoir).toHaveBeenCalledTimes(2);
        expect(messages.length).toBe(2);
    }); 

    test('appliquer() versement de joueur à banque (string , ex: taxe)', () => {
        const joueur = creerJoueur();
        const banque = creerBanque();
        const effet = new VersementEffet(100, 'joueur', 'banque');

        const messages = effet.appliquer(joueur, null, banque);

        expect(joueur.payer).toHaveBeenCalledWith(100);
        expect(banque.recevoir).toHaveBeenCalledWith(100);
        expect(messages).toEqual([`${joueur.nom} paye 100 M à la banque.`]);
    });

    test('appliquer() versement de banque à joueur (string)', () => {
        const joueur = creerJoueur();
        const banque = creerBanque();
        const effet = new VersementEffet(10, 'banque', 'joueur');

        const messages = effet.appliquer(joueur, null, banque);

        expect(joueur.recevoir).toHaveBeenCalledWith(10);
        expect(banque.payer).toHaveBeenCalledWith(10);
        expect(messages).toEqual([`${joueur.nom} reçoit 10 M de la banque.`]);
    });

    test('appliquer() objet Joueur => objet Banque (instanceof)', () => {
        const source = new Joueur('Alice'); // vraie instance car intanceof 
        const destinataire = new Banque();  
        jest.spyOn(source, 'payer'); // run vraie methode payer()
        jest.spyOn(destinataire, 'recevoir');

        const effet = new VersementEffet(30, source, destinataire);
        const messages = effet.appliquer();

        expect(source.payer).toHaveBeenCalledWith(30);
        expect(destinataire.recevoir).toHaveBeenCalledWith(30);
        expect(messages).toEqual([`${destinataire.nom} reçoit 30 M de ${source.nom}.`]);
    });

    test('appliquer() objet Joueur => objet Joueur (instanceof)', () => {
        const source = new Joueur('Etienne'); 
        const destinataire = new Joueur('Bob');  
        jest.spyOn(source, 'payer'); 
        jest.spyOn(destinataire, 'recevoir');

        const effet = new VersementEffet(12, source, destinataire);
        const messages = effet.appliquer();

        expect(source.payer).toHaveBeenCalledWith(12);
        expect(destinataire.recevoir).toHaveBeenCalledWith(12);
        expect(messages).toEqual([`${destinataire.nom} reçoit 12 M de ${source.nom}.`]);
    });

    test('appliquer() objet Banque => objet Joueur (instanceof)', () => {
        const source = new Banque(); 
        const destinataire = new Joueur('Charlie');  
        jest.spyOn(source, 'payer'); 
        jest.spyOn(destinataire, 'recevoir');

        const effet = new VersementEffet(17, source, destinataire);
        const messages = effet.appliquer();

        expect(source.payer).toHaveBeenCalledWith(17);
        expect(destinataire.recevoir).toHaveBeenCalledWith(17);
        expect(messages).toEqual([`${destinataire.nom} reçoit 17 M de la banque.`]);
    });
});

//----------------------- Tests Réparations effet ----------------------------

describe('ReparationsEffet', () => {  
    test('appliquer() le joueur paie pour les réparations', () => {
        const joueur = creerJoueur();
        joueur.calculerTotalMaisonsHotels = jest.fn(() => [3, 1]); //3 maisons et 1 hôtel
        const banque = creerBanque();
        const effet = new ReparationsEffet(50, 20, joueur, banque); // 50 M par maison, 20 M par hôtel
        
        const messages = effet.appliquer(joueur, null, banque);

        expect(joueur.payer).toHaveBeenCalledWith(170);
        expect(banque.recevoir).toHaveBeenCalledWith(170);
        expect(messages).toEqual([`${joueur.nom} paie 170 M pour les réparations.`]);
    });

    test('appliquer() le joueur ne paie aucune réparations avec 0 maison et 0 hôtel', () => {
        const joueur = creerJoueur();
        joueur.calculerTotalMaisonsHotels = jest.fn(() => [0, 0]); 
        const banque = creerBanque();
        const effet = new ReparationsEffet(50, 20, joueur, banque);

        const messages = effet.appliquer(joueur, null, banque);

        expect(joueur.payer).not.toHaveBeenCalled();
        expect(banque.recevoir).not.toHaveBeenCalled();
        expect(messages).toEqual([`${joueur.nom} n'a ni maison ni d'hôtel. Pas de réparations.`]);
    }); 
}); 

//----------------------- Tests Prison effet ---------------------------------

describe('PrisonEffet', () => {
    test('appliquer() le joueur est envoyé en prison', () => {
        const joueur = creerJoueur();
        const effet = new PrisonEffet(true);
        const messages = effet.appliquer(joueur);

        expect(joueur.position).toBe(10); // case prison position
        expect(joueur.estEnPrison).toBe(true);
        expect(messages).toEqual([`${joueur.nom} est envoyé(e) en prison !`]);
    });

    test('appliquer() le joueur est en simple visite', () => {
        const joueur = creerJoueur();
        const effet = new PrisonEffet(false);
        const messages = effet.appliquer(joueur);
        
        expect(messages).toEqual([`Prison : ${joueur.nom} est en simple visite.`]);
    });

    test('appliquer() le joueur est libéré de prison', () => {
        const joueur = creerJoueur();
        joueur.estEnPrison = true; // au prealable
        const effet = new PrisonEffet(false);
        const messages = effet.appliquer(joueur);

        expect(joueur.estEnPrison).toBe(false);
        expect(messages).toEqual([`${joueur.nom} est libéré(e) de prison !`]);  
    }); 
});

//----------------------- Tests Pioche effet ---------------------------------

describe('PiocheEffet', () => {
    test('appliquer() le joueur pioche dans Chance quand typePioche = CHANCE', () => {
        const joueur = creerJoueur();
        const carteTiree = { 
            titre: 'Chance 3', 
            description: 'Avancez de 3 cases', 
            executer: jest.fn(() => []) 
        };
        const jeu = creerJeu([], [joueur]);
        jeu.piocheChance.push(carteTiree);

        const effet = new PiocheEffet(TypesCases.CHANCE);
        effet.appliquer(joueur, jeu);   

        expect(carteTiree.executer).toHaveBeenCalledWith(joueur, jeu, null); //banque = null
        expect(jeu.piocheChance).toContain(carteTiree); 
        expect(jeu.piocheChance.length).toBe(1);
    });

    test('appliquer() pioche dans Fonds communs', () => {
        const joueur = creerJoueur();
        const jeu = creerJeu([], [joueur]);
        const carteTiree = { 
            titre: 'Fonds communs 6', 
            description: 'Recevez 50 M.', 
            executer: jest.fn(() => []) 
        };
        jeu.piocheFondsCommun.push(carteTiree);
    
        const effet = new PiocheEffet(TypesCases.FONDS_COMMUNS); 
        effet.appliquer(joueur, jeu);

        expect(carteTiree.executer).toHaveBeenCalledWith(joueur, jeu, null);
        expect(jeu.piocheFondsCommun).toContain(carteTiree);
        expect(jeu.piocheFondsCommun.length).toBe(1);
    });

    test('appliquer() remet la carte tirée au fond de la pioche', () => {
        const carte1 = { titre: 'A', description: 'desc A', executer: jest.fn(() => []) };
        const carte2 = { titre: 'B', description: 'desc B', executer: jest.fn(() => []) };
        const jeu = creerJeu([carte1, carte2], []);
        const joueur = creerJoueur();
        jeu.piocheFondsCommun.push(carte1);
        jeu.piocheFondsCommun.push(carte2);

        const effet = new PiocheEffet(TypesCases.FONDS_COMMUNS);
        effet.appliquer(joueur, jeu);

        expect(jeu.piocheFondsCommun).toEqual([carte2, carte1]); // carte1 remise au fond
    });

    test('appliquer() construit les messages titre et description', () => {
        const carteTiree = { titre: 'Chance 9', description: 'Avancez de 3 cases.', executer: jest.fn(() => []) };
        const jeu = creerJeu([carteTiree], []);
        const joueur = creerJoueur();
        jeu.piocheChance.push(carteTiree);

        const effet = new PiocheEffet(TypesCases.CHANCE);
        const messages = effet.appliquer(joueur, jeu);

        expect(messages[0]).toBe('**Carte Chance 9');
        expect(messages[1]).toBe('//"Avancez de 3 cases."');
    });

    test('appliquer() carte "sortie de prison" n\'exécute pas la carte', () => {
        const carteTiree = { 
            titre: 'Chance 9', 
            description: 'Sortez de prison', 
            executer: jest.fn(() => []) 
        };
        const jeu = creerJeu([carteTiree], []);
        const joueur = creerJoueur();
        jeu.piocheChance.push(carteTiree);

        const effet = new PiocheEffet(TypesCases.CHANCE);
        const messages = effet.appliquer(joueur, jeu);

        expect(joueur.carteChanceSortiePrison).toBe(true);
        expect(carteTiree.executer).not.toHaveBeenCalled();
        expect(messages).toContain('Vous pouvez sortir de prison avec cette carte.');
    });

    test('appliquer() carte, exécute executer() et ajoute ses messages', () => {
        const carteTiree = {
            titre: 'Chance 3',
            description: 'Avancez de 3 cases',
            executer: jest.fn(() => ['Reculez de 3 cases.'])
        };
        const jeu = creerJeu([carteTiree], []);
        const joueur = creerJoueur();
        const banque = creerBanque();
        jeu.piocheChance.push(carteTiree);

        const effet = new PiocheEffet(TypesCases.CHANCE);
        const messages = effet.appliquer(joueur, jeu, banque);

        expect(carteTiree.executer).toHaveBeenCalledWith(joueur, jeu, banque);
        expect(messages).toContain('Reculez de 3 cases.');
        expect(messages.length).toBe(3); 
    });
});