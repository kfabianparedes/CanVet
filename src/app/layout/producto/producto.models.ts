export class Producto {
    
    PRO_ID?:number; 
    PRO_NOMBRE?:string;
    PRO_CODIGO?:string; 
    PRO_PRECIO_VENTA?:number; 
    PRO_PRECIO_COMPRA?:number; 
    PRO_STOCK?:number; 
    PRO_TAMANIO_TALLA?:string; 
    CAT_ID?:number; 
    
    constructor(PRO_ID?:number,PRO_NOMBRE?:string,PRO_CODIGO?:string, PRO_PRECIO_VENTA?:number,PRO_PRECIO_COMPRA?:number
        ,PRO_STOCK?:number,PRO_TAMANIO_TALLA?:string,CAT_ID?:number) {
        
        if(PRO_ID)this.PRO_ID= PRO_ID;
        if(PRO_NOMBRE)this.PRO_NOMBRE= PRO_NOMBRE;
        if(PRO_CODIGO)this.PRO_CODIGO= PRO_CODIGO;
        if(PRO_PRECIO_VENTA)this.PRO_PRECIO_VENTA= PRO_PRECIO_VENTA;
        if(PRO_PRECIO_COMPRA)this.PRO_PRECIO_COMPRA= PRO_PRECIO_COMPRA;
        if(PRO_STOCK)this.PRO_ID= PRO_STOCK;
        if(PRO_TAMANIO_TALLA)this.PRO_TAMANIO_TALLA= PRO_TAMANIO_TALLA; 
        if(CAT_ID)this.CAT_ID = CAT_ID;
    }
}