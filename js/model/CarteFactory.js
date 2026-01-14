// import "../../data/cartes_fonds_communs.json";
// import "../../data/cartes_rues.json";
import effetsChanceJson from "../../data/effets_chance.js";
import TypesEffets from "./enums/TypesEffets.js";
import { CarteAction, CarteImmobiliere, CarteRue, CarteSociete, CarteGare, Carte } from "./Carte.js";
import { DeplacementEffet, VersementEffet, PrisonEffet, ReparationsEffet } from "./Effet.js";

export class CarteFactory {

    static chargerDataEffetsChance() {
        const cartesChance = [];
        
        for (const effetChanceJson of effetsChanceJson) {
            const carteChance = CarteFactory.generateCarteChance(effetChanceJson);
            cartesChance.push(carteChance);
        }
        return cartesChance;
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
            [ new DeplacementEffet(jsonObj.type_deplacement, jsonObj.index_case, jsonObj.bonusPassage)]
        );    
    }

    static parseCarteVersement(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [ new VersementEffet(jsonObj.montant, jsonObj.source, jsonObj.destinataire)]
        );    
    }   

    static parseCarteAllerEnPrison(jsonObj) {
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [ new PrisonEffet(true)]
        );    
    }   

    static parseCarteReparations(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [ new ReparationsEffet(jsonObj.montant_par_maison, jsonObj.montant_par_hotel, jsonObj.source, jsonObj.destinataire)]
        );    
    }

    static parseCarteSortirDePrison(jsonObj) {             
        return new CarteAction(
            jsonObj.titre,
            jsonObj.description,    
            [ new PrisonEffet(false)]
        );    
    }

    static melangerCartesChance() {
        let pioche = []; 
        pioche = CarteFactory.chargerDataEffetsChance() 

        // mélanger équitablement la pioche (Fisher-Yates)
        for (let i = pioche.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); //nb de 0 à i
            [pioche[i], pioche[j]] = [pioche[j], pioche[i]]; 
        }
        return pioche; 
    }
}