import { CarteEffetsFactory } from '../js/model/CarteEffetsFactory.js';
import TypesEffets from "../js/model/enums/TypesEffets.js";
import { CarteAction } from "../js/model/Carte.js";
import { DeplacementEffet, VersementEffet, GareProcheEffet, ReparationsEffet, PrisonEffet, ChoixEffet } from "../js/model/Effet.js";

describe('CarteEffetsFactory', () => {
    // tests charger DataEffetsCartes
    test('chargerDataEffetsCartes() retourne un tableau de cartes', () => {
        const effetsCartesJson = [
            {
                "titre": "Chance 1",
                "description": "Allez sur la case départ.",
                "type": TypesEffets.DEPLACEMENT,
                "type_deplacement": "absolu",
                "index_case": 5,
                "nombreDePas": 0,
                "bonusPassage": 200,
            },
            {
                "titre": "Chance 2",
                "description": "Versez 100 M à la banque.",
                "type": TypesEffets.VERSEMENT,
                "montant": 100,
                "source": "banque",
                "destinataire": "joueur",
            },
        ];

        const cartes = CarteEffetsFactory.chargerDataEffetsCartes(effetsCartesJson);

        expect(cartes).toHaveLength(2);
        expect(cartes[0]).toBeInstanceOf(CarteAction);
        expect(cartes[1]).toBeInstanceOf(CarteAction);
    });

    // tests sur generateCarte()
    test('appelle le bon parseur selon le type', () => {
        const effetsCartesJson = {
            type: TypesEffets.DEPLACEMENT,
            titre: 'Chance 1',
            description: 'test',
            type_deplacement: 'absolu',
            index_case: 5
        };

        const carte = CarteEffetsFactory.generateCarte(effetsCartesJson);

        expect(carte.effets[0]).toBeInstanceOf(DeplacementEffet);
    });

    test('retourne null pour un type inconnu', () => {
        const effetsCartesJson = { 
            type: 'type_inexistant', 
            titre: 'X', 
            description: 'Y'
        };

        const carte = CarteEffetsFactory.generateCarte(effetsCartesJson);

        expect(carte).toBeNull();
    });

 });