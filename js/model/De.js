class De {
    constructor() {
        this.nombreDes = 1;
        this.valeurAffichee = 1; 
    }

    /**
     * return chiffre entre 2-12 (0-10 +2)
     */
    lancer() {
        // this.valeurAffichee = 12; //pour tests
        this.valeurAffichee = Math.floor(Math.random() * 11) + 2;
        return this.valeurAffichee;
    }
}

export default De; 