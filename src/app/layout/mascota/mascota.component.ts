import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';
import { Mascota } from 'src/app/models/mascota';
import { ClienteService } from 'src/app/services/cliente.service';
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
  itemsPerPage = 50;
  
  @ViewChild('crearMascotaModal') crearMascotaModal: ElementRef;
  @ViewChild('editarMascotaModal') editarMascotaModal: ElementRef;

  constructor(
    private mascotaService:MascotaService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private formBuilder: FormBuilder,
    private clienteService:ClienteService
    ) { 
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = true;
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
    this.mascotaForm.reset();
    this.clienteSeleccionado = 0;
    this.nombreCliente = 'Cliente';
    this.mascotaNueva = new Mascota();
    this.mascotaSeleccionada = new Mascota();
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
  
  /******************** REGISTRAR MASCOTA *************************/
  crearMascota(){
    this.modal.open(this.crearMascotaModal,{size:'xl'});
    this.listarClientes();
  }

  mascotaNueva: Mascota = new Mascota();
  registrarMascota(){
    
    if(this.clienteSeleccionado == 0){
      this.mostrar_alerta = true;
      this.modalIn = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'No ha seleccionado un cliente para registrar la mascota';
    }else{
      this.cargando = true;
      this.modalIn = true;
      this.mascotaNueva.CLIENTE_ID = this.clienteSeleccionado;
      this.mascotaNueva.MAS_ATENCIONES = this.atenciones.value;
      this.mascotaNueva.MAS_COLOR = this.color.value;
      this.mascotaNueva.MAS_ESPECIE = this.especie.value;
      this.mascotaNueva.MAS_NOMBRE = this.nombre.value;
      this.mascotaNueva.MAS_RAZA = this.raza.value;
      this.mascotaNueva.MAS_ESTADO = 1;
      this.mascotaNueva.MAS_TAMANIO = this.tamanio.value;
      this.mascotaNueva.MAS_GENERO = this.sexo;

      console.log(this.mascotaNueva);
      this.mascotaService.registrarMascota(this.mascotaNueva).subscribe(
        (data)=>{
          this.mostrar_alerta = true;
          this.modalIn = false;
          this.cargando = false;
          this.tipo_alerta = 'success';
          this.mensaje_alerta = 'Mascota registrada correctamente';
          this.limpiar();
          this.closeModal();
          this.listarMascotas();
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
              this.mensaje_alerta = 'Hubo un error al registrar la mascota, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_noExistenciaIdCliente'){
              this.mensaje_alerta = 'Hubo un error indentificando al cliente. Por favor, vuelva a intentarlo o actualice la página.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );

    }
    
  }
  /********************************* ACTUALIZAR MASCOTA *****************************/
  mascotaSeleccionada : Mascota = new Mascota();
  editarMascota(mascota: any){

    this.mascotaSeleccionada = mascota;

    this.inicializarMascotaFormulario();
    this.nombre.setValue(this.mascotaSeleccionada.MAS_NOMBRE);
    this.raza.setValue(this.mascotaSeleccionada.MAS_RAZA);
    this.especie.setValue(this.mascotaSeleccionada.MAS_ESPECIE);
    this.color.setValue(this.mascotaSeleccionada.MAS_COLOR);
    this.tamanio.setValue(this.mascotaSeleccionada.MAS_TAMANIO);
    this.mascotaSeleccionada.MAS_GENERO=='M'?this.sexo_.setValue("1"):this.sexo_.setValue("0");
    this.atenciones.setValue(this.mascotaSeleccionada.MAS_ATENCIONES);
    console.log(this.mascotaSeleccionada);
    this.modal.open(this.editarMascotaModal,{size:'lg'});
  }

  actualizarMascota(){
    this.mostrar_alerta = false;
    this.modalIn = true;
    this.cargando = true;
    this.mascotaSeleccionada.MAS_COLOR = this.color.value;
    this.mascotaSeleccionada.MAS_ESPECIE = this.especie.value;
    this.mascotaSeleccionada.MAS_NOMBRE = this.nombre.value;
    this.mascotaSeleccionada.MAS_RAZA = this.raza.value;
    this.mascotaSeleccionada.MAS_ATENCIONES = this.atenciones.value;
    this.sexo_.value == '1'?this.mascotaSeleccionada.MAS_GENERO='M':this.mascotaSeleccionada.MAS_GENERO='H';

    console.log(this.mascotaSeleccionada);
    this.mascotaService.actualizarMascota(this.mascotaSeleccionada).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.mostrar_alerta = true;
        this.mensaje_alerta = 'La mascota se actualizó correctamente.';
        this.tipo_alerta = 'success';
        this.modal.dismissAll();  
        this.listarMascotas();
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
            this.mensaje_alerta = 'Hubo un error al actualizar la mascota, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_noExistenciaIdCliente'){
            this.mensaje_alerta = 'Hubo un error indentificando al cliente. Por favor, vuelva a intentarlo o actualice la página.';
          }else if(error.error.error === 'error_noExistenciaIdMascota'){
            this.mensaje_alerta = 'Hubo un error indentificando a la mascota. Por favor, vuelva a intentarlo o actualice la página.';
          }
          
        }
        else{
          this.mensaje_alerta = 'Hubo un error al realizar las solicitud de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
  /********************************* DESACTIVAR MASCOTA  *****************************/
  cambiarEstadoMascota(id:number,estado:number){
    this.mostrar_alerta = false;
    this.modalIn = false;
    this.cargando = true;
    this.mascotaService.cambiarEstadoMascota(id,estado).subscribe(
      (data)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.mensaje_alerta = 'Se cambio el estado de la mascota correctamente.';
        this.tipo_alerta = 'success';
        this.modal.dismissAll();
        this.mascotaForm.reset(); 
        this.listarMascotas();
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
          } else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_ejecucionQuery'){
            this.mensaje_alerta = 'Hubo un error al actualizar la mascota, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_noExistenciaIdCliente'){
            this.mensaje_alerta = 'Hubo un error indentificando al cliente. Por favor, vuelva a intentarlo o actualice la página.';
          }else if(error.error.error === 'error_noExistenciaIdMascota'){
            this.mensaje_alerta = 'Hubo un error indentificando a la mascota. Por favor, vuelva a intentarlo o actualice la página.';
          }
          
        }
        else{
          this.mensaje_alerta = 'Hubo un error al realizar las solicitud de esta página. Por favor, actualice la página.';
        }
      }
    );
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

  /**************************** FORMULARIO MASCOTA ********************************/
  mascotaForm : FormGroup;
  inicializarMascotaFormulario(){
    this.mascotaForm = this.formBuilder.group({
      nombre:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(45)]],
      raza:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(30)]],
      especie:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(20)]],
      color:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(45)]],
      tamanio:['',[Validators.required]],
      sexo_ : [''],
      atenciones:[0,[Validators.required]]
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
  get tamanio() {
    return this.mascotaForm.get('tamanio');
  } 
  get sexo_() {
    return this.mascotaForm.get('sexo_');
  } 
  get atenciones() {
    return this.mascotaForm.get('atenciones');
  } 
  sexo : string = 'M';
  obtenerSexo(sexo: string) {
    this.sexo = sexo;
  } 

  /******************** LISTAR CLIENTES *******************/
  clientes: Cliente[] = [];
  clientes_iniciales: any[]=[];
  busquedaCliente: string = '';

  listarClientes(){
    this.cargando = true;
    this.modalIn = true;
    this.clienteService.listarClientesTotales().subscribe(
      (data)=>{
        
        this.clientes_iniciales = data['resultado'];
        this.clientes = this.clientes_iniciales.slice();
        this.cargando = false;
        console.log(data);
        console.log(this.clientes_iniciales);
        console.log(this.clientes);
      },
      (error)=>{
        this.modalIn = true;
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

  /********************** ORDENAMIENTO DE TABLA CLIENTES ***********************/
  
  onSorted({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.clientes = this.clientes_iniciales.slice();
    } else {
      this.clientes = [...this.clientes_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /*********************** AGREGAR CLIENTE (DUEÑO DE MASCOTA) ****************************/
  clienteSeleccionado:number = 0;
  nombreCliente:string = 'Cliente';
  agregarCliente(cliente:Cliente){
    console.log(cliente);
    this.clientes.forEach(client=>{
      if(client == cliente){
        this.clienteSeleccionado = client.CLIENTE_ID;
        this.nombreCliente = client.CLIENTE_NOMBRES;
      }
    })
    console.log(this.clienteSeleccionado);
  }
  /********************* FILTRAR CLIENTE***********************/
  currentPageModal = 1;
  itemsPerPageModal = 50;
  filtrarCliente(){
    this.currentPageModal = 1;
    this.clientes = this.clientes_iniciales.slice(); 
    if(this.busquedaCliente == ''){
      this.clientes = this.clientes = this.clientes_iniciales.slice();   
    }else{
      this.clientes = this.clientes = this.clientes_iniciales.slice(); 
      this.clientes = this.clientes.filter(cliente =>cliente.CLIENTE_NOMBRES.toLowerCase().indexOf(this.busquedaCliente.toLowerCase()) > -1);
    }
  }

}
