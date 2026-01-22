class De {
    constructor(nombreDes = 1) {
        this.nombreDes = nombreDes;
        this.valeursAffichees = []; 
    }

    /**
     * return pour chaque dé un chiffre entre 1 et 6
     */
    lancer() {
        for (let i = 0; i < this.nombreDes; i++ ) {
            this.valeursAffichees[i] = Math.floor(Math.random() * 6) +1;
        }
    }

    getTotal() {
        let total = 0;
        for (let i = 0; i < this.nombreDes; i++ ) {
            total += this.valeursAffichees[i];
        }

        console.log(total)
        return total;
    }

    verifierSiDouble() {
        if (this.nombreDes === 2) {
            return this.valeurs[0] === this.valeurs[1];//true
        }

        return false;
    }

}

export default De; 