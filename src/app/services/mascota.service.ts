import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Mascota } from '../models/mascota';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
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

  registrarMascota(mascota:Mascota):Observable<any>{
    const url = environment.domain_url + '/api/mascotas/registrar.php';
    const datos = {
      CLIENTE_ID: mascota.CLIENTE_ID,
      MAS_NOMBRE: mascota.MAS_NOMBRE,
      MAS_ATENCIONES: mascota.MAS_ATENCIONES,
      MAS_RAZA: mascota.MAS_RAZA,
      MAS_ESPECIE: mascota.MAS_ESPECIE,
      MAS_COLOR: mascota.MAS_COLOR,
      MAS_ESTADO: mascota.MAS_ESTADO,
      MAS_TAMANIO: mascota.MAS_TAMANIO,
      MAS_GENERO: mascota.MAS_GENERO
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }
  actualizarMascota(mascota:any):Observable<any>{
    const url = environment.domain_url + '/api/mascotas/editar.php';
    const datos = {
      CLIENTE_ID: mascota.CLIENTE_ID,
      MAS_ID: mascota.MAS_ID,
      MAS_NOMBRE: mascota.MAS_NOMBRE,
      MAS_ATENCIONES: mascota.MAS_ATENCIONES,
      MAS_RAZA: mascota.MAS_RAZA,
      MAS_ESPECIE: mascota.MAS_ESPECIE,
      MAS_COLOR: mascota.MAS_COLOR,
      MAS_ESTADO: mascota.MAS_ESTADO,
      MAS_TAMANIO: mascota.MAS_TAMANIO,
      MAS_GENERO: mascota.MAS_GENERO
    }
    return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
  }
  cambiarEstadoMascota(id:number,estado:number):Observable<any>{
    const url = environment.domain_url + '/api/mascotas/cambiarEstadoMascota.php';
    if(estado == 0){
      estado = 1;
    }
    else if(estado == 1){
      estado = 0;
    }

    const datos = {
      MAS_ID: id,
      MAS_ESTADO: estado
    }
    return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
  }
  
  listarMascotas():Observable<any>{
    const url = environment.domain_url + '/api/mascotas/listar.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
  listarMascotasActivas():Observable<any>{
    const url = environment.domain_url + '/api/mascotas/listarActivos.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
}
