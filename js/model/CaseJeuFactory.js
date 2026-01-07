import TypesCases from "./enums/TypesCases.js";
import { CaseJeu, CaseRue, CaseGare, CaseSociete, CaseAction } from "./CaseJeu.js";
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet, PiocheEffet } from "./Effet.js";
import casesJeuJson from "../../data/cases_jeu.js";
import effetsChanceJson from "../../data/effets_chance.js";


export class CaseJeuFactory {

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
                        caseAction.ajouterEffet(new PiocheEffet("chance"));
                        break;
                    case TypesCases.FONDS_COMMUNS:
                        caseAction.ajouterEffet(new PiocheEffet("fonds_commun"));
                        break;
                    case TypesCases.DEPART:
                        caseAction.ajouterEffet(new VersementEffet(200, "banque", "joueur"));
                        caseAction.ajouterEffet(new DeplacementEffet(0, 0, null)); //n°case , nbPas, bonusPassage
                        break;
                    case TypesCases.PARC_GRATUIT:
                        console.log('Parc gratuit: aucune action');
                        break;
                    case TypesCases.PRISON:
                        caseAction.ajouterEffet(new PrisonEffet(false));
                        break;
                    case TypesCases.AMENDES:
                        const montant = jsonObj.prixAchat;
                        caseAction.ajouterEffet(new VersementEffet(montant, "joueur", "banque"));
                        break;
                    case TypesCases.ALLEZ_EN_PRISON:
                        caseAction.ajouterEffet(new PrisonEffet(true));
                        caseAction.ajouterEffet(new DeplacementEffet(10, 0, null)); 
                        break;
                    }
                return caseAction;
            }
    }

    static parseRue(dataObj) {
        return new CaseRue(dataObj.nom,dataObj.prixAchat,dataObj.loyers,dataObj.couleur);
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
