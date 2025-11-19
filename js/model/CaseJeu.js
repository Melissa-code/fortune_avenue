export class CaseJeu {

    constructor(data) {
        this.numero = data.numero;
        this.type = data.type;
        this.nom = data.nom;
        this.couleur = data.couleur || null;
        this.prix = data.prix || null;
        this.loyers = data.loyers || null;
    }

    toString() {
        return `Case n°${this.numero}-${this.nom}, 
                type: ${this.type}, 
                couleur: ${this.couleur}, 
                prix: ${this.prix} M, 
                loyers: ${this.loyers}`
    }
}


export class CaseRue extends CaseJeu {
    constructor(data) {
        super(data);
        this.proprietaire = null;
        this.nombreMaisons = 0; 
        this.nombreHotels = 0; 
        this.hypotheque = false; //venduà la banque temporairement -> pas de loyer (lever hyp en payant un suppl à banque)
    }

    ajouterPropriete(typePropriete) {
        if (type === "maison") {
            this.nombreMaisons++; 
        } else if (type === "hôtel") {
            this.nombreHotels++; 
            this.nombreMaisons = 0; //on ôte toutesles maisons
        } else {
            console.log(`type inconnu: ${type}`)
        }
    }

    payerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

        if (this.nombreHotels > 0) return this.loyers[this.loyers.length - 2];
        // ajouter cas de tous les terrains nus 
        
        return this.loyers[this.nombreMaisons];
    }

    toString() {
        return `${super.toString()} - Maisons: ${this.nombreMaisons} - Hôtels: ${this.nombreHotels}`;
    }

}


export class CaseChance extends CaseJeu {

}


export class CaseFondsCommun extends CaseJeu {

}


export class CaseTaxe extends CaseJeu {

}


export class CaseDepart extends CaseJeu {

}


export class CaseParcGratuit extends CaseJeu {

}


export class CasePrison extends CaseJeu {

}


export class CaseAllerEnPrison extends CaseJeu {

}