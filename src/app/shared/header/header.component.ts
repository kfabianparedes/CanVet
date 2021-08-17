import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
  @HostListener('window:resize', ['$event'])
  getScreen(event?: any){
    this.width = window.innerWidth;
  }
  status: boolean = false;
  toggled: string = '';
  width!: number;
  ngOnInit(): void {
    this.width = window.innerWidth;
  }
  clickEvent(){
    this.status = !this.status; 
    if(this.toggled === 'toggled'){
      this.toggled ='';
    }else{
      this.toggled = 'toggled'; 
    }
  }

}
