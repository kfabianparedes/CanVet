export class Categoria {
    
    CAT_ID?: number  ;
    CAT_NOMBRE?: string ; 
    CAT_ESTADO?: number ;
    
    constructor(CAT_ID?: number, CAT_NOMBRE?: string, CAT_ESTADO?: number) {
        if(CAT_ID)this.CAT_ID = CAT_ID;
        if(CAT_NOMBRE)this.CAT_NOMBRE = CAT_NOMBRE;
        if(CAT_ESTADO)this.CAT_ESTADO = CAT_ESTADO;
    }
}