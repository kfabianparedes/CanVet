import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  ADM = 'dmMLAeOtrn'; //valor para Administrador
  EMP = 'me2Ia1NMer'; // valor para Empleado
  FAKE = 'IiiENOTaaa';// valor envíado por si modifican el localstorage
  constructor(private http: HttpClient, private storageService: StorageService) { }
  
  httpHead ={
    headers : new HttpHeaders({
      'Authorization': 'Basic ' + this.storageService.getString('USE_SUB'), // Se le agrega el valor de USE_SUB a la cabecera Authorization
      'User': this.storageService.getString('USE_TYPE')=='2'?this.ADM:this.storageService.getString('USE_TYPE')=='1'?this.EMP:this.FAKE
      //Se le agrega la cabecera : User , según el tipo de usuario se le asigna un tipo de valor. ADM , EMP o FAKE si modifican el localstorage
    })
  };

  registrarCompra(GUIA_REMISION: any, COMPRA: any , DETALLES:any, enviarGuia:boolean):Observable<any>{
    const url = environment.domain_url + '/api/compras/registrar.php';
    let datos;
    if(enviarGuia){
      datos = {
        GUIA_DE_REMISION : {
          GUIA_NRO_SERIE: GUIA_REMISION.GUIA_NRO_SERIE,
          GUIA_NRO_COMPROBANTE: GUIA_REMISION.GUIA_NRO_COMPROBANTE,
          GUIA_FECHA_EMISION: GUIA_REMISION.GUIA_FECHA_EMISION,
          GUIA_FLETE: GUIA_REMISION.GUIA_FLETE*100
        },
        COMPRA:{
          COMPRA_FECHA_EMISION_COMPROBANTE:COMPRA.COMPRA_FECHA_EMISION_COMPROBANTE,
          COMPRA_FECHA_REGISTRO:COMPRA.COMPRA_FECHA_REGISTRO,
          COMPRA_NRO_SERIE:COMPRA.COMPRA_NRO_SERIE,
          COMPRA_NRO_COMPROBANTE:COMPRA.COMPRA_NRO_COMPROBANTE,
          COMPRA_SUBTOTAL:COMPRA.COMPRA_SUBTOTAL*100,
          COMPRA_TOTAL:COMPRA.COMPRA_TOTAL*100,
          COMPRA_DESCRIPCION:COMPRA.COMPRA_DESCRIPCION,
          USU_ID:COMPRA.USU_ID,
          COMPROBANTE_ID:COMPRA.COMPROBANTE_ID,
          PROV_ID: COMPRA.PROV_ID
        },
        DETALLES_DE_COMPRA: DETALLES
      }
    }else if(!enviarGuia){
      datos = {
        COMPRA:{
          COMPRA_FECHA_EMISION_COMPROBANTE:COMPRA.COMPRA_FECHA_EMISION_COMPROBANTE,
          COMPRA_FECHA_REGISTRO:COMPRA.COMPRA_FECHA_REGISTRO,
          COMPRA_NRO_SERIE:COMPRA.COMPRA_NRO_SERIE,
          COMPRA_NRO_COMPROBANTE:COMPRA.COMPRA_NRO_COMPROBANTE,
          COMPRA_SUBTOTAL:COMPRA.COMPRA_SUBTOTAL*100,
          COMPRA_TOTAL:COMPRA.COMPRA_TOTAL*100,
          COMPRA_DESCRIPCION:COMPRA.COMPRA_DESCRIPCION,
          USU_ID:COMPRA.USU_ID,
          COMPROBANTE_ID:COMPRA.COMPROBANTE_ID,
          PROV_ID: COMPRA.PROV_ID
        },
        DETALLES_DE_COMPRA: DETALLES
      }
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }
}
