import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Categoria} from '../categoria/categoria.model';
import {Producto} from '../producto/producto.models';
import {CategoriaService} from '../categoria/categoria.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProductoService} from '../../services/producto.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {


  categorias: Categoria[] = [];
  productos:any[]=[];
  productoSeleccionado:Producto;
  constructor(private categoriaService:CategoriaService,
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    configModal: NgbModalConfig,
    private productoService:ProductoService) 
    { 
      configModal.backdrop = 'static';
      configModal.keyboard = false;
    }

  carga = false; 
  productoForm: FormGroup;
  productoInsertar = new Producto();
  

  //modal para editar un Producto
  @ViewChild('editarProducto') editarPro: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearProducto') crearPro: ElementRef;


  ngOnInit(): void {
    this.listarProductos();
  }

  inicializarFormulario(){
    this.productoForm = this.formBuilder.group({
      nombreProducto:['',[Validators.required, Validators.maxLength(60)]],
      pVentaProducto:['',[Validators.required, Validators.maxLength(60)]],
      pCompraProducto:['',[Validators.required, Validators.maxLength(60)]],
      tamnioTallaProducto:['',[Validators.required, Validators.maxLength(60)]],
      categoria:['',[Validators.required]],
      
    });
    // this.productoForm = this.formBuilder.group({
    //   nombreProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   codigoProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   pVentaProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   pCompraProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   stockProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   tamnioTallaProducto:['',[Validators.required, Validators.maxLength(60)]],
    //   categoria:['',[Validators.required, Validators.maxLength(60)]],
      
    // });
  }
  get categoria() {
    return this.productoForm.get('categoria').value;
  }
  get tamnioTallaProducto() {
    return this.productoForm.get('tamnioTallaProducto').value;
  }
  get stockProducto() {
    return this.productoForm.get('stockProducto').value;
  }
  get pCompraProducto() {
    return this.productoForm.get('pCompraProducto').value;
  }
  get pVentaProducto() {
    return this.productoForm.get('pVentaProducto').value;
  }
  get codigoProducto() {
    return this.productoForm.get('codigoProducto').value;
  }
  get nombreProducto() {
    return this.productoForm.get('nombreProducto').value;
  }

  resetForm(){
    this.productoForm.reset();
  }

  listarProductos(){
    this.productoService.listarProductos().subscribe(
      data=>{
        this.productos = data['resultado']; 
        console.log(this.productos);
      },error=>{

      }
    ); 
  }
  listarCategorias(){
    
    this.categoriaService.listarCategorias().subscribe(data=>{
      
      this.categorias = data['resultado']; 
      console.log(this.categorias);
      this.carga = false;
    },error =>{
      this.carga = false;
    }
    );
  }

  closeModal(): any {
    this.productoForm.reset();
    this.modal.dismissAll();
  }
  insertarProducto(producto:any){
    
    this.productoInsertar.PRO_CODIGO = "FALTA";
    this.productoInsertar.PRO_STOCK = +"0";
    this.productoInsertar['PRO_TAMANIO_TALLA'] =  this.tamnioTallaProducto;
    this.productoInsertar.PRO_NOMBRE = this.nombreProducto;
    this.productoInsertar.PRO_CODIGO = "FALTA";
    this.productoInsertar.PRO_PRECIO_VENTA = +this.pVentaProducto;
    this.productoInsertar.PRO_PRECIO_COMPRA = +this.pCompraProducto;
    this.productoInsertar.CAT_ID = +this.categoria;
    console.log(this.productoInsertar);

    this.crearNuevoProducto();
  }

  crearNuevoProducto(){

    this.productoService.insertarProducto(this.productoInsertar).subscribe(
      data=>{
        console.log("Si insertó :D");
      },error=>{

      }
    );
  }
  abrirEditarProducto(producto:Producto) {
    this.inicializarFormulario();
    this.productoSeleccionado = producto;
    this.modal.open(this.editarPro, {size: 'lg'});
  }

  abrirCrearProducto() {
    this.listarCategorias();
    this.inicializarFormulario();
    this.modal.open(this.crearPro, {size: 'lg'});
  }

}
