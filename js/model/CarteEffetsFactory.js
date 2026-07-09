import TypesEffets from "./enums/TypesEffets.js";
import { CarteAction } from "./Carte.js";
import { DeplacementEffet, VersementEffet, GareProcheEffet, ReparationsEffet, PrisonEffet, ChoixEffet } from "./Effet.js";


export class CarteEffetsFactory {
    /**
     * parcourt les données de data/effets_chance.js ou data/effets_fonds_communs.js
     * @return {Array} de cartes
     */
    static chargerDataEffetsCartes(effetsCartesJson) {
        const cartes = [];
        
        for (const effetCarteJson of effetsCartesJson) {
            const carte = CarteEffetsFactory.generateCarte(effetCarteJson);
            cartes.push(carte);
        }
        
        return cartes;
    }

    static generateCarte(jsonObj) {
        switch (jsonObj.type) {
            case TypesEffets.DEPLACEMENT:
                return CarteEffetsFactory.parseCarteDeplacement(jsonObj);
            case TypesEffets.GARE_PROCHE_EFFET: 
                return CarteEffetsFactory.parseCarteGareProche(jsonObj);
            case TypesEffets.VERSEMENT:
                return CarteEffetsFactory.parseCarteVersement(jsonObj);   
            case TypesEffets.REPARATIONS:
                return CarteEffetsFactory.parseCarteReparations(jsonObj);
            case TypesEffets.ALLER_EN_PRISON:
                return CarteEffetsFactory.parseCarteAllerEnPrison(jsonObj);
            case TypesEffets.SORTIR_DE_PRISON:
                return CarteEffetsFactory.parseCarteSortirDePrison(jsonObj);
            case TypesEffets.CHOIX: 
                return CarteEffetsFactory.parseCarteChoix(jsonObj);
            default:
                console.error(`Type de carte chance inconnu: ${jsonObj.type}`);
                return null;
        }       
    }

    static parseCarteDeplacement(jsonObj) {
        const valeur_deplacement = jsonObj.type_deplacement === "absolu" ? jsonObj.index_case : jsonObj.nombreDePas;
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new DeplacementEffet(jsonObj.type_deplacement, valeur_deplacement, jsonObj.bonusPassage)]
        );    
    }

    static parseCarteGareProche(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new GareProcheEffet(jsonObj.type_deplacement, jsonObj.nombreDePas, jsonObj.bonusPassage)]
        );    
    }

    static parseCarteVersement(jsonObj) {
        const estCollectif = jsonObj.titre === "Fonds communs 9"; 
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new VersementEffet(
                jsonObj.montant, 
                jsonObj.source, 
                jsonObj.destinataire, 
                estCollectif)
            ],
        );    
    }   

    static parseCarteAllerEnPrison(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new PrisonEffet(true)]
        );    
    }   

    static parseCarteReparations(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,      
            [new ReparationsEffet(
                jsonObj.montant_par_maison, 
                jsonObj.montant_par_hotel, 
                jsonObj.source, 
                jsonObj.destinataire
            )],
        );    
    }

    static parseCarteSortirDePrison(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new PrisonEffet(false)]
        );    
    }

    static melangerCartes(effetsCartesJson) {
        const pioche = effetsCartesJson; 

        // mélange la pioche (Fisher-Yates)
        for (let i = pioche.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); //nb de 0 à i
            [pioche[i], pioche[j]] = [pioche[j], pioche[i]]; 
        }

        return pioche; 
    }

    static parseCarteChoix(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [new ChoixEffet(jsonObj.montant, jsonObj.source, jsonObj.destinataire)]
        ); 
    }
}