import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
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

  registrarVenta(VENTA: any, DETALLES:any):Observable<any>{
    const url = environment.domain_url + '/api/ventas/registrar.php';
    var CAJA_CODIGO ; 
    if(this.storageService.hasKey('OPEN_CODE')){
      CAJA_CODIGO = this.storageService.getString('OPEN_CODE');
    }else{
      CAJA_CODIGO = "";
    }

    const datos = {
        VENTA:{
          USU_ID: VENTA.USU_ID ,
          COMPROBANTE_ID: VENTA.COMPROBANTE_ID,
          VENTA_FECHA_EMISION_COMPROBANTE: VENTA.VENTA_FECHA_EMISION_COMPROBANTE,
          VENTA_FECHA_REGISTRO: VENTA.VENTA_FECHA_REGISTRO,
          VENTA_NRO_SERIE: VENTA.VENTA_NRO_SERIE,
          VENTA_NRO_COMPROBANTE: VENTA.VENTA_NRO_COMPROBANTE,
          VENTA_SUBTOTAL: VENTA.VENTA_SUBTOTAL*100,
          VENTA_TOTAL: VENTA.VENTA_TOTAL*100,
          METODO_DE_PAGO_ID: VENTA.METODO_DE_PAGO_ID,
          CLIENTE_ID: VENTA.CLIENTE_ID,
          CAJA_CODIGO:CAJA_CODIGO
        },
        DETALLE_DE_VENTA:DETALLES
    }
    console.log(datos);
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }
}
