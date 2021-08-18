import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import {Categoria} from '../categoria/categoria.model';
import {CategoriaService} from '../categoria/categoria.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {


  categorias: Categoria[] = [];
  constructor(private categoriaService:CategoriaService,
              public modal: NgbModal,
              configModal: NgbModalConfig) 
              { 
                configModal.backdrop = 'static';
                configModal.keyboard = false;
              }

  //modal para editar una categoria
  @ViewChild('editarCategoria') editarCat: ElementRef;
  //modal para crear una categoria
  @ViewChild('crearCategoria') crearCat: ElementRef;


  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(){
    this.categoriaService.listarCategorias().subscribe(data=>{
      
      this.categorias = data['resultado']; 
      console.log(this.categorias);
    },error =>{

    }
    );
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
    this.modal.dismissAll();
  }
  
  abrirEditarCategoria() {
    this.modal.open(this.editarCat);
  }

}
