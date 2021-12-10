export class Compra {
    COMPRA_ID: number;
    COMPRA_FECHA_EMISION_COMPROBANTE: string;
    COMPRA_FECHA_REGISTRO:string;
    COMPRA_NRO_SERIE:string;
    COMPRA_NRO_COMPROBANTE:string;
    COMPRA_SUBTOTAL:number;
    COMPRA_TOTAL:number;
    COMPRA_DESCRIPCION:string;
    USU_ID: number;
    COMPROBANTE_ID: number;
    COMPRA_ESTADO: number;
    PROV_ID: number;
    GUIA_ID: number;
    COMPROBANTE_TIPO?: string;
    PROV_EMPRESA_PROVEEDORA?: string;
    USU_NOMBRE_COMPLETO?: string;
}
