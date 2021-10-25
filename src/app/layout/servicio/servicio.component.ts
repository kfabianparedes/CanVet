import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from 'src/app/models/servicio';
import { TipoServicio } from 'src/app/models/tipo-servicio';
import { MascotaService } from 'src/app/services/mascota.service';
import { TipoServicioService } from 'src/app/services/tipoServicio.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  //variable de fecha
  opacarFecha: boolean = true;
  
  
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private mascotaService:MascotaService,
    private servicioService:ServicioService,
    private tipoServicioService:TipoServicioService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
  ) {
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }

  ngOnInit(): void {
    this.listarMascotas();
    this.listarServicios();
    this.inicializarServicioFormulario();
    this.inicializarCitaFormulario();
  }

  //******************INGRESAR DATOS REGISTRO SERVICIO ********************/
  servicioForm : FormGroup;
  inicializarServicioFormulario(){
    this.servicioForm = this.formBuilder.group({
      servicio:['',[Validators.required]],
      modalidad:['',[Validators.required]],
      descripcion:['',[Validators.maxLength(200),Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$')]],
      precio:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
    });
  }

  //getters & setters
  get servicio() {
    return this.servicioForm.get('servicio');
  }
  get modalidad() {
    return this.servicioForm.get('modalidad');
  }
  get descripcion() {
    return this.servicioForm.get('descripcion');
  }
  get precio(){
    return this.servicioForm.get('precio');
  }
 
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }

  /*************************** LISTAR MASCOTAS ****************************/
  mascotas: any[] = [];

  listarMascotas(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    this.mascotaService.listarMascotas().subscribe(
      (data)=>{
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

  /************************** LISTAR TIPO SERVICIOS **********************************/
  tiposServicios: TipoServicio[] = [];
  listarServicios(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    this.tipoServicioService.listarTipoServicio().subscribe(
      (data)=>{
        this.tiposServicios = data['resultado'];
        this.cargando = false;
        console.log(this.tiposServicios);
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

  /*************************** BUSCAR MASCOTA *************************/
  @ViewChild('buscarMascotaModal') buscarMascotaModal: ElementRef;
  //Variables de cliente
  mascotas_iniciales: any[] = [];
  busquedaMascota: string = '';
  mascota_seleccionada: any;
  nombre_mascota_seleccionada:string = '';
  //Paginacion de tabla
  currentPage = 1;
  itemsPerPage = 5;

  abrirBusqueda(){
    this.modal.open(this.buscarMascotaModal,{size:'xl'});
  }
  agregarMascota(mascota:any){
    this.mascota_seleccionada = mascota;
    this.nombre_mascota_seleccionada = this.mascota_seleccionada.MAS_NOMBRE;
    // this.mascota.setValue(mascota.MAS_ID); 
    console.log(mascota.MAS_ID);
    console.log(this.mascota_seleccionada);
  }
  /************************** REGISTRAR SERVICIO ****************************/
  //variable servicio
  servicioInsertar = new Servicio();
  registrarServicio(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    this.convertirFormt24AFormat12();
    this.servicioInsertar.MASCOTA_ID = +this.mascota_seleccionada.MAS_ID;
    this.servicioInsertar.TIPO_SERVICIO_ID = +this.servicio.value; 
    this.servicioInsertar.SERVICIO_DESCRIPCION = this.descripcion.value;
    this.servicioInsertar.SERVICIO_PRECIO = (+this.precio.value * 100); 
    this.servicioInsertar.HORA_SERVICIO = this.HORA_SERVICIO;
    this.servicioInsertar.SERVICIO_FECHA_HORA = this.fecha.value; 
    this.servicioInsertar.SERVICIO_TIPO = +this.modalidad.value; 
    
    console.log(this.servicioInsertar);
    this.servicioService.registrarServicio(this.servicioInsertar).subscribe(
      (data)=>{
        console.log(data);
        this.cargando = false;
        this.mostrar_alerta = true;
        this.modalIn = false;
        this.tipo_alerta='success';
        this.mensaje_alerta = 'El servicio fue registrado exitosamente';
      },
      (error)=>{
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
            this.mensaje_alerta = 'Hubo un error al registrar el servicio, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaDeTipoServicio'){
            this.mensaje_alerta = 'Hubo un error al identificar el servicio registrado, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaDeMascota'){
            this.mensaje_alerta = 'Hubo un error al identificar a la mascota, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_conflictoHorarios'){
            this.mensaje_alerta = 'Hay conflicto de horarios al intentar registrar el servicio.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al registrar la información del servicio. Por favor, vuelva a intentarlo.';
        }
      }
    );
  }

  /********************** ORDENAMIENTO DE TABLA ARTICULOS ***********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  closeModal(): any {
    this.modal.dismissAll();
    this.limpiar();
  }
  limpiar(){
    
  }
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

  /****************** CREAR CITAS ******************/
  citaForm : FormGroup;
  HORA_SERVICIO: string = '';
  inicializarCitaFormulario(){
    this.citaForm = this.formBuilder.group({
      hora:['',[Validators.required]],
      fecha:['',[Validators.required]]
    });
  }

  //getters & setters
  get hora() {
    return this.citaForm.get('hora');
  }
  get fecha() {
    return this.citaForm.get('fecha');
  }

  seconds: boolean = true; // Es para habilitar la casilla de los segundos
  meridian: boolean = true; // Es para activar el boton AM o PM

  convertirFormt24AFormat12(){
    let AMPM = ' AM';
    let hora =  this.citaForm.get('hora').value.hour;
    let horaF = this.citaForm.get('hora').value.hour;
    let minuto = this.citaForm.get('hora').value.minute; 
    let segundo = this.citaForm.get('hora').value.second;

    
    if (hora >= 13) {
      hora = hora - 12;
      if(hora<= 9){
        hora = '0' + hora;
      }
      AMPM = ' PM';
    } else if (hora < 10  ) {
      hora = '0' + hora;
    } else if (hora == 12){
      AMPM = ' PM';
    }
    
    horaF = horaF < 10 ? "0" + horaF : horaF;
    minuto = minuto < 10 ? "0" + minuto : minuto;
    segundo = segundo < 10 ? "0" + segundo : segundo;
    
    this.HORA_SERVICIO = horaF + ":" + minuto + ":" + segundo;
  }
}
