import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Proveedor} from "../proveedor/proveedor.models";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  constructor() { }
  proveedores:Proveedor[]=[];
  proveedorSeleccionado:Proveedor;

  ngOnInit(): void {
  }


  //modal para editar un Producto
  @ViewChild('editarProveedor') editarProv: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearProveedor') crearProv: ElementRef;


}
