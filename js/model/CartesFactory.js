import "../../data/cartes_chance.json";
import "../../data/cartes_fonds_communs.json";
import "../../data/cartes_rues.json";

class CartesFactory {

    static async createCartesChance() {
        try {
            const response = await fetch("../../data/cartes_chance.json");

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json(); 
            console.log(data);

            let cartesChanceList = []; 
            for(const carteChance of data.cartesChance) {
                cartesChanceList.push(carteChance.titre, carte.description)
            }
            
            return cartesChanceList;
        } catch(error) {
            console.error(error);
        }
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

export default CartesFactory; 