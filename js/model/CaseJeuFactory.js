import TypesCases from "./enums/TypesCases.js";
import { CaseJeu, CaseRue, CaseGare, CaseSociete, CaseAction } from "./CaseJeu.js";

class CaseJeuFactory {
    // CaseJeuFactory adapte les données brutes en objets métiers

    static generateCase(jsonObj) {
        switch(jsonObj.type) {
            case TypesCases.RUE: 
                return CaseJeuFactory.parseRue(jsonObj);

            case TypesCases.GARE: 
                return CaseJeuFactory.parseGare(jsonObj);

            case TypesCases.SOCIETE: 
                return CaseJeuFactory.parseSociete(jsonObj);

            case TypesCases.CHANCE: 
            case TypesCases.FONDS_COMMUNS: 
            case TypesCases.DEPART: 
            case TypesCases.PARC_GRATUIT: 
            case TypesCases.PRISON: 
            case TypesCases.ALLEZ_EN_PRISON: 
                return CaseJeuFactory.parseAction(jsonObj);

            case TypesCases.TAXE: 
                return CaseJeuFactory.parseTaxe(jsonObj);

            default: 
                return new CaseJeu(jsonObj.nom);
        }
    }

    static parseRue(dataObj) {
        // Return instance de Case correspondant au type JSON
        return new CaseRue(dataObj.nom, dataObj.prixAchat, dataObj.loyers, dataObj.couleur);
    }
    
    static parseGare(dataObj) {
        return new CaseGare(dataObj.nom, dataObj.prixAchat, dataObj.loyers); 
    }

    static parseSociete(dataObj) {
        return new CaseSociete(dataObj.nom, dataObj.prixAchat, dataObj.loyers); 
    }

    static parseAction(dataObj) {
        return new CaseAction(dataObj.nom); 
    }

    static parseTaxe(dataObj) {
        return new CaseAction(dataObj.nom, dataObj.prixAchat);
    }
}

export default CaseJeuFactory; 
