import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { DatosJuridicos } from '../models/datos-juridicos';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
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

  registrarCliente(cliente:Cliente,datosJuridicos?:DatosJuridicos):Observable<any>{
    const url = environment.domain_url + '/api/clientes/registrar.php';
    let datos;
    if(datosJuridicos == null){
      datos = {
        DATOS_JURIDICOS:{
        },
        CLIENTE:{
          CLIENTE_NOMBRES: cliente.CLIENTE_NOMBRES,
          CLIENTE_TELEFONO: cliente.CLIENTE_TELEFONO,
          CLIENTE_DNI: cliente.CLIENTE_DNI,
          CLIENTE_DIRECCION: cliente.CLIENTE_DIRECCION,
          CLIENTE_APELLIDOS: cliente.CLIENTE_APELLIDOS
        }
      }
    }else{
      datos = {
        DATOS_JURIDICOS:{
          DJ_RUC:datosJuridicos.DJ_RUC,
          DJ_RAZON_SOCIAL : datosJuridicos.DJ_RAZON_SOCIAL,
          TIPO_EMPRESA_ID: datosJuridicos.TIPO_EMPRESA_ID
        },
        CLIENTE:{
          CLIENTE_NOMBRES: cliente.CLIENTE_NOMBRES,
          CLIENTE_TELEFONO: cliente.CLIENTE_TELEFONO,
          CLIENTE_DNI: '',
          CLIENTE_DIRECCION: cliente.CLIENTE_DIRECCION,
          CLIENTE_APELLIDOS: ''
        }
      }
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }
  
  actualizarCliente(cliente:Cliente,datosJuridicos?:DatosJuridicos):Observable<any>{
    const url = environment.domain_url + '/api/clientes/editar.php';
    let datos;
    if(datosJuridicos == null){
      datos = {
        DATOS_JURIDICOS:{
        },
        CLIENTE:{
            CLIENTE_ID: cliente.CLIENTE_ID,
            CLIENTE_NOMBRES: cliente.CLIENTE_NOMBRES,
            CLIENTE_TELEFONO: cliente.CLIENTE_TELEFONO,
            CLIENTE_DNI: cliente.CLIENTE_DNI,
            CLIENTE_DIRECCION: cliente.CLIENTE_DIRECCION,
            CLIENTE_APELLIDOS: cliente.CLIENTE_APELLIDOS
        }
      }
    }else{
      datos = {
        DATOS_JURIDICOS:{
          DJ_RUC:datosJuridicos.DJ_RUC,
          DJ_RAZON_SOCIAL : datosJuridicos.DJ_RAZON_SOCIAL,
          TIPO_EMPRESA_ID: datosJuridicos.TIPO_EMPRESA_ID
        },
        CLIENTE:{
          CLIENTE_ID: cliente.CLIENTE_ID,
          CLIENTE_NOMBRES: cliente.CLIENTE_NOMBRES,
          CLIENTE_TELEFONO: cliente.CLIENTE_TELEFONO,
          CLIENTE_DNI: '',
          CLIENTE_DIRECCION: cliente.CLIENTE_DIRECCION,
          CLIENTE_APELLIDOS: ''
        }
      }
    }
    console.log(datos);
    return this.http.put<any>(url,datos,this.httpHead).pipe(retry(2));
  }

  listarClientes():Observable<any>{
    const url = environment.domain_url + '/api/clientes/listar.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
}
