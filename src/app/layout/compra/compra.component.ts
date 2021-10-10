import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Comprobante } from 'src/app/models/comprobante.model';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Producto } from '../producto/producto.models';
import { Proveedor } from '../proveedor/proveedor.models';
import { DatePipe } from '@angular/common';
import { DetalleProducto } from 'src/app/models/detalle-producto';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  productos_detalle : Producto[] = [];
  proveedores: Proveedor[] = [];
  comprobantes:Comprobante[] =[];
  detallesProducto:DetalleProducto[]=[];
  productos:Producto[]=[];
  importes: number[] = [];
  detalle = new DetalleProducto();
  comprobanteForm : FormGroup;
  guiaRemisionForm : FormGroup;
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;
  
  mensaje_tabla: string;

  //Varibale para el tipo de comprobante
  mostrar_guia: boolean = false;
  proveedor_seleccionado:boolean = false;
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
  cantidad_detalles:number[]= [];
  nro_productos_visibles: number = 0;
  TotalCompra:number = 0;
  //variable de fecha
  opacarFecha: boolean = true;
  listarProductoTabla: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private proveedorService:ProveedorService,
    private comprobanteService:ComprobanteService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private productoService:ProductoService,
    private datePipe: DatePipe
    ){ 
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'xl'
    }

  @ViewChild('articulosModal') articulosModal: ElementRef;

  ngOnInit(): void {
    this.listarProductoTabla = true;
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
    this.mostrar_alerta = false;
    this.cargando = true;
    this.productoService.listarProductosPorProveedor(id).subscribe(
      data=>{
        this.productos = data.resultado; 
        console.log(this.productos);
        this.cargando = false;
        this.listarProductoTabla = false;
        this.nro_productos_visibles = this.productos.length; 
      },error=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = true;
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
    this.inicializarGuiaFormulario();
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
      if(this.listarProductoTabla)
        this.listarProductos(this.id_proveedor.value);
      this.modal.open(this.articulosModal);
      this.modalIn = true;
    }else{
      this.mensaje_alerta = 'No ha seleccionado el proveedor. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = false;
    }
    
  }
  agregarProducto(producto:Producto){
    this.productos_detalle.push(producto);
    this.productos.forEach( (element, index) => {
      if(element === producto) this.productos.splice(index,1);
    });
    //Deshabilitar el select option de los proveedores
    this.id_proveedor.disable();
  }
  quitarProducto(producto:Producto,indice:any){
    this.productos.unshift(producto);
    this.productos_detalle.forEach((element,index)=>{
      if(element === producto) 
        this.productos_detalle.splice(index,1);
      //Deshabilitar el select option de los proveedores
      if(this.productos_detalle.length==0){
        this.id_proveedor.enable();
        this.listarProductoTabla = true;
      }
    });
    this.importes.splice(indice,1);
    this.cantidad_detalles.splice(indice,1);
    this.TotalCompra = this.importes.reduce((a, b) => a + b, 0);
    

  }
  agregarCantidadTabla(precio:any, indice:any){
    console.log(this.cantidad_detalles[indice]);
    if(Number.isInteger(+this.cantidad_detalles[indice])){
      this.importes[indice] = +(this.cantidad_detalles[indice] * precio).toFixed(2); 
      this.TotalCompra = this.importes.reduce((a, b) => a + b, 0);
      this.mostrar_alerta = false;
    }else{
      this.mensaje_alerta = 'Debes ingresar número, vuelve a intentarlo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = false;
    }
  }
  registrarCompra(){
  }
  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      id_proveedor:['',[Validators.required]],
      tipo_comprobante:['',[Validators.required]],
      serie:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      nro_comprobante:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision:['',[Validators.required]]
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
    return this.comprobanteForm.get('fecha_emision');
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
  getTodayFecha(): string {
    return new Date().toISOString().split('T')[0];
  }
  
}
