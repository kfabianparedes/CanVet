import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto/producto.models';
import { Proveedor } from '../proveedor/proveedor.models';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  public fecha_hoy: Date = new Date();
  productos_detalle : Producto[] = [];
  proveedores: Proveedor[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  listarProveedores(){
    
  }
}
