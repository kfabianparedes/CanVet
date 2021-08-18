import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import {Categoria} from '../categoria/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }


  listarCategorias():Observable<any>{
    const url: string =  'http://localhost/CanVetAPI/api/categoria/listarCategorias';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  habilitarInhabilitarCategoria(categoriaId:number,nuevoEstado:number){
    const url: string =  'http://localhost/CanVetAPI/api/categoria/habilitarInhabilitarCategoria';

    const datos = {
      CAT_ID: categoriaId,
      CAT_ESTADO: nuevoEstado
    }
    return this.http.put<any>(url,datos).pipe( retry(2) );
  }
}
