import TypesCases from "./TypesCases.js";
import { CaseJeu, CaseRue, CaseChance, CaseFondsCommun, CaseTaxe, CaseDepart, CaseParcGratuit, CasePrison, CaseAllerEnPrison } from "./CaseJeu.js";

class CaseJeuFactory {

    static createCase(dataCaseJeu) {
        switch(dataCaseJeu.type) {
            case TypesCases.RUE: return new CaseRue(dataCaseJeu);
            case TypesCases.CHANCE: return new CaseChance(dataCaseJeu);
            case TypesCases.FONDS_COMMUNS: return new CaseFondsCommun(dataCaseJeu);
            case TypesCases.TAXE: return new CaseTaxe(dataCaseJeu);
            case TypesCases.DEPART: return new CaseDepart(dataCaseJeu);
            case TypesCases.PARC_GRATUIT: return new CaseParcGratuit(dataCaseJeu);
            case TypesCases.PRISON: return new CasePrison(dataCaseJeu);
            case TypesCases.ALLEZ_EN_PRISON: return new CaseAllerEnPrison(dataCaseJeu);

            default: return new CaseJeu(dataCaseJeu);
        }
    }
}

export default CaseJeuFactory; 
