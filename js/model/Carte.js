/**
 * Carte de base (classe abstraite polymorphisme) 
 */
export class Carte {
    constructor(titre) {
        this.titre = titre; 
    }

    executer(joueur, jeu, banque = null) {
        return []; 
    }
}

/**
 * carte piochée (chance/fonds communs) avec effets 
 */
export class CarteAction extends Carte {
    constructor(titre, description, effets = []) {
        super(titre); 
        this.description = description;
        this.effets = effets;// effets[]
    }

    ajouterEffet(effet) {
        this.effets.push(effet);
    }

    executer(joueur, jeu, banque = null) {
        let messages = [];

        for (let effet of this.effets) {
            const messagesEffet = effet.appliquer(joueur, jeu, banque);
            // Ajoute messages de l'effet à la liste des messages
            for (let message of messagesEffet) {
                messages.push(message);
            }
        }
        return messages;
    }
}
