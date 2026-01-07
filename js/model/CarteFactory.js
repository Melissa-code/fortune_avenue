import "../../data/cartes_fonds_communs.json";
import "../../data/cartes_rues.json";
import effetsChanceJson from "../../data/effets_chance.js";

export class CarteFactory {

    static chargerDataEffetsChance() {
        const effetsChance = [];
        
        for (const effetChanceJson of effetsChanceJson) {
            const carteChance = CarteFactory.generateCarteChance(effetChanceJson);
            effetsChance.push(carteChance);
        }
        return effetsChance;
    }




    static createCartesFondsCommun() {
        const cartesFondsCommunList = []; 
        
        return cartesFondsCommunList
    }

    static createCartesRue() {
        const cartesRuesList = []; 

        return cartesRuesList; 
    }


}