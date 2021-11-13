import { Component, OnInit } from '@angular/core';
import { CajaService } from '../services/caja.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private cajaService:CajaService,
              private storageService:StorageService) { }

  ngOnInit(): void {
    this.recuperarCajaEmpleado();
  }

  recuperarCajaEmpleado(){
    this.cajaService.recuperarCaja().subscribe(
      data=>{
        if(data['resultado']['CAJA_CODIGO'] && data['resultado']['CAJA_ID'])
        {
          console.log(data);
          this.storageService.storeString('OPEN_CODE', data['resultado']['CAJA_CODIGO']);
          this.storageService.storeString('OPEN_ID', data['resultado']['CAJA_ID']);
        }
      },error=>{

      }
    );
  }
}
