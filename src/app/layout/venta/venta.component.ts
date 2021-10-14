import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Comprobante } from 'src/app/models/comprobante.model';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UserService } from 'src/app/services/user.service';
import { Producto } from '../producto/producto.models';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  mensaje_tabla: string;
  mostrar_alerta_tabla: boolean = false;

  comprobanteForm : FormGroup;
  productos:Producto[]=[];
  productos_detalle : Producto[] = [];
  importes: number[] = [];
  comprobantes:Comprobante[] =[];
  //variable de fecha
  opacarFecha: boolean = true;
  listarProductoTabla: boolean;
  USU_ID: number;

  //variables de tabla
  importe_detalle:number = 0;
  cantidad_detalles:number[]= [];
  TotalCompra:number = 0;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  currentPageModal = 1;
  itemsPerPageModal = 5;

  //Varibale para el tipo de comprobante
  mostrar_guia: boolean = false;
  proveedor_seleccionado:boolean = false;
  btnRegistroValido:boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private comprobanteService:ComprobanteService,
    private productoService:ProductoService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'xl'
   }
  
  @ViewChild('articulosModal') articulosModal: ElementRef;
  ngOnInit(): void {
    this.listarProductoTabla = true;
    this.inicializarFormulario();
    this.listarComprobantes();
  }
  
  closeModal(): any {
    this.modal.dismissAll();
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
  listarProductos(){
    this.modal.open(this.articulosModal);
    this.mostrar_alerta = false;
    this.modalIn = true;
    if(this.listarProductoTabla){
      this.cargando = true;
      this.productoService.listarProductos().subscribe(
        data=>{
          this.productos = data.resultado; 
          this.cargando = false;
          this.listarProductoTabla = false;
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
    
  }

  agregarProducto(producto:Producto){
    this.productos_detalle.push(producto);
    this.productos.forEach( (element, index) => {
      if(element === producto) this.productos.splice(index,1);
    });
  }

  agregarCantidadTabla(precio:any, indice:any){
    const regexp = new RegExp(/^([0-9])*$/);
    if(Number.isInteger(+this.cantidad_detalles[indice]) && regexp.test(this.cantidad_detalles[indice].toString()) && this.cantidad_detalles[indice]!==null){
      this.importes[indice] = +(this.cantidad_detalles[indice] * precio); 
      this.TotalCompra = this.importes.reduce((a, b) => a + b, 0);
      this.mostrar_alerta_tabla = false;
      this.btnRegistroValido = true;
    }else{
      this.mensaje_tabla = 'Debes ingresar un número, vuelve a intentarlo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta_tabla = true;
      this.modalIn = false;
      this.btnRegistroValido = false;
    }
  }
  
  quitarProducto(producto:Producto,indice:any){
    this.productos.unshift(producto);
    this.productos_detalle.forEach((element,index)=>{
      if(element === producto) 
        this.productos_detalle.splice(index,1);
      //Deshabilitar el select option de los proveedores y listar los productos si no hay nada en la tabla de detalles 
      if(this.productos_detalle.length==0){
        // this.id_proveedor.enable();
        this.listarProductoTabla = true;
      }
    });
    this.importes.splice(indice,1);
    this.cantidad_detalles.splice(indice,1);
    this.TotalCompra = this.importes.reduce((a, b) => a + b, 0);
  }
  registrarVenta(){
    
  }
  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      documento:['',[Validators.required,Validators.minLength(8),Validators.maxLength(11)]],
      tipo_comprobante:['',[Validators.required]],
      serie:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(5)]],
      nro_comprobante:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision:['',[Validators.required]]
    });
  }
  //getters & setters
  get documento() {
    return this.comprobanteForm.get('documento');
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

  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }
}
