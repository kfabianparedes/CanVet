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
    var USU_ID = this.storageService.getString('USE_ID');
    const url = environment.domain_url + '/api/ventas/gananciasDiarias?USU_ID='+ USU_ID;
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

  recuperarCaja():Observable<any>{
    var USU_ID = this.storageService.getString('USE_ID');
    const url = environment.domain_url + '/api/cajas/recuperarCaja?USU_ID='+ USU_ID;
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

    cerrarCaja(caja:Caja):Observable<any>{
      const url = environment.domain_url + '/api/cajas/cerrarCaja.php';
      const datos = {
        CAJA_CIERRE: "",
        CAJA_MONTO_FINAL:caja.CAJA_MONTO_FINAL,
        CAJA_DESCUENTO_GASTOS:caja.CAJA_DESCUENTO_GASTOS,
        CAJA_MONTO_EFECTIVO_VENTAS:caja.CAJA_MONTO_EFECTIVO_VENTAS,
        CAJA_MONTO_TARJETA_VENTAS:caja.CAJA_MONTO_TARJETA_VENTAS,
        CAJA_MONTO_YAPE_VENTAS:caja.CAJA_MONTO_YAPE_VENTAS,
        CAJA_MONTO_EFECTIVO_SERVICIOS:caja.CAJA_MONTO_EFECTIVO_SERVICIOS,
        CAJA_MONTO_TARJETA_SERVICIOS:caja.CAJA_MONTO_TARJETA_SERVICIOS,
        CAJA_MONTO_YAPE_SERVICIOS:caja.CAJA_MONTO_YAPE_SERVICIOS,
        CAJA_CODIGO:caja.CAJA_CODIGO,
        CAJA_MONTO_INICIAL: caja.CAJA_MONTO_INICIAL,
        CAJA_DESCRIPCION: caja.CAJA_DESCRIPCION
      }
      return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
    }

    public listarDetallesCaja(fecha: string) : Observable<any>{
      const url = environment.domain_url + '/api/cajas/reporteCajaPorFecha.php?CAJA_APERTURA='+fecha;
      return this.http.get<any>(url,this.httpHead).pipe(retry(2));
    }
}
