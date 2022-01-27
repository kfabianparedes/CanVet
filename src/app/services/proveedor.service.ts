import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Proveedor} from '../layout/proveedor/proveedor.models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

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

  listarProveedores():Observable<any>{
      const url = environment.domain_url + '/api/proveedores/listar.php';
      return this.http.get<any>(url,this.httpHead).pipe( retry(2) );
  }
  listarProveedoresActivos():Observable<any>{
    const url = environment.domain_url + '/api/proveedores/listarProveedoresActivos.php';
    return this.http.get<any>(url,this.httpHead).pipe( retry(2) );
  }

  habilitarInhabilitarProveedor(proveEdoRId:number,numeroEstado:number):Observable<any>{
    const url = environment.domain_url + '/api/proveedores/habilitarInhabilitarProveedor.php';
    const datos = {
      PROV_ID: proveEdoRId,
      PROV_ESTADO: numeroEstado
    }
    return this.http.put<any>(url,datos).pipe( retry(2) );
  }

  insertarProveedor(pro:Proveedor):Observable<any>{
    const url = environment.domain_url + '/api/proveedores/insertar.php';
    const datos = {
      PROV_RUC: pro.PROV_RUC,
      PROV_EMPRESA_PROVEEDORA: pro.PROV_EMPRESA_PROVEEDORA,
      PROV_NUMERO_CONTACTO: pro.PROV_NUMERO_CONTACTO,
    }
    return this.http.post<any>(url,datos).pipe( retry(2) );
  }

  actualizarProveedor(pro:Proveedor):Observable<any>{
    const url = environment.domain_url + '/api/proveedores/editar.php';
    const datos = {
      PROV_ID : pro.PROV_ID,
      PROV_RUC: pro.PROV_RUC,
      PROV_EMPRESA_PROVEEDORA: pro.PROV_EMPRESA_PROVEEDORA,
      PROV_NUMERO_CONTACTO: pro.PROV_NUMERO_CONTACTO,
    }
    return this.http.post<any>(url,datos).pipe( retry(2) );
  }

}
