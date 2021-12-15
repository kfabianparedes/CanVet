import { Component,  ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {Categoria} from '../categoria/categoria.model';
import {Producto} from '../producto/producto.models';
import {CategoriaService} from '../categoria/categoria.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProductoService} from '../../services/producto.service';
import {ProveedorService} from '../../services/proveedor.service';
import { Proveedor } from '../proveedor/proveedor.models';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {


  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  productos:any[]=[];
  productos_iniciales: any[] = [];
  productoSeleccionado:Producto;
  constructor(private categoriaService:CategoriaService,
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    configModal: NgbModalConfig,
    private productoService:ProductoService,
    private proveedorService:ProveedorService,
    private storageService: StorageService) 
    { 
      configModal.backdrop = 'static';
      configModal.keyboard = false;
    }


  nombreCategoria:string;
  nombreProveedor:string;
  precioAnterior:number; 
  fechaAnterior:Date;

// Paginación
  currentPage = 1;
  itemsPerPage = 50;

  
  productoForm: FormGroup;
  productoInsertar = new Producto();
  
  
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta :string;
  

  //modal para editar un Producto
  @ViewChild('editarProducto') editarPro: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearProducto') crearPro: ElementRef;
  //modal para ver más de algún producto verProducto
  @ViewChild('verProducto') verMasPro: ElementRef;

  public USE_TYPE : string  = '';
  ngOnInit(): void {
    this.listarProductos();
    this.USE_TYPE = this.storageService.getString('USE_TYPE');
  }

  listarProveedores(){
    this.cargando = false;
    this.modalIn = true;
    this.proveedorService.listarProveedores().subscribe(
      (data)=>{
        this.proveedores = data['resultado'];
        this.cargando = false;
        this.modalIn = true;
      },
      (error) =>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = true;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
  abrirVerMasProducto(producto:any){
    this.mostrar_alerta = false;
    this.productoSeleccionado = producto;
    this.nombreCategoria = producto.CAT_NOMBRE;
    this.nombreProveedor = producto.PROV_EMPRESA_PROVEEDORA;
    this.precioAnterior = producto.PRO_PRECIO_ANTERIOR;
    this.fechaAnterior = producto.PRO_FECHA_CAMBIO_PRECIO;
    console.log(this.nombreCategoria);
    this.modal.open(this.verMasPro, {size: 'lg'});
  }
  abrirEditarProducto(producto:Producto) {
    this.mostrar_alerta = false;
    this.listarProveedores();
    this.listarCategorias();
    this.inicializarFormulario();
    console.log(producto);
    this.productoSeleccionado = producto;
    console.log( this.productoSeleccionado);
    this.nombreProducto.setValue(this.productoSeleccionado.PRO_NOMBRE);
    this.pVentaProducto.setValue(this.productoSeleccionado.PRO_PRECIO_VENTA);
    this.pCompraProducto.setValue(this.productoSeleccionado.PRO_PRECIO_COMPRA);
    this.tamnioTallaProducto.setValue(this.productoSeleccionado.PRO_TAMANIO_TALLA);
    this.stock.setValue(this.productoSeleccionado.PRO_STOCK);
    this.codigo.setValue(this.productoSeleccionado.PRO_CODIGO);
    this.categoria.setValue(this.productoSeleccionado.CAT_ID);
    this.proveedor.setValue(this.productoSeleccionado.PROV_ID);
    this.modal.open(this.editarPro, {size: 'lg'});
  }


  inicializarFormulario(){
    this.productoForm = this.formBuilder.group({
      nombreProducto:['',[Validators.required, Validators.maxLength(60)]],
      pVentaProducto:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
      pCompraProducto:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
      tamnioTallaProducto:['',[Validators.required, Validators.maxLength(60)]],
      categoria:['',[Validators.required]],
      proveedor:['',[Validators.required]],
      stock:['',[Validators.pattern('[0-9]*')]],
      codigo:['',[Validators.maxLength(60)]],
    });

  }
  get categoria() {
    return this.productoForm.get('categoria');
  }
  get proveedor() {
    return this.productoForm.get('proveedor');
  }
  get tamnioTallaProducto() {
    return this.productoForm.get('tamnioTallaProducto');
  }
  get stockProducto() {
    return this.productoForm.get('stockProducto');
  }
  get pCompraProducto() {
    return this.productoForm.get('pCompraProducto');
  }
  get pVentaProducto() {
    return this.productoForm.get('pVentaProducto');
  }
  get codigoProducto() {
    return this.productoForm.get('codigoProducto');
  }
  get nombreProducto() {
    return this.productoForm.get('nombreProducto');
  }
  get stock() {
    return this.productoForm.get('stock');
  }
  get codigo() {
    return this.productoForm.get('codigo');
  }
  resetForm(){
    this.productoForm.reset();
  }

  editarProductoFunc(){
    this.cargando = true;
    this.modalIn = true;
    this.mostrar_alerta = false;
    
    this.productoInsertar = new Producto();
    this.productoInsertar.PRO_ID = this.productoSeleccionado.PRO_ID;
    this.codigo.value.length<=0 || this.codigo.value ==  null || this.codigo.value == undefined?
    this.productoInsertar.PRO_CODIGO = ' ':
    this.productoInsertar.PRO_CODIGO = this.codigo.value;
    
    this.productoInsertar.PRO_STOCK = this.stock.value; 
    this.productoInsertar.PRO_TAMANIO_TALLA =  this.tamnioTallaProducto.value;
    this.productoInsertar.PRO_NOMBRE = this.nombreProducto.value;
    this.productoInsertar.PRO_PRECIO_VENTA = (+this.pVentaProducto.value * 1.00);
    this.productoInsertar.PRO_PRECIO_COMPRA = (+this.pCompraProducto.value * 1.00);
    this.productoInsertar.CAT_ID = +this.categoria.value;
    this.productoInsertar.PROV_ID = +this.proveedor.value;

    this.productoService.editarProductoSeleccionado(this.productoInsertar).subscribe(
      ()=>{
        this.cargando = false;
        this.modalIn = false;
        this.productoForm.reset();
        this.modal.dismissAll();
        this.mostrar_alerta = true; 
        this.tipo_alerta='success';
        this.mensaje_alerta = 'Solicitud realizada con éxito';
      },
      (error)=>{
        this.cargando = false;
        this.modalIn = true;
        this.mostrar_alerta = true; 
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if (error['error']['error'] === 'error_exitenciaId') {
            this.mensaje_alerta = 'El producto no existe.';
          }else if (error['error']['error'] === 'error_exitenciaCategoriaId') {
            this.mensaje_alerta = 'La categoría ingresada no existe.';
          }else if (error['error']['error'] === 'error_exitenciaProveedorId') {
            this.mensaje_alerta = 'El proveedor ingresado no existe.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }

  listarProductos(){
    this.cargando = true;
    this.modalIn = false;
    this.productoService.listarProductos().subscribe(
      (data)=>{
        this.productos_iniciales = data['resultado']; 
        this.productos = this.productos_iniciales.slice();
        this.cargando = false;
      },
      (error) =>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    ); 
  }
  listarCategorias(){
    this.cargando = true;
    this.modalIn = true;
    this.mostrar_alerta = false;
    this.categoriaService.listarCategoriasActivas().subscribe(
      (data)=>{
        this.categorias = data['resultado']; 
        this.cargando = false;
        this.modalIn = true;
      },
      (error) =>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = true;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }

  closeModal(): any {
    this.productoSeleccionado = null;
    this.productoForm.reset();
    this.modal.dismissAll();
  } 
  insertarProducto(producto:any){
    this.cargando = true;
    this.modalIn = true;
    this.mostrar_alerta = false;
    this.productoInsertar.PRO_STOCK = 0; 
    this.productoInsertar.PRO_TAMANIO_TALLA =  producto.tamnioTallaProducto;
    this.productoInsertar.PRO_NOMBRE = producto.nombreProducto;
    this.productoInsertar.PRO_PRECIO_VENTA = (+producto.pVentaProducto * 1.00);
    this.productoInsertar.PRO_PRECIO_COMPRA = (+producto.pCompraProducto * 1.00);
    this.productoInsertar.CAT_ID = +producto.categoria;
    this.productoInsertar.PROV_ID = +producto.proveedor;
    producto.codigo.length<=0 || this.codigo.value ==  null || this.codigo.value == undefined?
    this.productoInsertar.PRO_CODIGO = ' ':
    this.productoInsertar.PRO_CODIGO = producto.codigo;
    this.crearNuevoProducto();
  }

  habilitarInhabilitarProducto(PRO_ID:number,PRO_ESTADO:number){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    if(PRO_ESTADO == 1){
      PRO_ESTADO = 2; 
      this.mensaje_alerta = 'Se ha inhabilitado el proveedor satisfactoriamente.';
    }else{
      PRO_ESTADO =  1; 
      this.mensaje_alerta = 'Se ha habilitado el proveedor satisfactoriamente.'
    }
    this.productoService.habilitarDeshabilitarProducto(PRO_ID,PRO_ESTADO).subscribe(
      ()=>{
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true;
        this.modalIn = false;
        this.mensaje_alerta = 'Solicitud ejectuda con éxito.'; 
      },(error)=>{
        this.modalIn = false;
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if (error['error']['error'] === 'error_existenciaId') {
            this.mensaje_alerta = 'El producto seleccionado no existe.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      });
  } 


  crearNuevoProducto(){
    this.cargando = true;
    this.modalIn = true;
    this.mostrar_alerta = false;
    this.productoService.insertarProducto(this.productoInsertar).subscribe(
      ()=>{
        this.mensaje_alerta = 'Producto creado de forma exitosa.';
        this.mostrar_alerta = true;
        this.tipo_alerta = 'success';
        this.cargando = false;
        this.modalIn = false;
        this.closeModal();
      },error=>{
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
            this.mensaje_alerta = 'Hubo un error al registrar el producto. Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_exitenciaProveedorId'){
            this.mensaje_alerta = 'Hubo un error al registrar el producto (Hubo problemas al validar el proveedor). Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_exitenciaCategoriaId'){
            this.mensaje_alerta = 'Hubo un error al registrar el producto (Hubo problemas al validar la categoría). Por favor, actualice la página o inténtelo más tarde.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error en el servidor al registrar el producto. Por favor, actualice la página.';
        }
        
      }
      
    );
  }
  

  abrirCrearProducto() {
    this.listarProveedores();
    this.listarCategorias();
    this.inicializarFormulario();
    this.modal.open(this.crearPro, {size: 'lg'});
  }
  
  buscarProducto(){

  }


  /*************************** FILTRAR TABLA**************************************/
  tipoDeBusqueda: number = 0;

  busquedaProducto: string = '';
  busquedaCategoria: string = '';
  primeraBusqueda: boolean = true;

  filtrarProductoPorNombre(){
    this.currentPage = 1;
    this.productos = this.productos_iniciales.slice(); 
    if(this.busquedaCategoria.length == 0){
      this.productos = this.productos_iniciales.slice(); 
      this.productos = this.productos.filter(producto =>( this.tipoDeBusqueda == 0?producto.PRO_NOMBRE.toLowerCase():producto.PRO_CODIGO.toLowerCase() ).indexOf(this.busquedaProducto.toLowerCase()) > -1);
    }else if(this.busquedaCategoria.length > 0){
      if(this.busquedaProducto.length == 0){
        this.filtrarProductoPorCategoria(); 
      }else if(this.busquedaProducto.length > 0){
        this.productos = this.productos.filter(producto =>( this.tipoDeBusqueda == 0?producto.PRO_NOMBRE.toLowerCase():producto.PRO_CODIGO.toLowerCase() ).indexOf(this.busquedaProducto.toLowerCase()) > -1);
        this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaCategoria.toLowerCase()) > -1);
      }
    }
  }
  filtrarProductoPorCategoria(){
    this.currentPage = 1;
    if(this.primeraBusqueda){
      this.primeraBusqueda = false;
      if(this.busquedaCategoria.length == 0){
        this.filtrarProductoPorNombre();
      }else{
        if(this.busquedaProducto.length == 0){
          this.productos = this.productos_iniciales.slice(); 
          this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaCategoria.toLowerCase()) > -1);
        }else{
          this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaCategoria.toLowerCase()) > -1);
        }
      }
    }else if(!this.primeraBusqueda){
      if(this.busquedaCategoria.length==0){
        this.filtrarProductoPorNombre();
      }else{
        this.productos = this.productos_iniciales.slice(); 
        this.productos = this.productos.filter(producto =>( this.tipoDeBusqueda == 0?producto.PRO_NOMBRE.toLowerCase():producto.PRO_CODIGO.toLowerCase() ).indexOf(this.busquedaProducto.toLowerCase()) > -1);
        this.productos = this.productos.filter(producto =>producto.CAT_NOMBRE.toLowerCase().indexOf(this.busquedaCategoria.toLowerCase()) > -1);
      }
    }
    
  }

   /*********************** ORDENAMIENTO EN TABLA **********************/
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
      this.productos = this.productos_iniciales.slice();
    } else {
      this.productos = [...this.productos_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}
