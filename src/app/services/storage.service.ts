import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storeString(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  hasKey(key: string) {
    return !!localStorage.getItem(key);
  }

  getString(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  storeObjeto(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObjeto(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
  
  clear(){
    localStorage.clear();
  }

}
