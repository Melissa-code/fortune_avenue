/* ****************** Carte ****************** */

export class Carte {
    constructor(titre) {
        this.titre = titre; 
    }

    executer(joueur, jeu, banque=null){}
}

/* ******************  Carte Action (chance, fonds commun) ****************** */

export class CarteAction extends Carte {
    constructor(titre, description, effets) {
        super(titre); 
        this.description = description;
        this.effets = effets;
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    executer(joueur, jeu, banque)
    {
        for (let effet of this.effets) {
            // console.log(effet)
            effet.appliquer(joueur, jeu, banque)
        }
    }
}

/* ******************  Carte immobiliere (rue, gare, societe) ****************** */

export class CarteImmobiliere extends Carte {
    constructor(titre, prixAchat, loyers, prixHypotheque) {
        super(titre);  
        this.prixAchat = prixAchat; 
        this.loyers = loyers; 
        this.prixHypotheque = prixHypotheque;
        this.proprietaire = null;
        this.hypothequee = false;
    }

    calculerLoyer()
    {
        return this.loyers;
    }

    executer(joueur, jeu)
    {
        // tester dans jeu si elle disponible ou possedee
        // si possedee, alors payer un loyer a son proprietaire
        // sinon, proposer de l'acheter
    }
}

export class CarteRue extends CarteImmobiliere {
    constructor(titre, couleur, prixAchat, loyers, prixHypotheque, prixMaison, prixHotel) {
        super(titre, prixAchat, loyers, prixHypotheque);
        this.couleur = couleur;
        this.prixMaison = prixMaison; 
        this.prixHotel = prixHotel;
    }
}

export class CarteGare extends CarteImmobiliere {
    constructor(titre, prixAchat, loyers, prixHypotheque) {
        super(titre, prixAchat, loyers, prixHypotheque);
    }
}

export class CarteSociete extends CarteImmobiliere {
    constructor(titre, prixAchat, prixHypotheque) {
        super( titre, prixAchat, prixHypotheque);
    }
}