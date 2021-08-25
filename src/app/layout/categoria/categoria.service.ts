import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import {Categoria} from '../categoria/categoria.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }


  listarCategorias():Observable<any>{
    const url = environment.domain_url + '/api/categorias/listarCategorias';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  habilitarInhabilitarCategoria(categoriaId:number,nuevoEstado:number){
    const url = environment.domain_url + '/api/categorias/habilitarInhabilitarCategoria';

    const datos = {
      CAT_ID: categoriaId,
      CAT_ESTADO: nuevoEstado
    }
    return this.http.put<any>(url,datos).pipe( retry(2) );
  }
  crearCategoria(nombre:string){
    const url = environment.domain_url + '/api/categorias/insertar';
    const datos = {
      CAT_NOMBRE : nombre
    }     
    return this.http.post<string>(url,datos).pipe( retry(2));   
  } 
  
  editarCategoria(cat:Categoria,nuevoNombre:string){
    const url = environment.domain_url + '/api/categorias/editarCategoria';
    const datos = {
      CAT_NOMBRE : cat.CAT_NOMBRE,
      CAT_ID: cat.CAT_ID,
      CAT_NUEVO_NOMBRE :nuevoNombre
    }    
    return this.http.put<any>(url,datos).pipe( retry(2));
  }
}
