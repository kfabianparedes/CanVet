import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  listRols():Observable<any>{
    const url = environment.domain_url + '/api/roles/listarRoles';
    return this.http.get<any>(url).pipe(retry(2));
  }

}
