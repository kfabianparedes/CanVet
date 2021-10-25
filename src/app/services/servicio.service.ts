import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

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

  registrarServicio(servicio:Servicio):Observable<any>{
    const url = environment.domain_url + '/api/servicios/registrar.php';
    const datos = {
      SERVICIO_PRECIO: servicio.SERVICIO_PRECIO,
      TIPO_SERVICIO_ID: servicio.TIPO_SERVICIO_ID,
      SERVICIO_TIPO:servicio.SERVICIO_TIPO,
      SERVICIO_FECHA_HORA: servicio.SERVICIO_FECHA_HORA,
      HORA_SERVICIO: servicio.HORA_SERVICIO,
      MASCOTA_ID: servicio.MASCOTA_ID
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }

  listarServiciosPendientes():Observable<any>{
    const url = environment.domain_url + '/api/servicios/listar.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
}
