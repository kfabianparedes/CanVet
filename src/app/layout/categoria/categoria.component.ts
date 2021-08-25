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
              }
  carga = false; 
  categoriaForm: FormGroup;
  
  categoriaSeleccionada:Categoria; 

  //modal para editar una categoria
  @ViewChild('editarCategoria') editarCat: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearCategoria') crearCat: ElementRef;


  ngOnInit(): void {
    this.carga = true;
    this.listarCategorias();
    
  }

  inicializarFormulario(){
    this.categoriaForm = this.formBuilder.group({
      nombreCategoria:['',[Validators.required, Validators.maxLength(60)]]
    });
  }
  

  insertarCategoria(){

    this.categoriaService.crearCategoria(this.nombreCategoria.value).subscribe(data => {
      this.categoriaForm.reset();
      this.modal.dismissAll();  
      this.listarCategorias(); 
    },error=>{

    }
    );

  }

  catUpdate(cat:Categoria){
    this.categoriaService.editarCategoria(cat,this.nombreCategoria.value).subscribe(data => {
      this.categoriaForm.reset();
      this.modal.dismissAll();  
      this.listarCategorias(); 
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

  get nombreCategoria() {
    return this.categoriaForm.get('nombreCategoria');
  }

  habilitarInhabilitarCategoria(CAT_ID:number,CAT_ESTADO:number){
    
    
    if(CAT_ESTADO == 1){
      CAT_ESTADO = 2; 
    }else{
      CAT_ESTADO =  1; 
    }
    
    this.categoriaService.habilitarInhabilitarCategoria(CAT_ID,CAT_ESTADO).subscribe(data=>
      {
        this.listarCategorias();
      },error=>{

      });
  }


  


  closeModal(): any {
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
