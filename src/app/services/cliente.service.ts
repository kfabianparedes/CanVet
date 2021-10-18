import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
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

  registrarCliente(cliente:Cliente,tipo:number):Observable<any>{
    const url = environment.domain_url + '/api/clientes/registrar.php';
    const datos = {
      
    }
    return this.http.post<any>(url,datos,this.httpHead).pipe(retry(2));
  }

  listarClientes():Observable<any>{
    const url = environment.domain_url + '/api/clientes/listar.php';
    return this.http.get<any>(url,this.httpHead).pipe(retry(2));
  }
}
