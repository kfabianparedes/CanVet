import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
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
  // Key & Value de la cabecera : 'user'
  ADM = 'dmMLAeOtrn'; //valor para Administrador
  EMP = 'me2Ia1NMer'; // valor para Empleado
  FAKE = 'IiiENOTaaa';// valor envíado por si modifican el localstorage

  constructor(private http: HttpClient, private storageService: StorageService) { }
  //Admin USU_TYPE = 2 
  //Empleado USE_TYPE = 1
  updateHeaders() {
    this.httpHead  = {
      headers : new HttpHeaders({
        'Authorization': 'Basic ' + this.storageService.getString('USE_SUB'), // Se le agrega el valor de USE_SUB a la cabecera Authorization
        'User': this.storageService.getString('USE_TYPE')=='2'?this.ADM:this.storageService.getString('USE_TYPE')=='1'?this.EMP:this.FAKE
        //Se le agrega la cabecera : User , según el tipo de usuario se le asigna un tipo de valor. ADM , EMP o FAKE si modifican el localstorage
      })
    };
  }
  httpHead ={
    headers : new HttpHeaders({
      'Authorization': 'Basic ' + this.storageService.getString('USE_SUB'), // Se le agrega el valor de USE_SUB a la cabecera Authorization
      'User': this.storageService.getString('USE_TYPE')=='2'?this.ADM:this.storageService.getString('USE_TYPE')=='1'?this.EMP:this.FAKE
      //Se le agrega la cabecera : User , según el tipo de usuario se le asigna un tipo de valor. ADM , EMP o FAKE si modifican el localstorage
    })
  };
  

  registerUser(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/insertar.php';
    const datos = {
      
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_DNI : usuario.USU_DNI,
      USU_CELULAR : usuario.USU_CELULAR,
      USU_FECHA_NACIMIENTO: usuario.USU_FECHA_NACIMIENTO,
      USU_DIRECCION : usuario.USU_DIRECCION,
      USU_EMAIL : usuario.USU_EMAIL,
      USU_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      ROL_ID :usuario.ROL_ID 
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(1));
  }

  listUsers():Observable<any>{
    const url = environment.domain_url + '/api/usuarios/listarUsuarios.php';
    return this.http.get<any>(url).pipe(retry(2));
  }

  getUserById(userId : number):Observable<any>{
    const url = environment.domain_url + `/api/usuarios/obtenerUsuario.php?USU_ID=${userId}`;
    return this.http.get<any>(url).pipe(retry(2));
  }

  updateUser(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/actualizar.php';
    const datos = {
      USU_ID: usuario.USU_ID,
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_DNI : usuario.USU_DNI,
      USU_CELULAR : usuario.USU_CELULAR,
      USU_FECHA_NACIMIENTO: usuario.USU_FECHA_NACIMIENTO,
      USU_DIRECCION : usuario.USU_DIRECCION,
      USU_EMAIL : usuario.USU_EMAIL,
      USU_ESTADO : usuario.USU_ESTADO, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      ROL_ID :usuario.ROL_ID 
    }
    return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
  }

  habilitarInhabilitarUsuarios(USU_ID:number,numeroEstado:number):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/habilitarInhabilitarUsuario.php';
    const datos = {
      USU_ID: USU_ID,
      USU_ESTADO: numeroEstado
    }
    return this.http.put<any>(url,datos,this.httpHead).pipe( retry(2) );
  }

  updateProfile(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/actualizarPerfil.php';
    const datos = {
      USU_ID: usuario.USU_ID,
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_EMAIL : usuario.USU_EMAIL
    }
    return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
  }
}
