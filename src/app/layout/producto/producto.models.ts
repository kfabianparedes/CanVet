export class Producto {
    
    PRO_ID?:number; 
    PRO_NOMBRE?:string;
    PRO_CODIGO?:string; 
    PRO_PRECIO_VENTA?:number; 
    PRO_PRECIO_COMPRA?:number; 
    PRO_STOCK?:number; 
    PRO_TAMANIO_TALLA?:string; 
    CAT_ID?:number; 
    PROV_ID?:number;
    PRO_ESTADO?:number; 
    PRO_PRECIO_ANTERIOR?:number;
    PRO_FECHA_CAMBIO_PRECIO?:Date;

    constructor(PRO_ID?:number,PRO_NOMBRE?:string,PRO_CODIGO?:string, PRO_PRECIO_VENTA?:number,PRO_PRECIO_COMPRA?:number
        ,PRO_STOCK?:number,PRO_TAMANIO_TALLA?:string,CAT_ID?:number,PROV_ID?:number,PRO_ESTADO?:number,PRO_PRECIO_ANTERIOR?:number
        ,PRO_FECHA_CAMBIO_PRECIO?:Date) {
        
        if(PRO_ID)this.PRO_ID= PRO_ID;
        if(PRO_NOMBRE)this.PRO_NOMBRE= PRO_NOMBRE;
        if(PRO_CODIGO)this.PRO_CODIGO= PRO_CODIGO;
        if(PRO_PRECIO_VENTA)this.PRO_PRECIO_VENTA= PRO_PRECIO_VENTA;
        if(PRO_PRECIO_COMPRA)this.PRO_PRECIO_COMPRA= PRO_PRECIO_COMPRA;
        if(PRO_STOCK)this.PRO_ID= PRO_STOCK;
        if(PRO_TAMANIO_TALLA)this.PRO_TAMANIO_TALLA= PRO_TAMANIO_TALLA; 
        if(CAT_ID)this.CAT_ID = CAT_ID;
        if(PROV_ID)this.PROV_ID = PROV_ID;
        if(PRO_ESTADO)this.PRO_ESTADO = PRO_ESTADO;
        if(PRO_PRECIO_ANTERIOR)this.PRO_PRECIO_ANTERIOR = PRO_PRECIO_ANTERIOR;
        if(PRO_FECHA_CAMBIO_PRECIO)this.PRO_FECHA_CAMBIO_PRECIO = PRO_FECHA_CAMBIO_PRECIO;
    }
}