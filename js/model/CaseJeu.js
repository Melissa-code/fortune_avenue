import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'; 

export class CaseJeu {

    constructor(data) {
        // this.numero = data.numero;
        // this.type = data.type;
        this.nom = data.nom;
        // this.couleur = data.couleur || null;
        // this.prix = data.prix || null;
        // this.loyers = data.loyers || null;
    }

    arriver() {

    }
}

/* ******************  Cases de proprietes  ****************** */

export class CasePropriete extends CaseJeu {
    constructor(data) {
        super(data); 
        this.proprietaire = null;
        this.prixAchat = data.prix || null;
        this.hypotheque = false; //venduà la banque temporairement -> pas de loyer (lever hyp en payant un suppl à banque)
    }

    estLibre() {
        return !this.proprietaire;
    }

    acheter() {
        if (this.estLibre()) {
            const versement = new VersementEffet(this.prixAchat, joueur, banque); 
            versement.appliquer(joueur, banque)
            this.proprietaire = joueur;
            return true;
        }
        return false;
    }

    calculerLoyer() {
        // methd abstraite (impl dans les cl filles)
    }

    hypothequer() {
        if (this.proprietaire === joueur && this.hypotheque) {
            const montantHypotheque = this.prixAchat / 2;
            const remboursement = new VersementEffet(montantHypotheque, banque, joueur);
            remboursement.appliquer(joueur, banque);
            this.hypotheque = true;
            return true;
        }
        return false;
    }

    leverHypotheque(joueur, banque) {
        if (this.proprietaire === joueur && !this.hypotheque) {
            const montantAPayé = (this.prixAchat / 2) * 10 / 100 ; //10% interet
            const paiement = new VersementEffet(montantAPayé, joueur, banque);
            paiement.appliquer(joueur, banque);
            this.hypotheque = false;
            return true;
        }
        return false;
    }
}


export class CaseRue extends CasePropriete {
    constructor(data, proprietaire, prixAchat) {
        super(data, proprietaire, prixAchat);
        this.nombreMaisons = 0; 
        this.nombreHotels = 0; 
        this.couleur = data.couleur || null;
    }

    // TODO
    construire(typeConstruction) {
        if (typeConstruction === "maison") {
            this.nombreMaisons++; 
        } else if (typeConstruction === "hotel") {
            this.nombreHotels++; 
            this.nombreMaisons = 0; //on ôte toutesles maisons
        } else {
            console.log(`type de construction inconnu: ${type}`)
        }
    }

    /**
     * toutes les rues de la meme couleur, toutes les gares ou toutes les sociétés
     */
    possederTouteLaCollection() {
        // TODO if () {
        //    return true; 
        // }
        return false;
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

        if (this.nombreHotels > 0) {
            return this.data.loyers[5]; 
        }
        else if (this.nombreMaisons > 0) {
            return this.data.loyers[this.nombreMaisons];
        } 
        else if (this.possederTouteLaCollection()) {
            return this.data.loyers[this.data.loyers.length - 1]; 
        }
        else return this.data.loyers[0];
    }
}


export class CaseGare extends CasePropriete {
    constructor(data, nom, proprietaire, prixAchat) {
        super(data, nom, proprietaire, prixAchat);
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

    }
}


export class CaseSociete extends CasePropriete {
    constructor(data, nom, proprietaire, prixAchat) {
        super(data, nom, proprietaire, prixAchat);
    }

    calculerLoyer() {
        if (this.hypotheque || !this.proprietaire) return 0;

    }
}


/* ******************  Cases d'action  ****************** */

export class CaseAction extends CaseJeu {
    constructor(data, nom) {
        super(data, nom); 
        this.effets = [];
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    arriver(joueur,plateauJeu) {
        for (let effet of this.effets) {
            effet.appliquer(joueur, plateauJeu)
        }
    }
}

