import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Mascota } from 'src/app/models/mascota';
import { MascotaService } from 'src/app/services/mascota.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.component.html',
  styleUrls: ['./mascota.component.css']
})
export class MascotaComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;


  //Variables de cliente
  mascotas: any[] = [];
  mascotas_iniciales: any[] = [];
  busquedaMascota: string = '';

  //Paginacion de tabla
  currentPage = 1;
  itemsPerPage = 5;
  
  @ViewChild('crearMascotaModal') crearMascotaModal: ElementRef;
  @ViewChild('editarMascotaModal') editarMascotaModal: ElementRef;

  constructor(
    private mascotaService:MascotaService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private formBuilder: FormBuilder,
    ) { 
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'lg';
    }

  ngOnInit(): void {
    this.inicializarMascotaFormulario();
    this.listarMascotas();
  }
  closeModal(): any {
    this.modal.dismissAll();
    this.limpiar();
  }
  limpiar(){

  }
  listarMascotas(){
    this.cargando = true;
    this.modalIn = false;
    this.mascotaService.listarMascotas().subscribe(
      data=>{
        this.mascotas_iniciales = data['resultado'];
        this.mascotas = this.mascotas_iniciales.slice();
        this.cargando = false;
        console.log(data);
        console.log(this.mascotas);
        console.log(this.mascotas_iniciales);
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
  crearMascota(){
    this.modal.open(this.crearMascotaModal);
  }
  editarMascota(mascota: Mascota){
    this.modal.open(this.editarMascotaModal);
  }
  registrarMascota(){

  }
  
  borrarMascota(id:any){

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
      this.mascotas = this.mascotas_iniciales.slice();
    } else {
      this.mascotas = [...this.mascotas_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /**************************** REGISTRAR MASCOTA ********************************/
  mascotaForm : FormGroup;
  inicializarMascotaFormulario(){
    this.mascotaForm = this.formBuilder.group({
      nombre:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(45)]],
      raza:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(20)]],
      especie:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(20)]],
      color:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(20)]],
      tipo_cliente:['',[Validators.required]],
    });
  }
  get nombre() {
    return this.mascotaForm.get('nombre');
  } 
  get raza() {
    return this.mascotaForm.get('raza');
  } 
  get especie() {
    return this.mascotaForm.get('especie');
  } 
  get color() {
    return this.mascotaForm.get('color');
  } 
  get tipo_cliente() {
    return this.mascotaForm.get('tipo_cliente');
  } 
}
