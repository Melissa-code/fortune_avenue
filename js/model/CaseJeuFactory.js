import TypesCases from "./enums/TypesCases.js";
import { CaseRue, CaseGare, CaseSociete, CaseAction } from "./CaseJeu.js";
import { VersementEffet, PrisonEffet, PiocheEffet } from "./Effet.js";
import casesJeuJson from "../../data/cases_jeu.js";

/**
 * Factory création des cases: transforme données brutes (JSON/Objets JS) en instances de classes 
 */
export class CaseJeuFactory {

    /**
     * parcourt les données de data/cases_jeu.js
     * @returns {Array} contenant les 40 objets Case du jeu
     */
    static chargerDataCasesJeu() {
        const casesJeu = [];
        
        for (const caseDataJson of casesJeuJson) {
            const caseObjet = CaseJeuFactory.generateCase(caseDataJson);
            casesJeu.push(caseObjet);
        }
        return casesJeu;
    }

    /**
     * détermine le type de case à créer en fonction de la propriété type des données brutes
     */
    static generateCase(jsonObj) {
        switch (jsonObj.type) {
            case TypesCases.RUE:
                return CaseJeuFactory.parseRue(jsonObj);

            case TypesCases.GARE:
                return CaseJeuFactory.parseGare(jsonObj);

            case TypesCases.SOCIETE:
                return CaseJeuFactory.parseSociete(jsonObj);

            default:
                // création de l'objet CaseAction (qui va contenir des effets spécifiques)
                let caseAction = CaseJeuFactory.parseAction(jsonObj);

                switch (jsonObj.type) {
                    case TypesCases.CHANCE:
                        caseAction.ajouterEffet(new PiocheEffet("chance"));
                        break;
                    case TypesCases.FONDS_COMMUNS:
                        caseAction.ajouterEffet(new PiocheEffet("fonds_communs"));
                        break;
                    case TypesCases.DEPART:
                        break;
                    case TypesCases.PARC_GRATUIT:
                        break;
                    case TypesCases.PRISON:
                        caseAction.ajouterEffet(new PrisonEffet(false));
                        break;
                    case TypesCases.TAXE:
                        const montant = jsonObj.prixAchat;
                        caseAction.ajouterEffet(new VersementEffet(montant, "joueur", "banque"));
                        break;
                    case TypesCases.ALLEZ_EN_PRISON:
                        caseAction.ajouterEffet(new PrisonEffet(true));
                        break;
                    }
                return caseAction;
            }
    }

    // transformation des propriétés brutes en paramètres de constructeur
    static parseRue(dataObj) {
        return new CaseRue(dataObj.nom, dataObj.prixAchat, dataObj.loyers, dataObj.couleur, dataObj.prixMaison, dataObj.prixHotel, dataObj.hypotheque);
    }

    static parseGare(dataObj) {
        return new CaseGare(dataObj.nom, dataObj.prixAchat, dataObj.loyers, dataObj.hypotheque);
    }

    static parseSociete(dataObj) {
        return new CaseSociete(dataObj.nom, dataObj.prixAchat, dataObj.loyers, dataObj.hypotheque);
    }

    static parseAction(dataObj) {
        return new CaseAction(dataObj.nom, dataObj.type);
    }
}
