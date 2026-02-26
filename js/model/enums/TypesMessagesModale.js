const TypesMessagesModale = Object.freeze({
    // arraow fn returns an object with title and message to display in the modal based on details provided
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
        message:  `${details.joueur} doit payer une taxe d'un montant de ${details.montant} M.`
    }), 
    carte_chance : (details) => ({
        titre: "Carte Chance",
        message: `${details.joueur} a tiré une carte Chance : ${details.description}.`  
    }),
    carte_fonds_communs : (details) => ({
        titre: "Carte Fonds Communs",
        message: `${details.joueur} a tiré une carte Fonds Communs : ${details.description}.`   
    }),
})

export default TypesMessagesModale;