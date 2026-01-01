import TypesCases from "./enums/TypesCases.js";
import { CaseJeu, CaseRue, CaseGare, CaseSociete, CaseAction } from "./CaseJeu.js";
import casesJeuJson from "../../data/cases_jeu.js";

class CaseJeuFactory {

    static chargerDataCasesJeu() {
        const casesJeu = [];
        
        for (const caseDataJson of casesJeuJson) {
        const caseObjet = CaseJeuFactory.generateCase(caseDataJson);
        casesJeu.push(caseObjet);
        }

        return casesJeu;
    }

    static generateCase(jsonObj) {
        switch (jsonObj.type) {
            case TypesCases.RUE:
                return CaseJeuFactory.parseRue(jsonObj);

            case TypesCases.GARE:
                return CaseJeuFactory.parseGare(jsonObj);

            case TypesCases.SOCIETE:
                return CaseJeuFactory.parseSociete(jsonObj);

            case TypesCases.TAXE:
                return CaseJeuFactory.parseTaxe(jsonObj);

            default:
                let caseAction = CaseJeuFactory.parseAction(jsonObj);

                switch (jsonObj.type) {
                    case TypesCases.CHANCE:
                        // ajouter action
                        break;
                    case TypesCases.FONDS_COMMUNS:
                        // ajouter action
                        break;
                    case TypesCases.DEPART:
                        // ajouter action
                        break;
                    case TypesCases.PARC_GRATUIT:
                        // ajouter action
                        break;
                    case TypesCases.PRISON:
                        // ajouter action
                        break;
                    case TypesCases.ALLEZ_EN_PRISON:
                        // ajouter action
                        break;
                    }
                return caseAction;
            }
    }

    static parseRue(dataObj) {
        // Return instance de Case correspondant au type JSON
        return new CaseRue(
        dataObj.nom,
        dataObj.prixAchat,
        dataObj.loyers,
        dataObj.couleur
        );
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
