import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';
import { Comprobante } from 'src/app/models/comprobante.model';
import { DatosJuridicos } from 'src/app/models/datos-juridicos';
import { DetalleVenta } from 'src/app/models/detalle-venta';
import { Empresa } from 'src/app/models/empresa';
import { MetodoPago } from 'src/app/models/metodo-pago';
import { Venta } from 'src/app/models/venta';
import { ClienteService } from 'src/app/services/cliente.service';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { ProductoService } from 'src/app/services/producto.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { VentaService } from 'src/app/services/venta.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';
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
  productos_iniciales:Producto[]=[];

  productos_detalle : Producto[] = [];
  detallesProducto:DetalleVenta[]=[];
  venta = new Venta();
  detalle = new DetalleVenta();
  

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
  TotalVenta:number = 0;
  TotalVentaTarjeta:number = 0;

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
  clienteNatural: Cliente = new Cliente();
  clienteJuridico: Cliente = new Cliente();
  datosJuridicos: DatosJuridicos = new DatosJuridicos();
  
  constructor(
    private formBuilder: FormBuilder,
    private comprobanteService:ComprobanteService,
    private productoService:ProductoService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private datePipe: DatePipe,
    private userService: UserService,
    private storageService:StorageService,
    private metodoPago:MetodoPagoService,
    private empresaService:EmpresaService,
    private clienteService:ClienteService,
    private ventaService:VentaService
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
    this.listarClientes();
    this.documento.disable();
  }
  
  closeModal(): any {
    this.modal.dismissAll();
    this.busquedaPorCategoria = '';
    this.busquedaPorUnidadDeMedida = '';
    this.filtrarPorCategoria();
  }
  /******************BUSCAR INFORMACION DE CLIENTE ******************/
  //Variable de clientes
  clientes: Cliente[] = [];
  clientes_juridicos: any[] = [];
  //Variable de busqueda de cliente
  cliente_natural_buscado: Cliente = new Cliente();
  cliente_juridico_buscado: any;
  mostrar_natural: boolean = false;
  mostrar_juridico: boolean = false;
  busquedaCliente: boolean = false;

  active:number = 1;

  
  obtenerTipoDocumento(){
    if(this.tipo_comprobante.value==1){
      this.dni_ruc = 'RUC';
      this.documento.enable();
    }else if(this.tipo_comprobante.value == 2){
      this.dni_ruc = 'DNI';
      this.documento.enable();
    }
  }

  obtenerDatosCliente(documento:any){
    if(this.tipo_comprobante.value!=1 && this.tipo_comprobante.value!=2){
      this.mostrar_alerta = true;
      this.tipo_alerta='danger';
      this.modalIn = false;
      this.mensaje_alerta = 'Debe de seleccionar el tipo de comprobante. Por favor, vuelva a intentarlo.';
    }else if(documento==''){
      this.mostrar_alerta = true;
      this.tipo_alerta='danger';
      this.modalIn = false;
      this.mensaje_alerta = 'No ha ingresado el DNI o RUC del cliente. Por favor, vuelva a intentarlo.';
    }else if(this.tipo_comprobante.value == 1){
      this.cliente_juridico_buscado = this.clientes_juridicos.find(cliente_jur => cliente_jur.DJ_RUC == documento);
      if(this.cliente_juridico_buscado == undefined || this.cliente_juridico_buscado == null){
        //Limpiar los campos de juridico en caso no exista
        this.cliente_juridico_buscado = null;
        this.mostrar_juridico = false;
        this.mostrarDatosCliente = false;


        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
        this.mensaje_alerta = 'Has seleccionado FACTURA y el RUC del cliente no ha sido encontrado.';
      }else{
        this.cliente_natural_buscado = new Cliente();
        this.mostrar_natural = false;

        this.abrirInfoCliente();
        this.mostrar_juridico = true;
        this.mostrar_alerta = false;
        this.mostrarDatosCliente = true;
        this.busquedaCliente = true;

      }
    }else if(this.tipo_comprobante.value == 2){
      this.cliente_natural_buscado = this.clientes.find(cliente_nat => cliente_nat.CLIENTE_DNI == documento);
      if(this.cliente_natural_buscado == undefined || this.cliente_natural_buscado == null){
        //Limpiar los campos de natural en caso no exista
        this.cliente_natural_buscado = new Cliente();
        this.mostrar_natural = false;
        this.mostrarDatosCliente = false;


        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
        this.mensaje_alerta = 'Has seleccionado BOLETA y DNI del cliente no encontrado.';
      }else{
        this.cliente_juridico_buscado = null;
        this.mostrar_juridico = false;

        this.abrirInfoCliente();
        this.mostrar_natural = true;
        this.mostrar_alerta = false;
        this.mostrarDatosCliente = true;
        this.busquedaCliente = true;

      }
    }
  }
  /************************* MOSTRAR DATOS DE CLIENTE AL BUSCAR *************************/
  mostrarDatosCliente = false;
  flecha:string = 'down';
  abrirInfoCliente(){
    if (this.flecha === 'down') {
      this.mostrarDatosCliente = true;
      this.flecha = 'up';
    } else {
      this.flecha = 'down';
      this.mostrarDatosCliente = false;
    }
  }

  /*********************************LISTAR DATOS NECESARIOS **********************/
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
          this.productos_iniciales = data.resultado; 
          this.productos = this.productos_iniciales.slice();
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

  /*****************************AGREGAR Y QUITAR DETALLES DE VENTA ****************************************/
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
      this.TotalVenta = this.importes.reduce((a, b) => a + b, 0);
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
        this.listarProductoTabla = true;
      }
    });
    this.importes.splice(indice,1);
    this.cantidad_detalles.splice(indice,1);
    this.TotalVenta = this.importes.reduce((a, b) => a + b, 0);
  }

  /*********************BUSQUEDA DE PRODUCTOS **************************/
  busquedaPorCategoria ='';
  busquedaPorUnidadDeMedida = '';
  primeraBusqueda: boolean = true;

  diferenciaDeArreglos = (arr1: any[] , arr2: any[]) => {
    return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
  }
  filtrarPorCategoria(){
    this.currentPageModal = 1;
    this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);
    if(this.busquedaPorUnidadDeMedida.length == 0){
      this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);//this.productos_iniciales.filter(producto=>{return producto});  
      this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaPorCategoria.toLowerCase()) > -1);
    }else if(this.busquedaPorUnidadDeMedida.length > 0){
      if(this.busquedaPorCategoria.length == 0){
        this.filtrarPorUnidadMedida(); 
      }else if(this.busquedaPorCategoria.length > 0){
        this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);//this.productos_iniciales.filter(producto=>{return producto});  
        this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaPorCategoria.toLowerCase()) > -1);
        this.productos = this.productos.filter(producto =>producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(this.busquedaPorUnidadDeMedida.toLowerCase()) > -1);
      }
    }
  }
  filtrarPorUnidadMedida(){
    this.currentPageModal = 1;
    if(this.primeraBusqueda){
      this.primeraBusqueda = false;
      if(this.busquedaPorUnidadDeMedida.length == 0){
        this.filtrarPorCategoria();
      }else{
        if(this.busquedaPorCategoria.length == 0){
          this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);
          this.productos = this.productos.filter(producto =>producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(this.busquedaPorUnidadDeMedida.toLowerCase()) > -1);
        }else{
          this.productos = this.productos.filter(producto =>producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(this.busquedaPorUnidadDeMedida.toLowerCase()) > -1);
        }
      }
    }else if(!this.primeraBusqueda){
      if(this.busquedaPorUnidadDeMedida.length==0){
        this.filtrarPorCategoria();
      }else{
        this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);//this.productos_iniciales.filter(producto=>{return producto});  
        this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaPorCategoria.toLowerCase()) > -1);
        this.productos = this.productos.filter(producto =>producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(this.busquedaPorUnidadDeMedida.toLowerCase()) > -1);
      }
    }
    
  }
  /********************** REGISTRAR VENTA ********************/
  registrarVenta(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    if(this.btnRegistroValido){
      this.venta.VENTA_FECHA_EMISION_COMPROBANTE = this.fecha_emision.value;
      this.venta.VENTA_FECHA_REGISTRO = this.getTodayFecha();
      this.venta.VENTA_NRO_SERIE = ''//this.serie.value;
      this.venta.VENTA_NRO_COMPROBANTE = ''//this.nro_comprobante.value;
      
      this.venta.USU_ID = +this.storageService.getString('USE_ID');

      if(this.tipo_comprobante.value == 1){
        this.venta.CLIENTE_ID = this.cliente_juridico_buscado.CLIENTE_ID;
      }else if(this.tipo_comprobante.value == 2){
        this.venta.CLIENTE_ID = this.cliente_natural_buscado.CLIENTE_ID;
      }
      this.venta.METODO_DE_PAGO_ID = this.forma_pago.value;
      this.venta.VENTA_SUBTOTAL = this.TotalVenta;
      if(this.venta.METODO_DE_PAGO_ID == 2){
        this.venta.VENTA_TOTAL = this.TotalVentaTarjeta;
      }else{  
        this.venta.VENTA_TOTAL = this.TotalVenta;
      }
      this.venta.COMPROBANTE_ID = this.tipo_comprobante.value;

      if(this.productos_detalle.length === this.cantidad_detalles.length && this.cantidad_detalles.length === this.importes.length){
        this.productos_detalle.forEach((element,index) => {
          this.detalle.PRO_ID = element.PRO_ID;
          this.detalle.DET_CANTIDAD = this.cantidad_detalles[index];
          this.detalle.DET_IMPORTE = this.importes[index]*100;
          this.detallesProducto.push(this.detalle);
          this.detalle = new DetalleVenta();
        });
      }
      console.log(this.venta);
      console.log(this.detallesProducto);
      if(this.storageService.hasKey('OPEN_CODE') && this.storageService.hasKey('OPEN_ID')){
        this.ventaService.registrarVenta(this.venta, this.detallesProducto).subscribe(
          (data)=>{
            console.log(data);
            this.cargando = false;
            this.modalIn = false;
            this.mostrar_alerta = true;
            this.mensaje_alerta = 'El registro de la venta se realizó correctamente.';
            this.tipo_alerta = 'success';
            this.limpiar();
            this.comprobanteForm.reset();
          },
          (error)=>{
            this.limpiar();
            this.cargando = false;
            this.mostrar_alerta = true;
            this.modalIn = false;
            this.tipo_alerta='danger';
            if (error.error.error !== undefined) {
              if (error.error.error === 'error_deBD') {
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
              } else if(error.error.error === 'error_deCampo'){
                this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
              }else if(error.error.error === 'error_ejecucionQuery'){
                this.mensaje_alerta = 'Hubo un error al registrar la venta, Por favor, actualice la página o inténtelo más tarde.';
              }else if(error.error.error === 'error_NoExistenciaComprobanteId'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El tipo de comprobante no es válido.';
              }else if(error.error.error === 'error_NoExistenciaUsuarioId'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El usuario no ha podido ser reconocido.';
              }else if(error.error.error === 'error_NoExistenciaMétodoDePagoId'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El método de pago no es válido.';
              }else if(error.error.error === 'error_NoExistenciaClienteId'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El cliente no ha podido ser reconocido.';
              }else if(error.error.error === 'error_existenciaNroComprobante'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El número de comprobante de la factura o boleta ya está registrado.';
              }else if(error.error.error === 'error_NoCajaAbierta'){
                this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Tiene que abrir la caja para poder realizar una venta.';
              }
  
              
            }
            else{
              this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
            }
          }
        );
      }else{
        this.limpiar();
        this.cargando = false;
        this.mostrar_alerta = true;
        this.modalIn = false;
        this.tipo_alerta='warning';
        this.mensaje_alerta = 'Tiene que abrir una caja para poder realizar una venta.';

      }
      

    }



    
  }

 
  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      documento:['',[Validators.required,Validators.pattern(/^([0-9])*$/),Validators.minLength(8),Validators.minLength(8),Validators.maxLength(11)]],
      tipo_comprobante:['',[Validators.required]],
      //DESHABILITADO POR AHORA SERI Y NRO COMPROBANTE
      // serie:['',[Validators.pattern(/^([0-9])*$/),Validators.minLength(3), Validators.maxLength(5)]],
      // nro_comprobante:['',[Validators.pattern(/^([0-9])*$/),Validators.minLength(7), Validators.maxLength(10)]],
      fecha_emision:[this.getTodayFecha(),[Validators.required]],
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
  // get serie() {
  //   return this.comprobanteForm.get('serie');
  // }
  // get nro_comprobante() {
  //   return this.comprobanteForm.get('nro_comprobante');
  // }
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

  /***************************BUSCAR CLIENTE POR DNI/RUC ********************/


  /************************************REGISTRO DE CLIENTES************************************/
  nuevoCliente(){
    this.modal.open(this.clienteModal,{size: 'lg'});
    this.mostrar_alerta = false;
    this.modalIn = false;
    this.inicializarClienteNaturalFormulario();
    this.inicializarClienteJuridicoFormulario();
  }

  limpiar(){
    this.mostrarDatosCliente = false;
    this.cliente_juridico_buscado = null;
    this.cliente_natural_buscado = new Cliente();
    this.btnRegistroValido = false;
    this.listarProductoTabla = true;
    this.productos_detalle.splice(0,this.productos_detalle.length);
    this.detallesProducto.splice(0,this.detallesProducto.length);
    this.cantidad_detalles.splice(0,this.cantidad_detalles.length);
    this.importes.splice(0,this.importes.length);
    this.TotalVenta = 0;
    this.TotalVentaTarjeta = 0;
    this.busquedaCliente = false;
  }
  limpiarClientes(){
    this.clienteForm.reset();
    this.clienteJuridicoForm.reset();
    this.clienteNatural = new Cliente();
    this.clienteJuridico = new Cliente();
  }  
  listarClientes(){
    this.cargando = true;
    this.modalIn = false;
    this.clienteService.listarClientes().subscribe(
      (data)=>{
        this.clientes = data['resultado'].CLIENTES_NORMALES;
        this.clientes_juridicos = data['resultado'].CLIENTES_JURIDICOS;
        console.log(this.clientes);
        console.log(this.clientes_juridicos);
        this.cargando = false;
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
  
  listarEmpresas(){
    this.modalIn = false;
    this.cargando = true;
    this.empresaService.listasTipodeEmpresas().subscribe(
      (data)=>{
        this.empresas = data['resultado'];
        this.cargando = false;
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
    if(this.clienteForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular.value;
      this.clienteNatural.CLIENTE_DNI = this.dni.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo_.value;
      this.clienteService.registrarCliente(this.clienteNatural).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.limpiar();
          this.listarClientes();
        },
        (error)=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.modalIn = true;
          this.tipo_alerta='danger';
          if (error.error.error !== undefined) {
            if (error.error.error === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
            } else if(error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaDNI'){
              this.mensaje_alerta = 'El DNI ingresado ya le pertenece a un cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }

  registrarClienteJuridico(){
    if(this.clienteJuridicoForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres_.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular_.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion_.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo.value;

      this.datosJuridicos.DJ_RAZON_SOCIAL = this.razon_social.value;
      this.datosJuridicos.DJ_RUC = this.ruc.value;
      this.datosJuridicos.TIPO_EMPRESA_ID = this.tipo_empresa.value;
      this.clienteService.registrarCliente(this.clienteNatural,this.datosJuridicos).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.listarClientes();
          this.limpiar();
        },
        (error)=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.modalIn = true;
          this.tipo_alerta='danger';
          if (error.error.error !== undefined) {
            if (error.error.error === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
            } else if(error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaRUC'){
              this.mensaje_alerta = 'El RUC ingresado ya le pertenece a un usuario. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_noExistenciaTipoEmpresa'){
              this.mensaje_alerta = 'Hubo un error identificando el tipo de empresa. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ExistenciaRazonSocial'){
              this.mensaje_alerta = 'La razón social le pertenece a otro cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }

  inicializarClienteNaturalFormulario(){
    this.clienteForm = this.formBuilder.group({
      nombres:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      apellidos: ['', [Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+'),Validators.maxLength(30)]],
      celular: ['', [Validators.required, Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
      direccion: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
      correo_: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    });
  }
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
  get correo_() {
    return this.clienteForm.get('correo_');
  }


  inicializarClienteJuridicoFormulario(){
    this.clienteJuridicoForm = this.formBuilder.group({
      nombres_:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      razon_social: ['', [Validators.required,Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'), Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(11),  Validators.maxLength(11)]],
      tipo_empresa:['',[Validators.required]],
      celular_: ['', [Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      direccion_: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
      correo: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
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
  get correo() {
    return this.clienteJuridicoForm.get('correo');
  }


  /********************** ORDENAMIENTO DE TABLA ARTICULOS ***********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  
  onSort({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle);
    } else {
      this.productos = this.diferenciaDeArreglos(this.productos_iniciales,this.productos_detalle).sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /******* PORCENTAJE POR TARJETA *******/
  mostrar_porcentaje_total: boolean = false;
  agregarTarjeta(){
    console.log(this.forma_pago.value);
    if(this.forma_pago.value == 2){
      this.mostrar_porcentaje_total = true;
      this.TotalVentaTarjeta = this.TotalVenta + (0.05*this.TotalVenta);
    }else{
      this.mostrar_porcentaje_total = false;
      this.TotalVentaTarjeta = this.TotalVenta;
    }
  }
}
