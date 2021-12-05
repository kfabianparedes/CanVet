import { Injectable } from '@angular/core';
import { CanActivate,CanLoad,Route,Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';


@Injectable({
  providedIn: 'root'
})

export class AuthSesionGuard implements CanActivate,CanLoad {

  constructor(
      private router: Router,
      private storageService: StorageService
    ){}
  canLoad(){
    return true;
    // if(!this.storageService.hasKey('USE_STATE') || this.storageService.hasKey('USE_STATE').toString() != '1'  ){
    //   this.router.navigate(['/not-found']);
    //   return false;
    // }else if
    // (
    //   (this.storageService.hasKey("USE_STATE") && this.storageService.getString('USE_STATE') == '1') && 
    //   (this.storageService.getString('USE_TYPE') == '1' || this.storageService.getString('USE_TYPE') == '2') &&
    //   (this.storageService.hasKey("USE_SUB"))
    // ){
    //   this.router.navigate(['/dashboard']);
    //   return true;
    // }
    // return false;
  }
    
  canActivate(){
    return true;
    // if(!this.storageService.hasKey('USE_STATE') || this.storageService.hasKey('USE_STATE').toString() != '1'  ){
    //   this.router.navigate(['/not-found']);
    //   return false;
    // }else if
    // (
    //   (this.storageService.hasKey("USE_STATE") && this.storageService.getString('USE_STATE') == '1') && 
    //   (this.storageService.getString('USE_TYPE') == '1' || this.storageService.getString('USE_TYPE') == '2') &&
    //   (this.storageService.hasKey("USE_SUB"))
    // ){
    //   this.router.navigate(['/dashboard']);
    //   return true;
    // }
    // return false;
  }
  
}