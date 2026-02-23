import { Carte, CarteAction, CarteImmobiliere, CarteRue, CarteGare, CarteSociete } from './Carte.js'; 
import { Effet, DeplacementEffet, VersementEffet, PrisonEffet } from './Effet.js'
import ImagesPions from "./enums/ImagesPions.js";
import Joueur from './Joueur.js'; 
import { CaseJeuFactory } from './CaseJeuFactory.js';
import { CarteFactory } from './CarteFactory.js';
import De from './De.js';
import Banque from './Banque.js'; 
import EtatsJeu from './enums/EtatsJeu.js';
import { CaseSociete, CaseGare } from './CaseJeu.js';

class Jeu {
    constructor() {
        this.joueurActuelIndex = 0;
        this.joueurs = []; 
        this.estPartieFinie = false; 
        this.de = new De();
        this.piocheChance = [];
        this.piocheFondsCommun = []; 
        this.casesJeu = CaseJeuFactory.chargerDataCasesJeu(); 
        this.cartesChances = CarteFactory.chargerDataEffetsChance();
        this.banque = new Banque();
        this.etat = EtatsJeu.EN_COURS; 
        this.listePropositions = []; 
    }

    ajouterJoueur(nom, pion) {
        const joueur = new Joueur(nom, pion); 
        this.joueurs.push(joueur);

        return joueur;
    }

    determinerPremierJoueur() {

    }

    getJoueurs() {
        return this.joueurs;
    }

    changerJoueur() {
        this.joueurActuelIndex = (this.joueurActuelIndex + 1) % this.joueurs.length;
    }

    payerLoyer(joueurCourant, caseJeu) {
        const indexLoyer = caseJeu.calculerLoyer();

        if (indexLoyer >= 0) {
            let montant = caseJeu.loyers[indexLoyer]; 
            const proprietaire = caseJeu.proprietaire; 
            console.log("joueurcourant : ", joueurCourant.nom, "paie ", montant, "* le dé à ", proprietaire.nom); 

            // case "Société": loyer en fonction du résultat du dé
            if (caseJeu instanceof CaseSociete) {
                const resultatDe = this.de.valeurAffichee;
                console.log("résultat du dé pour calcul loyer société : ", resultatDe);

                if (indexLoyer === 0) { montant = resultatDe * 4; } // 1 société -> 4 fois le résultat du dé
                else { montant = resultatDe * 10; } // 2 sociétés -> 10 fois le résultat du dé
            }

            joueurCourant.payer(montant); 
            proprietaire.recevoir(montant); 
        }
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre affiché sur le dé
        
        // check si la case a un propriétaire (-> payer loyer )
        const caseJeu = this.casesJeu[joueurCourant.position]; 
        if (caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            this.payerLoyer(joueurCourant, caseJeu); 
        }

        // propositions au joueur 
        this.listePropositions = caseJeu.arriver(joueurCourant);
        if (this.listePropositions.length <= 1) { 
            this.changerJoueur(); // TODO : terminerTour()
        } else { 
            this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
        }
        return this.listePropositions;
    }

    /**
    * Choixdu message à afficher dans la modale en fonction du type d'action (achat loyer, carte chance/fonds commun, taxe...)
    */
    createMessage(type, details) {
        switch(type) {
            case "achat":
                return {
                    titre: "Achat :",
                    message: `${details.joueur} a acheté ${details.propriete} pour un montant de ${details.montant} M`
                };
            case "loyer":
                return {
                    titre: "Loyer : ",
                    message: `${details.joueur} a payé ${details.montant} M correspondant au loyer de ${details.propriete} à ${details.proprietaire}`
                };
            case "chance":
                return {
                    titre: "Carte Chance",
                    message: details.description 
                };
            case "fonds_commun":
                return {
                    titre: "Carte Fonds commun",
                    message: details.description
                };
            case "taxe":
                return {
                    titre: "Carte Taxe",
                    message: `${details.joueur} doit payer une taxe de ${details.montant} M.`
                };
            default:
                return { titre: "Info", message: details };
        }
    }

    /**
     * Valider proposition du joueur et appliquer ses effets
     */
    soumettreProposition(numProposition) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        const numProp = numProposition - 1; // n-1 dans la liste de propositions
        console.log("JEU : numero de la Prop choisie par le user: ", numProp);

        if (numProp >= this.listePropositions.length || numProp < 0) return; 

        // le dernier chiffre permet de sortir du menu de propositions sans en choisir une
        if (numProp === this.listePropositions.length) {
            this.etat = EtatsJeu.EN_COURS;
            return;
        }

        // Valider proposition (true/false) et appliquer ses effets (ex: acheter la case/payer pour sortir de prison...)
        const success = this.listePropositions[numProp].valider(joueurCourant, this.casesJeu[joueurCourant.position], this.banque);
        if (!success) return; 
        console.log("JEU : le joueur a acheté la case");
        this.etat = EtatsJeu.EN_COURS;
        // this.changerJoueur(); // TODO : terminerTour() changer de joueur + vérifier fin jeu

        return this.createMessage("achat", {
            joueur: joueurCourant.nom,  
            propriete: this.casesJeu[joueurCourant.position].nom,
            montant: this.casesJeu[joueurCourant.position].prixAchat
        });
    }

    verifierFinDuJeu() {

    }
}

export default Jeu; 

