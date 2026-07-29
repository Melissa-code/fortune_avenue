import { 
    Proposition, 
    PropositionJouerDeSortiePrison, 
    PropositionJouerCarteChanceSortiePrison, 
    PropositionJouerCarteFondsCommunsSortiePrison, 
    PropositionAcheterCartePourSortiePrison 
} from '../js/model/Proposition.js';

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