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

    /**
     *  Payer le loyer au proprietaire de la case (autre joueur) si elle en a un 
     */
    payerLoyer(joueurCourant, caseJeu) {
        const indexLoyer = caseJeu.calculerLoyer(); // return index loyer
        console.log("index loyer : ", indexLoyer)

        if (indexLoyer >= 0) {
            let montant = caseJeu.loyers[indexLoyer]; 
            console.log('montant du loyer : ', montant)

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

            return this.createMessage("loyer", {
                joueur: joueurCourant.nom,  
                propriete: this.casesJeu[joueurCourant.position].nom,
                montant: montant,
                proprietaire: caseJeu.proprietaire.nom  
            }); 
        }
    }

    avancerJoueurCourant(valeurDeplacement) {
        const joueurCourant = this.joueurs[this.joueurActuelIndex]; 
        joueurCourant.avancer("relatif", valeurDeplacement) //chiffre du dé
        
        // check si la case a un propriétaire (-> payer loyer )
        const caseJeu = this.casesJeu[joueurCourant.position]; 

        if (caseJeu.proprietaire !== null && caseJeu.proprietaire !== joueurCourant) {
            const loyer = this.payerLoyer(joueurCourant, caseJeu); 
            // this.terminerTour();
            console.log("loyer payé : ", loyer) //objet
            return loyer;  
        } else {
            // propositions au joueur 
            this.listePropositions = caseJeu.arriver(joueurCourant);
            if (this.listePropositions.length >= 1) this.etat = EtatsJeu.EN_ATTENTE; // de propositions (modale)
            console.log("propositions : ", this.listePropositions)
            return this.listePropositions; // []array 
        }
    }

    /**
    * Choixdu message à afficher dans la modale en fonction du type d'action (achat loyer, carte chance/fonds commun, taxe...)
    */
    createMessage(type, details) {
        switch(type) {
            case "achat":
                return {
                    titre: "Achat :",
                    message: `${details.joueur} vient d'acheter "${details.propriete}" pour un montant de ${details.montant} M.`
                };
            case "refus": 
            return {
                titre : "Refus",
                message: `${details.joueur} a décliné la proposition d'achat de "${details.propriete}".`
            }
            case "loyer":
                return {
                    titre: "Loyer : ",
                    message: `${details.joueur} vient de payer la somme de ${details.montant} M correspondant au loyer de "${details.propriete}" à ${details.proprietaire}.`
                };
            case "taxe":
                return {
                    titre: "Carte Taxe",
                    message: `${details.joueur} doit payer une taxe d'un montant de ${details.montant} M.`
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

        if (numProp > this.listePropositions.length - 1 || numProp < 0) return; 

        // dernier chiffre permet de décliner/sortir du menu de propositions 
        if (numProp === this.listePropositions.length - 1) {
            this.etat = EtatsJeu.EN_COURS;
 
            return this.createMessage("refus", {
                joueur: joueurCourant.nom,  
                propriete: this.casesJeu[joueurCourant.position].nom
            });
        } 
        
        // Valider proposition (bool) et appliquer ses effets (ex: acheter la case/payer pour sortir de prison...)
        const success = this.listePropositions[numProp].valider(joueurCourant, this.casesJeu[joueurCourant.position], this.banque);
        if (!success) return; 

        this.etat = EtatsJeu.EN_COURS;

        return this.createMessage("achat", {
            joueur: joueurCourant.nom,  
            propriete: this.casesJeu[joueurCourant.position].nom,
            montant: this.casesJeu[joueurCourant.position].prixAchat
        });
        
    }

    terminerTour() {
        this.changerJoueur(); 
        // this.verifierFinJeu(); 
    }   

    verifierFinJeu() {

    }
}

export default Jeu; 

