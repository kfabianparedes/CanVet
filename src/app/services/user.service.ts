import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  header  = {
    headers: new HttpHeaders({'Accept': 'application/json'})
  };

  httpOptions  = {
    headers: new HttpHeaders({'Authorization': 'Basic ' + this.storageService.getString('USE_SUB')}) // 9$$10710$2y$10$VZMRl4RVjOS2Qi/ttl/U9uq0D4MIqj/Z5Te6MZKPX.2305DwSYGSG5114
  };
  constructor(private http: HttpClient, private storageService: StorageService) { }


  crearrUsuario(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/insertar';
    const datos = {
      
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_DNI : usuario.USU_DNI,
      USU_CELULAR : usuario.USU_CELULAR,
      USU_DIRECCION : usuario.USU_DIRECCION,
      USU_EMAIL : usuario.USU_EMAIL,
      USU_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      ROL_ID :usuario.ROL_ID 
    }
    return this.http.post<any>(url,datos).pipe(retry(2));
  }
}
