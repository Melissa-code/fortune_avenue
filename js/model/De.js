class De {
    constructor() {
        this.nombreDes = 1;
        this.valeurAffichee = 2; 
    }

    /**
     * return chiffre entre 2-12 (0-10 +2)
     */
    lancer() {
        //this.valeurAffichee = 10; //pour tests
        this.valeurAffichee = Math.floor(Math.random() * 11) + 2;
        console.log("valeur du dé: ", this.valeurAffichee); 

        return this.valeurAffichee;
    }
}

export default De; 