import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venta } from '../models/venta';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

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

  reporteAnual(){
    const url = environment.domain_url + '/api/ventas/gananciaAnual.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
  reporteSemanal(){
    const url = environment.domain_url + '/api/ventas/gananciaSemanal.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
  reporteMensual(){
    const url = environment.domain_url + '/api/ventas/gananciasMensuales.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

  reporteCaja(){
    const url = environment.domain_url + '/api/cajas/reporte.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

  reporteVentas(){
    const url = environment.domain_url + '/api/ventas/reportesFacturasBoletas.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }

}
