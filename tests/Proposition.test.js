import { jest } from "@jest/globals";
import { 
    Proposition, 
    PropositionJouerDeSortiePrison, 
    PropositionJouerCarteChanceSortiePrison, 
    PropositionJouerCarteFondsCommunsSortiePrison, 
    PropositionAcheterCartePourSortiePrison, 
    PropositionPayerAmende, 
    PropositionTirerCarteChance, 
    PropositionAcheterPropriete,
    PropositionConstruireMaison, 
    PropositionConctruireHotel, 
    PropositionDecliner,
} from '../js/model/Proposition.js';
import { CaseRue } from '../js/model/CaseJeu.js';
import Joueur from '../js/model/Joueur.js';
import Banque from '../js/model/Banque.js';
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

// ------------------ tests pour sortir de prison avec dé --------------------

describe('PropositionJouerDeSortiePrison', () => {

    // estDisponible() retourne true par défaut
    test('retourne true si la proposition est disponible', () => {
        const proposition = new PropositionJouerDeSortiePrison('Titre', 'Description');
        proposition.estDisponible = () => true;

        expect(proposition.estDisponible()).toBe(true);
    });

    test('retourne false si la proposition n\'est pas disponible', () => {
        const proposition = new PropositionJouerDeSortiePrison('Titre', 'Description');
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

// -------------- tests carte chance sortie de prison ---------------------

describe('carte chance pour sortir de prison', () => {

    // tests estDisponible()
    test('retourne true si le joueur a la carte', () => {
        const proposition = new PropositionJouerCarteChanceSortiePrison();
        const joueur = { carteChanceSortiePrison: true };

        expect(proposition.estDisponible(joueur)).toBe(true);
    });

    test('retourne false si le joueur n\'a pas la carte', () => {
        const proposition = new PropositionJouerCarteChanceSortiePrison();
        const joueur = { carteChanceSortiePrison: false };

        expect(proposition.estDisponible(joueur)).toBe(false);
    });

    test('retourne false si la propriété est absente', () => {
        const proposition = new PropositionJouerCarteChanceSortiePrison();
        const joueur = {};

        expect(proposition.estDisponible(joueur)).toBe(false);
    });

    // tests valider()
    test('le joueur sort de prison', () => {
        const proposition = new PropositionJouerCarteChanceSortiePrison();
        const joueur = {
            estEnPrison: true,
            compteurPourSortirPrison: 1,
            carteChanceSortiePrison: true,
        };

        const resultat = proposition.valider(joueur);

        expect(joueur.estEnPrison).toBe(false); 
        expect(joueur.compteurPourSortirPrison).toBe(0);
        expect(joueur.carteChanceSortiePrison).toBe(false);
        expect(resultat).toEqual({
            titre: 'Libre',
            message: 'Vous sortez de prison !'
        });
    }); 

    test('le joueur n\'a pas de carte chance pour sortir de prison', () => {
        const proposition = new PropositionJouerCarteChanceSortiePrison();
        const joueur = {
            estEnPrison: true,
            compteurPourSortirPrison: 1,
            carteChanceSortiePrison: false,
        };      
        const resultat = proposition.valider(joueur);

        expect(joueur.estEnPrison).toBe(true); 
        expect(joueur.compteurPourSortirPrison).toBe(1);
        expect(joueur.carteChanceSortiePrison).toBe(false);
        expect(resultat).toBe(false);
    });
}); 

// -------------- tests carte fonds commun sortie de prison ---------------

 describe('carte fonds commun pour sortir de prison', () => {

    // tests estDisponible() 
        test('retourne true si le joueur a la carte', () => {
            const proposition = new PropositionJouerCarteFondsCommunsSortiePrison();
            const joueur = { carteFondsCommunsSortiePrison: true };

            expect(proposition.estDisponible(joueur)).toBe(true);
        });

        test('retourne false si le joueur n\'a pas la carte', () => {
            const proposition = new PropositionJouerCarteFondsCommunsSortiePrison();
            const joueur = { carteFondsCommunsSortiePrison: false };

            expect(proposition.estDisponible(joueur)).toBe(false);
        });

        test('retourne false si la propriété est absente', () => {
            const proposition = new PropositionJouerCarteFondsCommunsSortiePrison();
            const joueur = {};

            expect(proposition.estDisponible(joueur)).toBe(false);
        });

        // tests valider()
        test('le joueur sort de prison si il a la carte', () => {
            const proposition = new PropositionJouerCarteFondsCommunsSortiePrison();
            const joueur = {
                estEnPrison: true,
                compteurPourSortirPrison: 1,
                carteFondsCommunsSortiePrison: true,
            };

            const resultat = proposition.valider(joueur);

            expect(joueur.estEnPrison).toBe(false);
            expect(joueur.compteurPourSortirPrison).toBe(0);
            expect(joueur.carteFondsCommunsSortiePrison).toBe(false);
            expect(resultat).toEqual({
                titre: 'Libre',
                message: 'Vous sortez de prison !'
            });
        });

        test('retourne false si le joueur n\'a pas la carte', () => {
            const proposition = new PropositionJouerCarteFondsCommunsSortiePrison();
            const joueur = {
                estEnPrison: true,
                compteurPourSortirPrison: 1,
                carteFondsCommunsSortiePrison: false,
            };

            const resultat = proposition.valider(joueur);

            expect(joueur.estEnPrison).toBe(true);
            expect(joueur.compteurPourSortirPrison).toBe(1);
            expect(resultat).toBe(false);
        });
    });
    
// ----------------- tests acheter carte sortie de prison ------------------

describe('acheter carte pour sortir de prison', () => {

    // tests estDisponible()
    test('retourne true si autre joueur a la carte chance ou fonds commun', () => {
        const proposition = new PropositionAcheterCartePourSortiePrison();
        const joueur = { 
            estEnPrison: true,
            carteChanceSortiePrison: false,
            carteFondsCommunsSortiePrison: false,
        };
        const autreJoueur = {
            carteChanceSortiePrison: true,
            carteFondsCommunsSortiePrison: false,
        };
        const jeu = { getJoueurs: () => [joueur, autreJoueur] };
        
        expect(proposition.estDisponible(joueur, jeu)).toBe(true);
    });

    test('retourne false si aucun autre joueur n\'a la carte chance ou fonds commun', () => {
        const proposition = new PropositionAcheterCartePourSortiePrison();
        const joueur = { 
            estEnPrison: true,
            carteChanceSortiePrison: false,
            carteFondsCommunsSortiePrison: false,
        };
        const autreJoueur = {
            carteChanceSortiePrison: false,
            carteFondsCommunsSortiePrison: false,
        };
        const jeu = { getJoueurs: () => [joueur, autreJoueur] };
        expect(proposition.estDisponible(joueur, jeu)).toBe(false);
    });

    // valider(): joueur achete la carte
    test('le joueur achète la carte chance pour sortir de prison', () => {
        const proposition = new PropositionAcheterCartePourSortiePrison();
        const joueur = new Joueur('Edouard');
        joueur.estEnPrison = true;
        joueur.compteurPourSortirPrison = 1;
        jest.spyOn(joueur, 'payer');

        const autreJoueur = new Joueur('Autre');
        autreJoueur.carteChanceSortiePrison = true;
        autreJoueur.carteFondsCommunsSortiePrison = false;
        jest.spyOn(autreJoueur, 'recevoir');

        const jeu = { getJoueurs: () => [joueur, autreJoueur] };

        const resultat = proposition.valider(joueur, jeu);
        
        expect(joueur.estEnPrison).toBe(false);
        expect(joueur.carteChanceSortiePrison).toBe(true);
        expect(joueur.compteurPourSortirPrison).toBe(0);
        expect(joueur.payer).toHaveBeenCalledWith(25);
        expect(autreJoueur.recevoir).toHaveBeenCalledWith(25);
        expect(resultat).toEqual({
            titre: 'Libre',
            message: `${joueur.nom} a acheté la carte pour sortir de prison.`
        });
    }); 

    test('retourne false si aucun autre joueur n\'a la carte chance ou fonds commun', () => {
        const proposition = new PropositionAcheterCartePourSortiePrison();
        
        const joueur = new Joueur('Edouard');
        joueur.estEnPrison = true;
        joueur.compteurPourSortirPrison = 1;
        jest.spyOn(joueur, 'payer');

        const autreJoueur = new Joueur('Autre');
        autreJoueur.carteChanceSortiePrison = false;
        autreJoueur.carteFondsCommunsSortiePrison = false;
        jest.spyOn(autreJoueur, 'recevoir');

        const jeu = { getJoueurs: () => [joueur, autreJoueur] };

        const resultat = proposition.valider(joueur, jeu);

        expect(joueur.estEnPrison).toBe(true);
        expect(joueur.compteurPourSortirPrison).toBe(1);
        expect(joueur.payer).not.toHaveBeenCalled();
        expect(autreJoueur.recevoir).not.toHaveBeenCalled();
        expect(resultat).toBe(false);
    });
}); 

// ------------- Tests Choix (carte fonds commun) -----------------------

describe('PropositionPayerAmendeFondsCommuns', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // tests estDisponible()
    test('retourne toujours true', () => {
        const proposition = new PropositionPayerAmende(50);

        expect(proposition.estDisponible()).toBe(true);
    });

    test('valider() : le joueur paye l\'amende', () => {
        const proposition = new PropositionPayerAmende(50);
        const joueur = new Joueur('Edouard');
        const banque = new Banque();
        jest.spyOn(joueur, 'payer');
        jest.spyOn(banque, 'recevoir');

        const resultat = proposition.valider(joueur, null, null, banque);

        expect(joueur.payer).toHaveBeenCalledWith(50);
        expect(banque.recevoir).toHaveBeenCalledWith(50);
        expect(resultat).toEqual({
            titre: 'Paiement',
            message: `${joueur.nom} a choisi de payer l'amende de 50 M.`
        });
    });
}); 

// ------------- Tests Choix (tirer carte chance) -----------------------

describe('PropositionTirerCarteChance', () => {

    // tests estDisponible()
    test('retourne toujours true', () => {
        const proposition = new PropositionTirerCarteChance();  
        expect(proposition.estDisponible()).toBe(true);
    });

    // tests valider()
    test('tire une carte chance, exécute son effet, et met à jour jeu.listeStatuts', () => {
        const proposition = new PropositionTirerCarteChance();

        const carte = {
            titre: 'Chance 3',
            description: 'Avancez de 3 cases',
            executer: jest.fn(() => ['Vous avancez de 3 cases.'])
        };

        const joueur = { nom: 'Alice' };
        const jeu = {
            piocheChance: [carte],
            piocheFondsCommun: [],
            listeStatuts: []
        };
        const banque = {};

        const resultat = proposition.valider(joueur, jeu, null, banque);

        expect(carte.executer).toHaveBeenCalledWith(joueur, jeu, banque);
        expect(jeu.listeStatuts).toEqual([
            '**Carte Chance 3',
            '//"Avancez de 3 cases"',
            'Vous avancez de 3 cases.'
        ]);
        expect(resultat).toEqual({
            titre: 'Carte Chance',
            message: 'Vous tirez une carte chance...'
        });
    });

    test('gère le cas d\'une carte "sortie de prison"', () => {
        const proposition = new PropositionTirerCarteChance();

        const carte = {
            titre: 'Chance 9',
            description: 'Sortez de prison',
            executer: jest.fn(() => [])
        };

        const joueur = { nom: 'Bob' };
        const jeu = {
            piocheChance: [carte],
            listeStatuts: []
        };

        proposition.valider(joueur, jeu, null, {});

        expect(joueur.carteChanceSortiePrison).toBe(true);
        expect(carte.executer).not.toHaveBeenCalled();
    });
});

// ------------------- tests PropositionAcheterPropriete -------------------

describe('PropositionAcheterPropriete', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // tests estDisponible()
    test('retourne true si case libre et assez d\'argent', () => {
        const proposition = new PropositionAcheterPropriete();
        const joueur = { argent: 500 };
        const casePropriete = {
            nom: 'Rue de la Paix',
            prixAchat: 200,
            estLibre: () => true
        };

        const resultat = proposition.estDisponible(joueur, casePropriete);

        expect(resultat).toBe(true);
        expect(proposition.description).toBe(
            'voulez-vous acheter "Rue de la Paix" pour 200 M ?'
        );
    });

    test('retourne false si case pas libre', () => {
        const proposition = new PropositionAcheterPropriete();
        const joueur = { argent: 500 };
        const casePropriete = {
            prixAchat: 200,
            estLibre: () => false
        };

        expect(proposition.estDisponible(joueur, casePropriete)).toBe(false);
    });

    test('retourne false si pas assez d\'argent', () => {
        const proposition = new PropositionAcheterPropriete();
        const joueur = { argent: 100 };
        const casePropriete = {
            prixAchat: 200,
            estLibre: () => true
        };

        expect(proposition.estDisponible(joueur, casePropriete)).toBe(false);
    });

    // tests valider()
    test('retourne false si non disponible', () => {
        const proposition = new PropositionAcheterPropriete();
        const joueur = new Joueur('Boris');
        joueur.argent = 100;
        const casePropriete = {
            prixAchat: 200,
            estLibre: () => true,
            proprietaire: null
        };
        const banque = new Banque();

        const resultat = proposition.valider(joueur, null, casePropriete, banque);

        expect(resultat).toBe(false); // pas assez d'argent
        expect(joueur.proprietes).not.toContain(casePropriete);
        expect(casePropriete.proprietaire).toBeNull();
    });

    test('achète la propriété : proprietaire, proprietes, paiement, message', () => {
        const proposition = new PropositionAcheterPropriete();
        const joueur = new Joueur('Hocine');
        joueur.argent = 500;
        jest.spyOn(joueur, 'payer');

        const casePropriete = {
            nom: 'Rue de la Paix',
            prixAchat: 200,
            estLibre: () => true,
            proprietaire: null
        };
        const banque = new Banque();
        jest.spyOn(banque, 'recevoir');

        const resultat = proposition.valider(joueur, null, casePropriete, banque);

        expect(casePropriete.proprietaire).toBe(joueur);
        expect(joueur.proprietes).toContain(casePropriete);
        expect(joueur.payer).toHaveBeenCalledWith(200);
        expect(banque.recevoir).toHaveBeenCalledWith(200);
        expect(resultat).toEqual({
            titre: 'Achat',
            message: 'Hocine a acheté Rue de la Paix pour 200 M.'
        });
    });
}); 

// -------------------- Tests contruire maisons ------------------------

describe('PropositionConstruireMaison', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // tests estDisponible() 
    test('retourne false si caseRue n\'est pas une CaseRue', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 500 };
        const casePasRue = { nombreMaisons: 0, prixMaison: 50 }; // pas une vraie CaseRue
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, casePasRue, jeu)).toBe(false);
    });

    test('retourne false si le joueur n\'est pas propriétaire', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = { nom: 'Autre' }; // pas "joueur"
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    test('retourne false si le joueur ne possède pas toute la collection', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => false) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    test('retourne false si déjà 4 maisons', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 4;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    test('retourne false si pas assez d\'argent', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 10 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    test('retourne true si toutes les conditions sont réunies', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 2;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(true);
    });

    // tests valider()
    test('retourne false si non disponible', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { argent: 10 }; // pas assez d'argent
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };
        jest.spyOn(caseRue, 'construire');

        const resultat = proposition.valider(joueur, jeu, caseRue, {});

        expect(resultat).toBe(false);
        expect(caseRue.construire).not.toHaveBeenCalled();
    });

    test('construit la maison et retourne le message', () => {
        const proposition = new PropositionConstruireMaison();
        const joueur = { nom: 'Alice', argent: 500 };
        const caseRue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };
        const banque = {};
        jest.spyOn(caseRue, 'construire').mockImplementation(() => {});

        const resultat = proposition.valider(joueur, jeu, caseRue, banque);

        expect(caseRue.construire).toHaveBeenCalledWith('maison', banque);
        expect(resultat).toEqual({
            titre: 'Construction: ',
            message: 'Alice a construit une maison sur Rue de la Paix.'
        });
    });
}); 

// -------------------- Tests contruire hotel ------------------------

describe('PropositionConctruireHotel', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // tests estDisponible() 
    test('retourne false si caseRue n\'est pas une CaseRue', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 500 };
        const casePasRue = { nombreMaisons: 0, prixMaison: 50 }; // pas une vraie CaseRue
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, casePasRue, jeu)).toBe(false);
    });

    test('retourne false si le joueur n\'est pas propriétaire', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = { nom: 'Autre' }; // pas "joueur"
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };
        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    // test retourne false si joueur n'a pas les 4 maisons
    test('retourne false si le joueur n\'a pas les 4 maisons', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 3;  
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    }); 

    // test retourne false si pas assez d'argent
    test('retourne false si pas assez d\'argent', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 10 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 4;  
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(false);
    });

    // test retourne true si toutes les conditions sont réunies
    test('retourne true si toutes les conditions sont réunies', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 500 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 4;  
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };

        expect(proposition.estDisponible(joueur, caseRue, jeu)).toBe(true);
    });

    // tests valider()
    test('retourne false si non disponible', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { argent: 10 };
        const caseRue = new CaseRue('Rue Test', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };
        jest.spyOn(caseRue, 'construire');

        const resultat = proposition.valider(joueur, jeu, caseRue, {});

        expect(resultat).toBe(false);
        expect(caseRue.construire).not.toHaveBeenCalled();
    });

    test('construit l\'hôtel et retourne le message', () => {
        const proposition = new PropositionConctruireHotel();
        const joueur = { nom: 'Alice', argent: 500 };
        const caseRue = new CaseRue('Rue de la Paix', 200, [10], 'bleu', 50, 100);
        caseRue.proprietaire = joueur;
        caseRue.nombreMaisons = 4;  
        const jeu = { possederTouteLaCollectionCases: jest.fn(() => true) };
        const banque = {};
        jest.spyOn(caseRue, 'construire').mockImplementation(() => {});

        const resultat = proposition.valider(joueur, jeu, caseRue, banque);

        expect(caseRue.construire).toHaveBeenCalledWith('hotel', banque);
        expect(resultat).toEqual({
            titre: 'Construction: ',
            message: 'Alice a construit un hôtel sur Rue de la Paix.'
        });
    });
});