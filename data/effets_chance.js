import TypesEffets from "../js/model/enums/TypesEffets.js";

const effetsChanceJson = [
    {
        "titre": "Chance 1",
        "description": "Rendez-vous à la rue de la Paix.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 39,
        "nombreDePas": 0,
        "bonusPassage": 0
    },
    {
        "titre": "Chance 2",
        "description": "Avancez jusqu'à la case départ.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 0,
        "nombreDePas": 0,
        "bonusPassage": 0
    },
    {
        "titre": "Chance 3",
        "description": "Rendez-vous à l’Avenue Henri-Martin. Si vous passez par la case départ, recevez 200 M.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 24,
        "nombreDePas": 0,
        "bonusPassage": 200
    },
    {
        "titre": "Chance 4",
        "description": "Avancez au Boulevard de La Villette. Si vous passez par la case départ, recevez 200 M.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 11,
        "nombreDePas": 0,
        "bonusPassage": 200
    },
    {
        "titre": "Chance 5",
        "description": "Vous êtes imposé pour les réparations de voirie à raison de 40 M par maison et 115 M par hôtel.",
        "type": TypesEffets.REPARATIONS,
        "montant_par_maison": 40,
        "montant_par_hotel": 115,
        "source": "joueur",
        "destinataire": "banque"
    },
    {
        "titre": "Chance 6",
        "description": "Avancez jusqu’à la Gare de Lyon. Si vous passez par la case départ, recevez 200 M.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 15,
        "nombreDePas": 0,
        "bonusPassage": 200
    },
    {
        "titre": "Chance 7",
        "description": "Vous avez gagné le prix des mots croisés : recevez 100 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 100,
        "source": "banque",
        "destinataire": "joueur"
    },
    {
        "titre": "Chance 8",
        "description": "La banque vous verse un dividende de 50 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 50,
        "source": "banque",
        "destinataire": "joueur"
    },
    {
        "titre": "Chance 9",
        "description": "Vous êtes libéré de prison. Cette carte peut être conservée jusqu’à ce qu’elle soit utilisée ou vendue.",
        "type": TypesEffets.SORTIR_DE_PRISON
    },
    {
        "titre": "Chance 10",
        "description": "Reculez de trois cases.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "relatif",
        "index_case": 0,
        "nombreDePas": -3,
        "bonusPassage": 0
    },
    {
        "titre": "Chance 11",
        "description": "Aller en prison. Rendez-vous directement à la prison. Ne passez pas par la case départ, ne touchez pas 200 M.",
        "type": TypesEffets.ALLER_EN_PRISON,
        "type_deplacement": "absolu",
        "index_case": 10,
        "nombreDePas": 0,
        "bonusPassage": 0
    },
    {
        "titre": "Chance 12",
        "description": "Vous faites des réparations. Versez pour chaque maison 25 M et pour chaque hôtel 100 M",
        "type": TypesEffets.REPARATIONS,
        "montant_par_maison": 25,
        "montant_par_hotel": 100,
        "source": "joueur",
        "destinataire": "banque"
    },
    {
        "titre": "Chance 13",
        "description": "Amende pour excès de vitesse : payez 15 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 15,
        "source": "joueur",
        "destinataire": "banque"
    },
    {
        "titre": "Chance 14",
        "description": "Payez pour frais de scolarité : 150 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 150,
        "source": "joueur",
        "destinataire": "banque"
    },
    {
        "titre": "Chance 15",
        "description": "Amende pour ivresse: 20 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 20,
        "source": "joueur",
        "destinataire": "banque"
    },
    {
        "titre": "Chance 16",
        "description": "Votre immeuble et votre prêt rapportent : touchez 150 M.",
        "type": TypesEffets.VERSEMENT,  
        "montant": 150,
        "source": "banque",
        "destinataire": "joueur"
    }
]

export default effetsChanceJson; 