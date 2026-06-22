const TypesMessagesModale = Object.freeze({
    // arrow function returns an object with title and message to display in the modal based on details provided
    achat : (details) => ({
        titre: "Achat réussi",
        message: `${details.joueur} vient d'acheter "${details.propriete}" pour un montant de ${details.montant} M.`
    }),
    refus : (details) => ({
        titre: "Achat refusé",  
        message: `${details.joueur} a décliné la proposition d'achat de "${details.propriete}".`
    }),
    loyer : (details) => ({
        titre: "Loyer à payer",
        message: `${details.joueur} vient de payer la somme de ${details.montant} M correspondant au loyer de "${details.propriete}" à ${details.proprietaire}.`
    }),
    taxe : (details) => ({
        titre: "Taxe à payer",
        message: `${details.joueur} doit payer une taxe d'un montant de ${details.montant} M.`
    }), 
    carte_chance : (details) => ({
        titre: "Carte Chance",
        message: `${details.joueur} a tiré une carte Chance : ${details.description}.`  
    }),
    carte_fonds_communs : (details) => ({
        titre: "Carte Fonds Communs",
        message: `${details.joueur} a tiré une carte Fonds Communs : ${details.description}.`   
    }),
    depart : (details) => ({
        titre: "Passage par la case Départ",
        message: `${details.joueur} passe par la case Départ et reçoit 200 M. `
    }),
    parc_gratuit : (details) => ({
        titre: "Repos au Parc Gratuit",
        message: `${details.joueur} se repose au Parc Gratuit.`
    }),
    prison : (details) => ({
        titre: "Simple visite en prison",
        message: `${details.joueur} rend visite à la prison.`
    }),
    aller_en_prison: (details) => ({
        titre: "Allez en Prison !",
        message: `${details.joueur} est envoyé en prison. Ne passez pas par la case Départ !`
    }),
})

export default TypesMessagesModale;