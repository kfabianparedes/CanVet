import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Proveedor} from "../proveedor/proveedor.models";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProveedorService} from '../../services/proveedor.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  constructor(
    public modal: NgbModal,
    private formBuilder: FormBuilder,configModal: NgbModalConfig,private proveedorService:ProveedorService) { 
      configModal.backdrop = 'static';
      configModal.keyboard = false;
    }
  proveedores:Proveedor[]=[];
  proveedorInsertar= new Proveedor();
  proveedorSeleccionado:Proveedor;

  ngOnInit(): void {
    this.carga = true; 
    this.listarProveedores();
  }
  currentPage = 1;
  itemsPerPage = 10;
  
  carga = false; 
  cargaModal = false; 
  proveedorForm: FormGroup;

  tipoAlerta = "";
  mostrarAlerta = false;
  mensajeAlerta= "";  

  //modal para editar un Producto
  @ViewChild('editarProveedor') editarProv: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearProveedor') crearProv: ElementRef;
  
  listarProveedores(){
    this.proveedorService.listarProveedores().subscribe(
      data=>{
        this.proveedores = data['resultado'];
        this.carga = false;
      },error=>{  
        this.carga = false;
    });
  }
  inicializarFormularioProveedor(){
    this.proveedorForm = this.formBuilder.group({
      ruc:['',[Validators.required, Validators.maxLength(11),Validators.minLength(11)]],
      nombreEmpresa:['',[Validators.required, Validators.maxLength(100)]],
      numeroContacto:['',[Validators.required, Validators.maxLength(20),Validators.minLength(12)]],
      
    });
  }
  insertarProveedor(){
    this.cargaModal = true;
    this.proveedorInsertar.PROV_EMPRESA_PROVEEDORA = this.nombreEmpresa.value;
    this.proveedorInsertar.PROV_RUC = this.ruc.value;
    this.proveedorInsertar.PROV_NUMERO_CONTACTO = this.numeroContacto.value;
    
    if(!this.proveedorForm.invalid){
      this.proveedorService.insertarProveedor(this.proveedorInsertar).subscribe(
        data=>{
          console.log("Se insertó correctamente");
          this.proveedores.length = 0 ;
          this.cargaModal = false;
          this.modal.dismissAll();
          this.resetearFormulario();  
          this.listarProveedores();
        },error=>{
          console.log("No se insertó correctamente");
      });
    }else{
      console.log("error");
      this.cargaModal = false;
    }

  }
  actualizarProveedor(){
    
    this.cargaModal = true;
    this.proveedorSeleccionado.PROV_EMPRESA_PROVEEDORA = this.nombreEmpresa.value;
    this.proveedorSeleccionado.PROV_RUC = this.ruc.value;
    this.proveedorSeleccionado.PROV_NUMERO_CONTACTO = this.numeroContacto.value;
    this.proveedorService.actualizarProveedor(this.proveedorSeleccionado).subscribe(
      data=>{
        console.log("si editó");
        this.proveedores.length = 0 ;
        this.modal.dismissAll();
        this.resetearFormulario();  
        this.listarProveedores();
      },error=>{
        console.log("no editó");
        this.cargaModal = false;
      });
  
  }
  habilitarInhabilitarProveedor(PROV_ID:number,PROV_ESTADO:number){
    this.carga = true;
    
    if(PROV_ESTADO == 1){
      PROV_ESTADO = 2; 
      this.mensajeAlerta = 'Se ha inhabilitado la categoría satisfactoriamente.';
    }else{
      PROV_ESTADO =  1; 
      this.mensajeAlerta = 'Se ha habilitado la categoría satisfactoriamente.'

    }
    
    this.proveedorService.habilitarInhabilitarProveedor(PROV_ID,PROV_ESTADO).subscribe(data=>
      {
        this.listarProveedores();
        this.tipoAlerta = 'success';
        this.mostrarAlerta = true; 
      },error=>{
        this.carga = false;
      });
  }

  abrirCrearProveedor(){
    this.inicializarFormularioProveedor();
    this.modal.open(this.crearProv);
  }
  resetearFormulario(){
    this.proveedorForm.reset();

  }
  abrirEditarProveedor(pro:Proveedor){
    
    this.inicializarFormularioProveedor();
    this.proveedorSeleccionado = pro; 
    this.ruc.setValue(this.proveedorSeleccionado.PROV_RUC);
    this.nombreEmpresa.setValue(this.proveedorSeleccionado.PROV_EMPRESA_PROVEEDORA);
    this.numeroContacto.setValue(this.proveedorSeleccionado.PROV_NUMERO_CONTACTO);
    this.modal.open(this.editarProv);
    
  }
  get ruc() {
    return this.proveedorForm.get('ruc');
  }
  get nombreEmpresa() {
    return this.proveedorForm.get('nombreEmpresa');
  }
  get numeroContacto() {
    return this.proveedorForm.get('numeroContacto');
  }
}
