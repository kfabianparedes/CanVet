import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  codigoAscii = '';
  storeString(key: string, value: string) {
    for ( let i = 0; i < value.length ; i++) {
      this.codigoAscii = this.codigoAscii + value[i].charCodeAt(0).toString();
    }
    console.log(this.codigoAscii);
    localStorage.setItem(key, this.codigoAscii);
  }
  storeSub(key:string, value:string){
    localStorage.setItem(key, value);
  }
  hasKey(key: string) {
    return !!localStorage.getItem(key);
  }

  getString(key: string) {
    const valor = localStorage.getItem(key);
    // for ( let i = 0; i < valor.length ; i++) {
    //   this.codigoAscii = this.codigoAscii + String.fromCharCode(valor).toString();
    // }
    console.log(this.codigoAscii);
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
