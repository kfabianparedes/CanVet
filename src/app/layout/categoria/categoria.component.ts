import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Categoria} from '../categoria/categoria.model';
import {CategoriaService} from '../categoria/categoria.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {


  categorias: Categoria[] = [];
    constructor(private categoriaService:CategoriaService,
                private formBuilder: FormBuilder,
                public modal: NgbModal,
                configModal: NgbModalConfig) 
                { 
                  configModal.backdrop = 'static';
                  configModal.keyboard = false;
                  configModal.size = 'md'
                }
  carga = false; 
  modalIn = false; 
  cargaModal = false; 
  categoriaForm: FormGroup;
  tipoAlerta = "";
  mostrarAlerta = false;
  mensajeAlerta= "";  
  
  filtroTexto:string;
  categoriaSeleccionada:Categoria; 
  currentPage = 1;
  itemsPerPage = 5;

  //modal para editar una categoria
  @ViewChild('editarCategoria') editarCat: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearCategoria') crearCat: ElementRef;


  ngOnInit(): void {
    this.carga = true;
    this.listarCategorias();
    this.filtroTexto = '';
  }

  inicializarFormulario(){
    this.categoriaForm = this.formBuilder.group({
      nombreCategoria:['',[Validators.required, Validators.maxLength(60)]]
    });
  }
  
  
  insertarCategoria(){
    this.cargaModal = true;
    this.modalIn = true;
    this.categoriaService.crearCategoria(this.nombreCategoria.value).subscribe(data => {
      
      this.categoriaForm.reset();
      this.cargaModal = false;
      this.modal.dismissAll();  
      this.listarCategorias(); 
      this.tipoAlerta = 'success';
      this.mostrarAlerta = true; 
      this.mensajeAlerta = 'Se ha creado la categoría satisfactoriamente.';
    },error=>{
      this.cargaModal = false; 
      this.mostrarAlerta = true;
      this.tipoAlerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }else if(error.error.error === 'error_deCampo'){
          this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
        }else if (error['error']['error'] === 'error_exitenciaNombre') {
          this.mensajeAlerta = 'El nombre ingresado ya existe.';
        }
      }
      else{
        this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );

  }

  catUpdate(cat:Categoria){
    this.cargaModal = true;
    this.modalIn = true;
    this.categoriaService.editarCategoria(cat,this.nombreCategoria.value).subscribe(data => {
      this.categoriaForm.reset();
      this.cargaModal = false;
      this.modal.dismissAll();  
      this.listarCategorias(); 
      this.tipoAlerta = 'success';
      this.mostrarAlerta = true; 
      this.mensajeAlerta = 'Se ha actualizado la categoría satisfactoriamente.';
    },error=>{
      this.cargaModal = false; 
      this.mostrarAlerta = true;
      this.tipoAlerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }else if(error.error.error === 'error_deCampo'){
          this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
        }else if (error['error']['error'] === 'error_noExistenciaId') {
          this.mensajeAlerta = 'La categoría seleccionada no existe.';
        }else if (error['error']['error'] === 'error_exitenciaNombre') {
          this.mensajeAlerta = 'El nombre ingresado ya existe.';
        }
      }
      else{
        this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );
  }

  listarCategorias(){
    
    this.modalIn = false;
    this.categoriaService.listarCategorias().subscribe(data=>{
      
      this.categorias = data['resultado']; 
      console.log(this.categorias);
      this.carga = false;
    },error =>{
      this.carga = false;
      this.mostrarAlerta = true;
      this.tipoAlerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }
      }
      else{
        this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );
  }

  get nombreCategoria() {
    return this.categoriaForm.get('nombreCategoria');
  }

  habilitarInhabilitarCategoria(CAT_ID:number,CAT_ESTADO:number){
    this.carga = true;
    this.modalIn = false;
    
    if(CAT_ESTADO == 1){
      CAT_ESTADO = 2; 
      this.mensajeAlerta = 'Se ha inhabilitado la categoría satisfactoriamente.';
    }else{
      CAT_ESTADO =  1; 
      this.mensajeAlerta = 'Se ha habilitado la categoría satisfactoriamente.'
    }
    

    this.categoriaService.habilitarInhabilitarCategoria(CAT_ID,CAT_ESTADO).subscribe(data=>
      {
        this.listarCategorias();
        this.tipoAlerta = 'success';
        this.mostrarAlerta = true; 
      },error=>{
        this.carga = false;
        this.mostrarAlerta = true;
        this.tipoAlerta='danger';
        this.modalIn = false;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if (error['error']['error'] === 'error_noExistenciaId') {
            this.mensajeAlerta = 'La categoría seleccionada no existe no existe.';
          }
        }
        else{
          this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      });
  }
  closeModal(): any {
    this.mostrarAlerta = false; 
    this.categoriaForm.reset();
    this.modal.dismissAll();
  }
  
  abrirEditarCategoria(categoria:Categoria) {
    this.inicializarFormulario();
    this.categoriaSeleccionada = categoria;
    this.modal.open(this.editarCat);
  }

  abrirCrearCategoria() {
    this.inicializarFormulario();
    this.modal.open(this.crearCat);
  }

}
