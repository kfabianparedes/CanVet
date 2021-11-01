import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from 'src/app/models/servicio';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;


  //Paginacion de tabla
  currentPage = 1;
  itemsPerPage = 5;
  constructor(
    private servicioService:ServicioService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,) {
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
     }

  ngOnInit(): void {
    this.listarServiciosPendientes();
    this.inicializarCitaFormulario();
  }

  /****************** LISTAR SERVICIOS PENDIENTES **************/
  servicios_pendientes: any[] = [];

  listarServiciosPendientes(){
    this.cargando = true;
    this.modalIn = false;
    this.servicioService.listarServiciosPendientes().subscribe(
      (data)=>{
        this.servicios_pendientes = data['resultado'];
        this.cargando = false;
        console.log(data);
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

  /***************************** POSTERGAR CITA ********************** **********/
  @ViewChild('postergarServicioModal') postergarServicioModal: ElementRef;
  closeModal(): any {
    this.modal.dismissAll();
    this.citaForm.reset();
  }
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

  postergarServicio(servicio:Servicio){
    this.modal.open(this.postergarServicioModal,{size:'md'});
    this.servicioModificado = servicio;
    console.log(this.servicioModificado);
  }

  seconds: boolean = true; // Es para habilitar la casilla de los segundos
  meridian: boolean = true; // Es para activar el boton AM o PM

  convertirFormt24AFormat12(){
    let AMPM = ' AM';
    let hora =  this.hora.value.hour;
    let horaF = this.hora.value.hour;
    let minuto = this.hora.value.minute; 
    let segundo = this.hora.value.second;

    
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

  servicioModificado: any;
  servicioPostergado: Servicio = new Servicio();
  guardarReprogramacion(){
    this.convertirFormt24AFormat12();
    this.servicioPostergado.SERVICIO_ID = this.servicioModificado.SERVICIO_ID;
    this.servicioPostergado.SERVICIO_PRECIO = this.servicioModificado.SERVICIO_PRECIO;
    this.servicioPostergado.TIPO_SERVICIO_ID = this.servicioModificado.TIPO_SERVICIO_ID;
    this.servicioPostergado.SERVICIO_TIPO =this.servicioModificado.SERVICIO_TIPO;
    this.servicioPostergado.SERVICIO_FECHA_HORA = this.fecha.value;
    this.servicioPostergado.HORA_SERVICIO = this.HORA_SERVICIO;
    this.servicioPostergado.MASCOTA_ID = this.servicioModificado.MASCOTA_ID;
    this.servicioPostergado.SERVICIO_ADELANTO = this.servicioModificado.SERVICIO_ADELANTO;
    this.servicioPostergado.MDP_ID  = this.servicioModificado.MDP_ID ;
    console.log(this.servicioPostergado);
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    this.servicioService.postergarServicio(this.servicioPostergado).subscribe(
      (data)=>{
        console.log(data);
        this.cargando = false;
        this.mostrar_alerta = true;
        this.mensaje_alerta = 'Se ha modificado la hora de la cita correctamente.';
        this.modalIn = false;
        this.tipo_alerta = 'success';
        this.listarServiciosPendientes();
        this.closeModal();
      }
      ,(error)=>{
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
            this.mensaje_alerta = 'Hubo un error al registrar el servicio, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaDeTipoServicio'){
            this.mensaje_alerta = 'Hubo un error al identificar el servicio a postergar, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaDeMascota'){
            this.mensaje_alerta = 'Hubo un error al identificar a la mascota, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_conflictoHorarios'){
            this.mensaje_alerta = 'Hay conflicto de horarios al intentar registrar el servicio.';
          }else if(error.error.error === 'error_NoExistenciaServicio '){
            this.mensaje_alerta = 'Hubo un error al identificar el servicio que se quiere postergar, Por favor, actualice la página o inténtelo más tarde.';
          }  
        }
        else{
          this.mensaje_alerta = 'Hubo un error al registrar la información del servicio. Por favor, vuelva a intentarlo.';
        }
      }
    )
  }

  /********************** TERMINAR SERVICIO ***********************/
  terminarServicio(idServicio:number){
    this.cargando = true;
    this.mostrar_alerta = false;
    this.modalIn = false;
    this.servicioService.culminarServicio(idServicio).subscribe(
      (data)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.modalIn = false;
        this.tipo_alerta = 'success';
        this.mensaje_alerta = 'El servicio ha culminado de forma correcta.';
        this.listarServiciosPendientes();
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
            this.mensaje_alerta = 'Hubo un error al identificar el servicio. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_ejecucionQuery'){
            this.mensaje_alerta = 'Hubo un error al culminar el servicio, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaServicio'){
            this.mensaje_alerta = 'Hubo un error al identificar el servicio, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_servicioTerminado'){
            this.mensaje_alerta = 'Hubo un error al terminar el servicio, ya está terminado. Por favor, actualice la página o inténtelo más tarde.';
          }

          
        }
        else{
          this.mensaje_alerta = 'Hubo un error al terminar el servicio. Por favor, vuelva a intentarlo.';
        }
      }
    )
  }

  /******************** FECHA  ***************************/
  //variable de fecha
  opacarFecha: boolean = true;
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }

  /***************BUSQUEDA SERVICIOS **************************/
  busquedaServicio:string = '';
}
