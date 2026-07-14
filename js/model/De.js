class De {
    constructor() {
        this.valeurAffichee = 2; 
    }

    /**
     * 1 seul dé : return chiffre entre 2-12 (0-10 +2)
     */
    lancer() {
        this.valeurAffichee = Math.floor(Math.random() * 11) + 2;
        return this.valeurAffichee;
    }
}

export default De; 