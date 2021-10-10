export class Producto {
    PRO_ID: number;
    PRO_NOMBRE: string;
    PRO_CODIGO: string;
    PRO_PRECIO_VENTA: number;
    PRO_PRECIO_COMPRA: number;
    PRO_STOCK: number;
    PRO_TAMANIO_TALLA: string;
    PRO_PRECIO_ANTERIOR: number;
    PRO_FECHA_CAMBIO_PRECIO: Date;
    PROV_ID: number;
    CAT_ID: number;
    PRO_ESTADO: number;
    CAT_NOMBRE: string;
    PROV_EMPRESA_PROVEEDORA: string;
    PRO_CANTIDAD:number = 0;
    PRO_IMPORTE: number = 0;

}