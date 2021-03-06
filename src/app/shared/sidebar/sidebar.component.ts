import { Component, OnInit} from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  USE_TYPE: string;
  USE_ID: string;
  
  constructor(private storageService:StorageService){
  }

  ngOnInit(): void {
    this.USE_TYPE = this.storageService.getString('USE_TYPE');
    this.USE_ID = this.storageService.getString('USE_ID');
  }
  toggled: string = '';
  
  clickEvent(){
    if(this.toggled === 'toggled'){
      this.toggled ='';
    }else{
      this.toggled = 'toggled'; 
    }
  }
  cerrarSideBar(){
    this.toggled = 'toggled'; 
  }
  cambiarSideBar($event:any){
    this.toggled = $event; 
  }
}
