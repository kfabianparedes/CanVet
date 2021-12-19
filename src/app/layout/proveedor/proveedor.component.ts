import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Proveedor} from "../proveedor/proveedor.models";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProveedorService} from '../../services/proveedor.service';
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
      configModal.size = 'md'
    }
  proveedores:Proveedor[]=[];
  proveedorInsertar= new Proveedor();
  proveedorSeleccionado:Proveedor;

  ngOnInit(): void {
    this.cargando = true; 
    this.listarProveedores();
  }
  currentPage = 1;
  itemsPerPage = 50;
  
  cargando = false; 
  modalIn = false;
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
        this.cargando = false;
      },error=>{  
        this.cargando = false;
        this.mostrarAlerta = true;
        this.tipoAlerta='danger';
        this.modalIn = false;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
        
    });
  }
  inicializarFormularioProveedor(){
    this.proveedorForm = this.formBuilder.group({
      ruc:['',[Validators.maxLength(11), Validators.pattern(/^([0-9])*$/),Validators.minLength(11)]],
      nombreEmpresa:['',[Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(100)]],
      numeroContacto:['',[Validators.required,Validators.pattern('[0-9]+'), Validators.maxLength(9),Validators.minLength(9)]],
      
    });
  }
  insertarProveedor(){
    this.cargando = true;this.modalIn = true;
    this.proveedorInsertar.PROV_EMPRESA_PROVEEDORA = this.nombreEmpresa.value;
    this.proveedorInsertar.PROV_RUC = this.ruc.value;
    this.proveedorInsertar.PROV_NUMERO_CONTACTO = this.numeroContacto.value;
    
    if(!this.proveedorForm.invalid){
      this.proveedorService.insertarProveedor(this.proveedorInsertar).subscribe(
        data=>{
          this.proveedores.length = 0 ;
          this.cargando = false;
          this.modal.dismissAll();
          this.listarProveedores();
          this.tipoAlerta='success';
          this.modalIn = false; 
          this.mostrarAlerta = true; 
          this.mensajeAlerta = 'Solicitud realizada con éxito';
        },error=>{
          this.cargando = false;
          this.resetearFormulario();  
          this.modalIn = true;
          this.mostrarAlerta = true;
          this.tipoAlerta='danger';
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_deBD') {
              this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
            }
            else if (error['error']['error'] === 'error_exitenciaNombreEmpresa') {
              this.mensajeAlerta = 'El nombre de la empresa ingresado ya existe.';
            }
            else if (error['error']['error'] === 'error_exitenciaRuc') {
              this.mensajeAlerta = 'El RUC de la empresa ingresado ya existe.';
            }
            else if(error.error.error === 'error_deCampo'){
              this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
      });
    }else{  

    }

  }


  actualizarProveedor(){
    
    this.cargando = true;
    this.modalIn = true;
    this.proveedorInsertar.PROV_EMPRESA_PROVEEDORA = this.nombreEmpresa.value;
    this.proveedorInsertar.PROV_RUC = this.ruc.value;
    this.proveedorInsertar.PROV_NUMERO_CONTACTO = this.numeroContacto.value;
    this.proveedorInsertar.PROV_ID = this.proveedorSeleccionado.PROV_ID;
    this.proveedorService.actualizarProveedor(this.proveedorInsertar).subscribe(
      data=>{
        this.proveedores.length = 0 ;
        this.modal.dismissAll();
        this.resetearFormulario();  
        this.listarProveedores();
        this.modalIn = false ;
        this.mostrarAlerta = true; 
        this.tipoAlerta='success';
        this.mensajeAlerta = 'Solicitud realizada con éxito';
      },error=>{
          this.cargando = false; 
          this.mostrarAlerta = true;
          this.tipoAlerta='danger';
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_deBD') {
              this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
            }
            else if (error['error']['error'] === 'error_existenciaNombreEmpresa') {
              this.mensajeAlerta = 'El nombre de la empresa ingresado ya existe.';
            }
            else if (error['error']['error'] === 'error_existenciaRuc') {
              this.mensajeAlerta = 'El RUC de la empresa ingresado ya existe.';
            }
            else if (error['error']['error'] === 'error_exitenciaId') {
              this.mensajeAlerta = 'El distribuidor seleccionado no existe.';
            }
            else if(error.error.error === 'error_deCampo'){
              this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
      });
  
  }
  habilitarInhabilitarProveedor(PROV_ID:number,PROV_ESTADO:number){
    this.cargando = true;
    
    this.modalIn = false;
    if(PROV_ESTADO == 0){
      PROV_ESTADO = +1; 
      this.mensajeAlerta = 'Se habilitó el distribuidor satisfactoriamente.';
    }else{
      PROV_ESTADO = +0; 
      this.mensajeAlerta = 'Se inhabilitó el distribuidor satisfactoriamente.'

    }
    
    this.proveedorService.habilitarInhabilitarProveedor(PROV_ID,PROV_ESTADO).subscribe(data=>
      {
        this.listarProveedores();
        this.tipoAlerta = 'success';
        this.mostrarAlerta = true; 
      },error=>{
        this.cargando = false;
        this.mostrarAlerta = true;
        this.tipoAlerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if (error['error']['error'] === 'error_exitenciaId') {
            this.mensajeAlerta = 'El distribuidor seleccionado no existe.';
          }
        }
        else{
          this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
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
  busquedaProveedor:any='';
  filtrarProveedor(){

  }
}
