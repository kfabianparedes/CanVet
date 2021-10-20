import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Comprobante } from 'src/app/models/comprobante.model';
import { Empresa } from 'src/app/models/empresa';
import { MetodoPago } from 'src/app/models/metodo-pago';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
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
  metodos_pago: MetodoPago[]=[];
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

  dni_ruc:string = 'Documento identificador';


  //Variable de registro de cliente
  clienteForm : FormGroup;
  clienteJuridicoForm : FormGroup;
  empresas: Empresa[] = [];
  @ViewChild('clienteModal') clienteModal: ElementRef;

  
  constructor(
    private formBuilder: FormBuilder,
    private comprobanteService:ComprobanteService,
    private productoService:ProductoService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private datePipe: DatePipe,
    private userService: UserService,
    private metodoPago:MetodoPagoService,
    private empresaService:EmpresaService
  ) {
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
   }
  
  @ViewChild('articulosModal') articulosModal: ElementRef;

  ngOnInit(): void {
    this.listarProductoTabla = true;
    this.inicializarFormulario();
    this.listarComprobantes();
    this.listarMetodoPago();
    this.listarEmpresas();

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
  listarMetodoPago(){
    this.cargando = true;
    this.modalIn = false;
    this.metodoPago.listarMetodosDePago().subscribe(
      (data)=>{
        this.metodos_pago = data['resultado'];
        this.cargando = false;
      },(error)=>{
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
    this.modal.open(this.articulosModal,{size: 'xl'});
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
  nuevoCliente(){
    this.modal.open(this.clienteModal,{size: 'lg'});
    this.mostrar_alerta = false;
    this.modalIn = false;
    this.inicializarClienteNaturalFormulario();
    this.inicializarClienteJuridicoFormulario();
  }

  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      documento:['',[Validators.required,Validators.minLength(8),Validators.maxLength(11)]],
      tipo_comprobante:['',[Validators.required]],
      serie:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(5)]],
      nro_comprobante:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision:['',[Validators.required]],
      forma_pago:['',[Validators.required]]
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
  get forma_pago(){
    return this.comprobanteForm.get('forma_pago');
  }

  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }



  /************************************REGISTRO DE CLIENTES************************************/
  listarEmpresas(){
    this.modalIn = false;
    this.cargando = true;
    this.empresaService.listasTipodeEmpresas().subscribe(
      (data)=>{
        this.empresas = data['resultado'];
        this.cargando = false;
        console.log(this.empresas);
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }

  registrarClienteNatural(){
    
  }
  registrarClienteJuridico(){

  }
  inicializarClienteNaturalFormulario(){
    this.clienteForm = this.formBuilder.group({
      nombres:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'),Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'),Validators.maxLength(30)]],
      celular: ['', [Validators.required, Validators.pattern('[+][0-9]+'), Validators.maxLength(20), Validators.minLength(12)]] ,
      dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
      direccion: ['', [Validators.required , Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
    });
  }

  active:number = 1;
  // getters & setters
  get nombres() {
    return this.clienteForm.get('nombres');
  } 
  get apellidos() {
    return this.clienteForm.get('apellidos');
  } 
  get celular() {
    return this.clienteForm.get('celular');
  } 
  get dni() {
    return this.clienteForm.get('dni');
  } 
  get direccion() {
    return this.clienteForm.get('direccion');
  } 
  inicializarClienteJuridicoFormulario(){
    this.clienteJuridicoForm = this.formBuilder.group({
      nombres_:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ.]+$'),Validators.maxLength(100)]],
      razon_social: ['', [Validators.required,Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ.]+$'), Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(11),  Validators.maxLength(11)]],
      tipo_empresa:['',[Validators.required]],
      celular_: ['', [Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      direccion_: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
    });
  }
  // getters & setters
  get nombres_() {
    return this.clienteJuridicoForm.get('nombres_');
  } 
  get celular_() {
    return this.clienteJuridicoForm.get('celular_');
  } 
  get direccion_() {
    return this.clienteJuridicoForm.get('direccion_');
  } 
  get razon_social() {
    return this.clienteJuridicoForm.get('razon_social');
  } 
  get ruc() {
    return this.clienteJuridicoForm.get('ruc');
  } 
  get tipo_empresa() {
    return this.clienteJuridicoForm.get('tipo_empresa');
  } 

}
