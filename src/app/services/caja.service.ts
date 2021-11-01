import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Caja } from '../models/caja';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
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

  abrirCaja(caja:Caja):Observable<any>{
    const url = environment.domain_url + '/api/cajas/registrarApertura.php';
    const datos = {
      CAJA_APERTURA: caja.CAJA_APERTURA,
      CAJA_MONTO_INICIAL: caja.CAJA_MONTO_INICIAL,
      USU_ID: caja.USU_ID
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }

  listarMontoDiario():Observable<any>{
    const url = environment.domain_url + '/api/ventas/gananciasDiarias.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

    // cerrarCaja(caja:Caja):Observable<any>{
    //   const url = environment.domain_url + '/api/cajas/cerrarCaja.php';
    //   const datos = {
    //     CAJA_CIERRE:,
    //     CAJA_MONTO_FINAL:3,
    //     CAJA_DESCUENTO_GASTOS:1,
    //     CAJA_MONTO_EFECTIVO_VENTAS:3,
    //     CAJA_MONTO_TARJETA_VENTAS:1,
    //     CAJA_MONTO_YAPE_VENTAS:0,
    //     CAJA_MONTO_EFECTIVO_SERVICIOS:0,
    //     CAJA_MONTO_TARJETA_SERVICIOS:0,
    //     CAJA_MONTO_YAPE_SERVICIOS:0,
    //     CAJA_CODIGO:$2y$10$226v52T4UVmTJxktCV5oHOxHLUL/JXwiOStXc8Mehmez4w0h2qCfG
    //   }
    //   return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
    // }

}
