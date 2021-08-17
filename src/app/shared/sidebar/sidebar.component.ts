import { Component} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
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
}
