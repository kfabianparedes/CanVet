import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { CompraService } from 'src/app/services/compra.service';
import { GuiaRemision } from 'src/app/models/guia-remision';
import { Compra } from 'src/app/models/compra';
import { StorageService } from 'src/app/services/storage.service';

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
  productos_iniciales:Producto[]=[];
  importes: number[] = [];
  detalle = new DetalleProducto();
  guia = new GuiaRemision();
  compra = new Compra();
  comprobanteForm : FormGroup;
  guiaRemisionForm : FormGroup;
  busquedaPorNombre = '';
  busquedaPorCategoria ='';
  busquedaPorUnidadDeMedida = '';
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;
  
  mensaje_tabla: string;
  mostrar_alerta_tabla: boolean = false;

  //Varibale para el tipo de comprobante
  mostrar_guia: boolean = false;
  proveedor_seleccionado:boolean = false;
  btnRegistroValido:boolean = false;
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  currentPageModal = 1;
  itemsPerPageModal = 5;

  //sibmolo de agregar guia de remision
  signo:string = 'plus';
  color_btn_remision:string = 'success';
  enviar_guia: boolean  = false;

  //variables de tabla
  importe_detalle:number = 0;
  cantidad_detalles:number[]= [];
  TotalCompra:number = 0;
  //variable de fecha
  opacarFecha: boolean = true;
  listarProductoTabla: boolean;
  USU_ID: number;

  @ViewChild('articulosModal') articulosModal: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private proveedorService:ProveedorService,
    private comprobanteService:ComprobanteService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private productoService:ProductoService,
    private datePipe: DatePipe,
    private compraService:CompraService,
    private storageService:StorageService
    ){ 
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'xl'
    }

 
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
        this.productos_iniciales = [...this.productos]//this.productos.filter(x=>{return x});
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
  activarGuiaRemision(){
    this.inicializarGuiaFormulario();
    if(!this.mostrar_guia){
      this.mostrar_guia = true;
      this.enviar_guia = true;
    }
    else{
      this.mostrar_guia = false;
      this.enviar_guia = false;
    }
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
  
  filtarPorNombre(){
    if(this.busquedaPorNombre == ''){
      this.productos = [...this.productos_iniciales];//this.productos_iniciales.filter(producto=>{return producto});  
    }else{
      this.productos = [...this.productos_iniciales];
      this.productos = this.productos.filter(producto =>producto.PRO_NOMBRE.toLowerCase().indexOf(this.busquedaPorNombre.toLowerCase()) > -1);
    }
    console.log(this.productos);
  }
  filtrarPorCategoria(){
    if(this.busquedaPorCategoria == ''){
      this.productos = [...this.productos_iniciales];//this.productos_iniciales.filter(producto=>{return producto});  
    }else{
      this.productos = [...this.productos_iniciales];
      this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaPorCategoria.toLowerCase()) > -1);
    }
    console.log(this.productos);
  }
  filtrarPorUnidadMedida(){
    if(this.busquedaPorUnidadDeMedida == ''){
      console.log(this.busquedaPorCategoria);
      this.filtrarPorCategoria();//this.productos = [...this.productos_iniciales]//this.productos_iniciales.filter(producto=>{return producto});  
    }else{
      this.productos = [...this.productos_iniciales];
      this.productos = this.productos.filter(producto =>producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(this.busquedaPorUnidadDeMedida.toLowerCase()) > -1);
    }
    console.log(this.productos);
  }

  agregarProducto(producto:Producto){
    this.productos_detalle.push(producto);
    this.productos.forEach( (element, index) => {
      if(element === producto){
        this.productos.splice(index,1);
        this.productos_iniciales.splice(index,1);
      } 

    });
    //Deshabilitar el select option de los proveedores
    console.log(this.productos_detalle);
    console.log(this.productos);
    console.log(this.productos_iniciales);
    this.id_proveedor.disable();
  }
  quitarProducto(producto:Producto,indice:any){
    this.productos.unshift(producto);
    this.productos_iniciales.unshift(producto);

    this.productos_detalle.forEach((element,index)=>{
      if(element === producto) 
        this.productos_detalle.splice(index,1);
      //Deshabilitar el select option de los proveedores y listar los productos si no hay nada en la tabla de detalles 
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



  registrarCompra(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    if(this.btnRegistroValido){
      if(this.enviar_guia){
        this.guia.GUIA_FECHA_EMISION = this.fecha_emision_guia.value;
        this.guia.GUIA_NRO_SERIE = this.serie_guia.value;
        this.guia.GUIA_NRO_COMPROBANTE = this.nro_comprobante_guia.value;
      }

      this.compra.COMPRA_FECHA_EMISION_COMPROBANTE = this.fecha_emision.value;
      this.compra.COMPRA_FECHA_REGISTRO = this.getTodayFecha();
      this.compra.COMPRA_NRO_SERIE =this.serie.value;
      this.compra.COMPRA_NRO_COMPROBANTE = this.nro_comprobante.value;
      this.compra.COMPRA_SUBTOTAL = this.TotalCompra;
      this.compra.COMPRA_TOTAL =this.TotalCompra;
      this.compra.COMPRA_DESCRIPCION ='Descripción vacía.';
      this.compra.USU_ID = +this.storageService.getString('USE_ID');
      this.compra.COMPROBANTE_ID = this.tipo_comprobante.value;
      this.compra.PROV_ID = this.id_proveedor.value;

      if(this.productos_detalle.length === this.cantidad_detalles.length && this.cantidad_detalles.length === this.importes.length){
        this.productos_detalle.forEach((element,index) => {
          this.detalle.PRO_ID = element.PRO_ID;
          this.detalle.DET_CANTIDAD = this.cantidad_detalles[index];
          this.detalle.DET_IMPORTE = this.importes[index]*100;
          this.detallesProducto.push(this.detalle);
          this.detalle = new DetalleProducto();
        });
      }
      console.log(this.productos_detalle);
      console.log(this.cantidad_detalles);
      console.log(this.importes);
      console.log(this.detallesProducto);
      this.compraService.registrarCompra(this.guia,this.compra,this.detallesProducto,this.enviar_guia).subscribe(
        data=>{
          // console.log(data);
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro de la compra se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.limpiar();
        },
        error=>{
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
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_ExistenciaDeComprobante'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El tipo de comprobante no es válido.';
            }else if(error.error.error === 'error_ExistenciaProveedorId'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. El proveedor seleccionado no es válido.';
            }else if(error.error.error === 'error_ExistenciaDeUsuario'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Hubo un problema al verificar el usuario.';
            }else if(error.error.error === 'error_ExistenciaProductoId'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Hubo un problema con la verificación de articulos.';
            }else if(error.error.error === 'error_ExistenciaCompraId'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. La compra no se pudo registrar.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }
  limpiar(){
    this.btnRegistroValido = false;
    this.listarProductoTabla = true;
    this.productos_detalle.splice(0,this.productos_detalle.length);
    this.detallesProducto.splice(0,this.detallesProducto.length);
    this.cantidad_detalles.splice(0,this.cantidad_detalles.length);
    this.importes.splice(0,this.importes.length);
    this.id_proveedor.enable();
    this.comprobanteForm.reset();
    this.guiaRemisionForm.reset();
  }
  inicializarFormulario(){
    this.comprobanteForm = this.formBuilder.group({
      id_proveedor:['',[Validators.required]],
      tipo_comprobante:['',[Validators.required]],
      serie:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(5)]],
      nro_comprobante:['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision:['',[Validators.required]]
    });
  }
  inicializarGuiaFormulario(){
    this.guiaRemisionForm = this.formBuilder.group({
      serie_guia :['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(5)]],
      nro_comprobante_guia :['',[Validators.required, Validators.pattern(/^([0-9])*$/), Validators.maxLength(10)]],
      fecha_emision_guia:['',[Validators.required]],
      flete:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]]
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
  get serie_guia() {
    return this.guiaRemisionForm.get('serie_guia');
  }
  get nro_comprobante_guia() {
    return this.guiaRemisionForm.get('nro_comprobante_guia');
  }
  get fecha_emision_guia(){
    return this.guiaRemisionForm.get('fecha_emision_guia');
  }
  get flete(){
    return this.guiaRemisionForm.get('flete');
  }
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }
  
}
