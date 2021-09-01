import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Proveedor} from '../layout/proveedor/proveedor.models';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

    constructor(private http: HttpClient) { 
        
    }

    listarProveedores(){
        const url = environment.domain_url + '/api/proveedores/listar';
        return this.http.get<any>(url).pipe( retry(2) );
    }

    insertarProveedor(pro:Proveedor){

        const url = environment.domain_url + '/api/proveedores/insertar';

        const datos = {
            PROV_RUC: pro.PROV_RUC,
            PROV_EMPRESA_PROVEEDORA: pro.PROV_EMPRESA_PROVEEDORA,
            PROV_NUMERO_CONTACTO: pro.PROV_NUMERO_CONTACTO,
        }
        return this.http.post<any>(url,pro).pipe( retry(2) );
    }

}
