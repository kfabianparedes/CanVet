import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import {Producto} from '../layout/producto/producto.models';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

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
  listarProductos():Observable<any>{
    const url = environment.domain_url + '/api/productos/listarProductos';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  listarProductosActivos():Observable<any>{
    const url = environment.domain_url + '/api/productos/listarProductosActivos.php';
    return this.http.get<any>(url,this.httpHead).pipe( retry(2) );
  }

  listarProductosPorProveedor(idProveedor:number):Observable<any>{
    const url = environment.domain_url + '/api/productos/listarProductosPorProveedor?PROV_ID='+idProveedor;
    return this.http.get<any>(url).pipe( retry(2) );
  }
  habilitarDeshabilitarProducto(producto_id:number, nuevoEstado:number):Observable<any>{
    const url = environment.domain_url + '/api/productos/habilitarInhabilitarProducto';

    const datos = {
      PRO_ID: producto_id,
      PRO_ESTADO: nuevoEstado
    }
    return this.http.put<any>(url,datos).pipe( retry(2) );
  }


  insertarProducto(pro:Producto):Observable<any>{
    const url = environment.domain_url + '/api/productos/insertar';
    const datos = {
      PRO_NOMBRE: pro.PRO_NOMBRE,
      PRO_CODIGO: pro.PRO_CODIGO,
      PRO_PRECIO_VENTA: pro.PRO_PRECIO_VENTA,
      PRO_PRECIO_COMPRA: pro.PRO_PRECIO_COMPRA,
      PRO_STOCK: 0,
      PRO_TAMANIO_TALLA: pro.PRO_TAMANIO_TALLA,
      CAT_ID: pro.CAT_ID,
      PROV_ID: pro.PROV_ID,
    }
    return this.http.post<any>(url,datos);
  }

  editarProductoSeleccionado(pro:Producto):Observable<any>{
    const url = environment.domain_url + '/api/productos/editar';
    const datos = {
      PRO_ID : pro.PRO_ID,
      PRO_NOMBRE: pro.PRO_NOMBRE,
      PRO_CODIGO: pro.PRO_CODIGO,
      PRO_PRECIO_VENTA: pro.PRO_PRECIO_VENTA,
      PRO_PRECIO_COMPRA: pro.PRO_PRECIO_COMPRA,
      PRO_STOCK: pro.PRO_STOCK,
      PRO_TAMANIO_TALLA: pro.PRO_TAMANIO_TALLA,
      CAT_ID: pro.CAT_ID,
      PROV_ID: pro.PROV_ID,
    }

    return this.http.put<any>(url,datos);
  }

}
