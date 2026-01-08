import "../../data/cartes_fonds_communs.json";
import "../../data/cartes_rues.json";
import effetsChanceJson from "../../data/effets_chance.js";
import TypesEffets from "./enums/TypesEffets.js";
import { CarteAction, CarteImmobiliere, CarteRue, CarteSociete, CarteGare, Carte } from "./Carte.js";

export class CarteFactory {

    static chargerDataEffetsChance() {
        const effetsChance = [];
        
        for (const effetChanceJson of effetsChanceJson) {
            const carteChance = CarteFactory.generateCarteChance(effetChanceJson);
            effetsChance.push(carteChance);
        }
        return effetsChance;
    }

    static generateCarteChance(jsonObj) {
        switch (jsonObj.type) {
            case TypesEffets.DEPLACEMENT:
                return CarteFactory.parseCarteDeplacement(jsonObj);
            case TypesEffets.VERSEMENT:
                return CarteFactory.parseCarteVersement(jsonObj);   
            case TypesEffets.ALLER_EN_PRISON:
                return CarteFactory.parseCarteAllerEnPrison(jsonObj);
            case TypesEffets.REPARATIONS:
                return CarteFactory.parseCarteReparations(jsonObj);
            case TypesEffets.SORTIR_DE_PRISON:
                return CarteFactory.parseCarteSortirDePrison(jsonObj);
            default:
                console.error(`Type de carte chance inconnu: ${jsonObj.type}`);
                return null;
        }       
    }

    static parseCarteDeplacement(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            jsonObj.effet[ new DeplacementEffet(jsonObj.index_case, jsonObj.nombreDePas, jsonObj.bonusPassage)]
        );    
    }

    static parseCarteVersement(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            jsonObj.effet[ new VersementEffet(jsonObj.montant, jsonObj.source, jsonObj.destinataire)]
        );    
    }   

    static parseCarteAllerEnPrison(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            jsonObj.effet[ new AllerEnPrisonEffet()]
        );    
    }   

    static parseCarteReparations(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            jsonObj.effet[ new ReparationsEffet(jsonObj.montant_par_maison, jsonObj.montant_par_hotel, jsonObj.source, jsonObj.destinataire)]
        );    
    }

    static parseCarteSortirDePrison(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            jsonObj.effet[ new SortirDePrisonEffet()]
        );    
    }
}