import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../services/storage.service'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  autenticarUsuario(identificador: string, contrasenia: string) {
    const url = environment.domain_url + '/api/usuarios/login.php';
    return this.http.post<any>(url,
      {
        USU_IDENTIFICADOR: identificador, //Puedes autentificarte con email o alias(nickname)
        USU_CONTRASENIA: contrasenia
      }
    ).pipe(retry(2));
  }
}
