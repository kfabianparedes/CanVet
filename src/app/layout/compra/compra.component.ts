import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Comprobante } from 'src/app/models/comprobante.model';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Producto } from '../producto/producto.models';
import { Proveedor } from '../proveedor/proveedor.models';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  public fecha_hoy: Date = new Date();
  productos_detalle : any[] = [];
  proveedores: Proveedor[] = [];
  comprobantes:Comprobante[] =[];
  productos:any[]=[];
  comprobanteForm : FormGroup;
  guiaRemisionForm : FormGroup;
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  //Varibale para el tipo de comprobante
  mostrar_guia: boolean = false;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  currentPageModal = 1;
  itemsPerPageModal = 5;

  //sibmolo de agregar guia de remision
  signo:string = 'plus';
  color_btn_remision:string = 'success';

  //variables de tabla
  importe_detalle:number = 0;
  opacarFecha: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private proveedorService:ProveedorService,
    private comprobanteService:ComprobanteService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private productoService:ProductoService
    ){ 
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'xl'
    }

  @ViewChild('articulosModal') articulosModal: ElementRef;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarProveedores();
    this.listarComprobantes();
  }
  closeModal(): any {
    this.modal.dismissAll();
  }


  listarProveedores(){
    this.cargando = true;
    this.modalIn = false;
    this.proveedorService.listarProveedores().subscribe(
      (data)=>{
        this.proveedores = data['resultado'];
        this.cargando = false;
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }
  listarComprobantes(){
    this.cargando = true;
    this.modalIn = false;
    this.comprobanteService.listarComprobantes().subscribe(
      (data)=>{
        this.comprobantes = data['resultado'];
        this.cargando = false;
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }
  listarProductos(id:number){
    this.cargando = true;
    this.modalIn = true;
    this.productoService.listarProductosPorProveedor(id).subscribe(
      data=>{
        this.productos = data.resultado; 
        this.cargando = false; 
      },error=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    ); 
  }
  activarGuiaRemision(){
    if(!this.mostrar_guia)
      this.mostrar_guia = true;
    else
      this.mostrar_guia = false;

    if(this.signo === 'plus'){
      this.signo = 'minus';
      this.color_btn_remision = 'danger';
    }
    else{ 
      this.signo = 'plus';
      this.color_btn_remision = 'success';
    }
  }
  articulosProveedor(){
    if(this.id_proveedor.value){
      this.listarProductos(this.id_proveedor.value);
      this.modal.open(this.articulosModal);
    }else{
      this.mensaje_alerta = 'No ha seleccionado el proveedor. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = false;
    }
    
  }
  agregarProducto(producto:Producto){
    
  }
  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      id_proveedor:['',[Validators.required]],
      tipo_comprobante:['',[Validators.required]],
      serie:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      nro_comprobante:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
    });
  }
  inicializarGuiaFormulario(){
    this.guiaRemisionForm = this.formBuilder.group({
      tipo_comprobante_guia :['',[Validators.required]],
      serie_guia :['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      nro_comprobante_guia :['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision_guia:['',[Validators.required]]
    })
  }
  //getters & setters
  get id_proveedor() {
    return this.comprobanteForm.get('id_proveedor');
  }
  get tipo_comprobante() {
    return this.comprobanteForm.get('tipo_comprobante');
  }
  get serie() {
    return this.comprobanteForm.get('serie');
  }
  get nro_comprobante() {
    return this.comprobanteForm.get('nro_comprobante');
  }
  get fecha_emision(){
    return this.guiaRemisionForm.get('fecha_emision');
  }
  //GETS DE GUIA DE REMISION
  get tipo_comprobante_guia() {
    return this.guiaRemisionForm.get('tipo_comprobante_guia');
  }
  get serie_guia() {
    return this.guiaRemisionForm.get('serie_guia');
  }
  get nro_comprobante_guia() {
    return this.guiaRemisionForm.get('nro_comprobante_guia');
  }
  get fecha_emision_guia(){
    return this.guiaRemisionForm.get('fecha_emision_guia');
  }
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
}
