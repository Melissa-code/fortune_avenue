import TypesEffets from "../js/model/enums/TypesEffets.js";

const effetsFondsCommunsJson = [
    {
        "titre": "Fonds communs 1",
        "description": "Placez-vous sur la case départ.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 0,
        "nombreDePas": 0,
        "bonusPassage": 0
    }, 
    {
        "titre": "Fonds communs 2",
        "description": "Erreur de la banque en votre faveur. Recevez 200 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 200,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 3",
        "description": "Payez la note du médecin 50 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 50,
        "source": "joueur",
        "destinataire": "banque"
    }, 
    {
        "titre": "Fonds communs 4",
        "description": "La vente de votre stock vous rapporte 50 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 50,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 5",
        "description": "Vous êtes libéré de prison. Cette carte peut être conservée jusqu’à ce qu’elle soit utilisée ou vendue.",
        "type": TypesEffets.SORTIR_DE_PRISON
    }, 
    {
        "titre": "Fonds communs 6",
        "description": "Aller en prison. Rendez-vous directement à la prison. Ne franchissez pas la case départ, ne touchez pas 200 M.",
        "type": TypesEffets.ALLER_EN_PRISON,
        "type_deplacement": "absolu",
        "index_case": 10,
        "nombreDePas": 0,
        "bonusPassage": 0
    }, 
    {
        "titre": "Fonds communs 7",
        "description": "Retournez à Belleville.",
        "type": TypesEffets.DEPLACEMENT,
        "type_deplacement": "absolu",
        "index_case": 1,
        "nombreDePas": 0,
        "bonusPassage": 0
    }, 
    {
        "titre": "Fonds communs 8",
        "description": "Recevez votre revenu annuel 100 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 100,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 9",
        "description": "C’est votre anniversaire. Chaque joueur doit vous donner 100 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 100,
        "source": "banque",
        "destinataire": "joueurs"
    }, 
    {
        "titre": "Fonds communs 10",
        "description": "Les contributions vous remboursent la somme de 200 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 200,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 11",
        "description": "Recevez votre intérêt sur l’emprunt à 7% 25 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 25,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 12",
        "description": "Payez votre Police d’Assurance 50 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 50,
        "source": "joueur",
        "destinataire": "banque"
    }, 
    {
        "titre": "Fonds communs 13",
        "description": "Payez une amende de 10 M ou bien tirez une carte « CHANCE ».",
        "type": TypesEffets.CHOIX,
        "montant": 10,
        "source": "joueur",
        "destinataire": "banque"
    }, 
    {
        "titre": "Fonds communs 14",
        "description": "Rendez-vous à la gare la plus proche. Si vous passez par la case départ, recevez 200 M.",
        "type": TypesEffets.GARE_PROCHE_EFFET,
        "type_deplacement": "relatif",
        "index_case": null,
        "nombreDePas": 0,
        "bonusPassage": 0
    }, 
    {
        "titre": "Fonds communs 15",
        "description": "Vous avez gagné le deuxième Prix de Beauté. Recevez 100 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 100,
        "source": "banque",
        "destinataire": "joueur"
    }, 
    {
        "titre": "Fonds communs 16",
        "description": "Vous héritez 100 M.",
        "type": TypesEffets.VERSEMENT,
        "montant": 100,
        "source": "banque",
        "destinataire": "joueur"
    } 
]

export default effetsFondsCommunsJson; 