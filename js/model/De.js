class De {
    constructor() {
        this.nombreDes = 1;
        this.valeurAffichee = 1; 
    }

    /**
     * return chiffre entre 1 et 6
     */
    lancer() {
        // entre 2-12 pas 0
        this.valeurAffichee = Math.floor(Math.random() * 11) +2;
        // console.log("Résultat du dé après le lancé : " + this.valeurAffichee);
        
        return this.valeurAffichee;
    }

    // getTotal() {
    //     let total = 0;
    //     for (let i = 0; i < this.nombreDes; i++ ) {
    //         total += this.valeursAffichees[i];
    //     }

    //     console.log(total)
    //     return total;
    // }

    // verifierSiDouble() {
    //     if (this.nombreDes === 2) {
    //         return this.valeurs[0] === this.valeurs[1];//true
    //     }

    //     return false;
    // }

}

export default De; 