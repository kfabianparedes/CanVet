import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Comprobante } from 'src/app/models/comprobante.model';
import { MetodoPago } from 'src/app/models/metodo-pago';
import { Servicio } from 'src/app/models/servicio';
import { TipoServicio } from 'src/app/models/tipo-servicio';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { StorageService } from 'src/app/services/storage.service';
import { TipoServicioService } from 'src/app/services/tipoServicio.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

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
  currentPageCard = 1;
  itemsPerPageCard = 6;
  USE_TYPE: string;
  constructor(
    private servicioService:ServicioService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private formBuilder: FormBuilder,
    private storageService:StorageService,
    private tipoServicioService:TipoServicioService,
    private metodoPago:MetodoPagoService,
    private comprobanteService:ComprobanteService,
    private mascotaService:MascotaService,
    private datePipe: DatePipe,) {
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
    }

  ngOnInit(): void {
    this.listarServiciosPendientes();
    this.inicializarCitaFormulario();
    this.listarServicios();
    this.inicializarServicioFormulario();
    this.listarComprobantes();
    this.listarMetodoPago();
    this.USE_TYPE = this.storageService.getString('USE_TYPE');
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
      hora_:['',[Validators.required]],
      fecha_:['',[Validators.required]]
    });
  }

  //getters & setters
  get hora_() {
    return this.citaForm.get('hora_');
  }
  get fecha_() {
    return this.citaForm.get('fecha_');
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
    let hora =  this.hora_.value.hour;
    let horaF = this.hora_.value.hour;
    let minuto = this.hora_.value.minute; 
    let segundo = this.hora_.value.second;

    
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
    this.servicioPostergado.SERVICIO_FECHA_HORA = this.fecha_.value;
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

  /************** EDITAR SERVICIO  ************************/
  SERVICIO_ID: number;
  @ViewChild('editarServicioModal') editarServicioModal: ElementRef;
  editarServicio(servicio:any){
    console.log(servicio);
    //  servicio.MASCOTA_ID;
    this.mascota_seleccionada= {
      MASCOTA_ID: servicio.MAS_ID
    };
    this.SERVICIO_ID = servicio.SERVICIO_ID;
    this.servicio.setValue(servicio.TIPO_SERVICIO_ID);
    this.forma_pago.setValue(servicio.MDP_ID);
    this.precio.setValue(servicio.SERVICIO_PRECIO);
    this.descripcion.setValue(servicio.SERVICIO_DESCRIPCION);
    this.modalidad.setValue(servicio.SERVICIO_TIPO);
    this.tipo_comprobante.setValue(servicio.COMPROBANTE_ID);
    this.mascota_id_seleccionada = servicio.MAS_ID;
    this.nombre_mascota_seleccionada = servicio.MAS_NOMBRE;
    this.adelanto.setValue(servicio.SERVICIO_ADELANTO);
    this.listarMascotas();
    this.modal.open(this.editarServicioModal,{size:'lg'});
  }


  /***************** ACTUALIZAR SERVICIO *****************/
  servicioForm : FormGroup;
  inicializarServicioFormulario(){
    this.servicioForm = this.formBuilder.group({
      servicio:['',[Validators.required]],
      modalidad:['',[Validators.required]],
      descripcion:['',[Validators.maxLength(200),Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$')]],
      precio:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
      adelanto:[0.00,[Validators.pattern('[0-9]+[.]?[0-9]*')]],
      forma_pago:['',[Validators.required]],
      tipo_comprobante:['',[Validators.required]],
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
  get adelanto(){
    return this.servicioForm.get('adelanto');
  }
  get forma_pago(){
    return this.servicioForm.get('forma_pago');
  }
  get tipo_comprobante(){
    return this.servicioForm.get('tipo_comprobante');
  }
  get hora() {
    return this.servicioForm.get('hora');
  }
  get fecha() {
    return this.servicioForm.get('fecha');
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

  /********************** LISTAR METODOS DE PAGO ***********************/
  metodos_pago: MetodoPago[]=[];
  
  listarMetodoPago(){
    this.cargando = true;
    this.modalIn = false;
    this.metodoPago.listarMetodosDePago().subscribe(
      (data)=>{
        this.metodos_pago = data['resultado'];
        this.cargando = false;
      },(error)=>{
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

  /*********************************LISTAR DATOS NECESARIOS **********************/
  comprobantes: Comprobante[] = [];
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

  /*************************** BUSCAR MASCOTA *************************/
  @ViewChild('buscarMascotaModal') buscarMascotaModal: ElementRef;
  //Variables de cliente
  mascotas_iniciales: any[] = [];
  mascota_seleccionada :any

  nombre_mascota_seleccionada:string = '';
  //Paginacion de tabla
  currentPage = 1;
  itemsPerPage = 5;

  tipo_cliente : number = -1;
  abrirBusqueda(){
    this.nombre_mascota_seleccionada = '';

    if(this.tipo_comprobante.value!=1 && this.tipo_comprobante.value!=2){
      this.mostrar_alerta = true;
      this.tipo_alerta='danger';
      this.modalIn = false;
      this.mensaje_alerta = 'Debe de seleccionar el tipo de comprobante. Por favor, vuelva a intentarlo.';
    }else{
      //TIPO DE COMPROBANTE 1 (FACTURA) ES PARA CLIENTE JURIDICO (TIPO CLIENTE => 1)
      //TIPO DE COMPROBANTE 2 (BOLETA) ES PARA CLIENTE NATURAL (TIPO CLIENTE => 0)
      if(this.tipo_comprobante.value == 1){ //FACTURA TIENE QUE SE JURIDICO
        this.tipo_cliente = 1; //Juridico
      }else{
        this.tipo_cliente = 0; // natural
      }
      this.modal.open(this.buscarMascotaModal,{size:'xl'});
    }
    
  }
  mascota_id_seleccionada: number = 0;
  agregarMascota(mascota:any){
    if((mascota.TIPO_CLIENTE == 1 && this.tipo_comprobante.value == 1) || (mascota.TIPO_CLIENTE == 0 && this.tipo_comprobante.value == 2) ){
      this.mascota_seleccionada = mascota;
      this.mascota_id_seleccionada = mascota.MAS_ID;
      this.nombre_mascota_seleccionada = this.mascota_seleccionada.MAS_NOMBRE;
      console.log(mascota.MAS_ID);
      console.log(this.mascota_seleccionada); 
    }else{
      this.mensaje_alerta = 'El cliente no puede emitir ese tipo de comprobante.'
      this.mostrar_alerta = true;
      this.tipo_alerta = 'danger';
      this.modalIn = true;
    }
  }
  /***************** ADELANTAR SERVICIO **********/
  adelantoError: boolean = false;
  monto_adelantado: number = 0; 
  adelantarDinero(adelanto:any){
    console.log(adelanto);
    this.modalIn = true;
    this.monto_adelantado = +adelanto;
    if(+adelanto>+this.precio.value){
      this.mensaje_alerta = 'El adelanto no puede ser mayor que el precio del servicio';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.adelantoError = true;
    }else{
      this.mostrar_alerta = false;
      this.adelantoError = false;
    }
  }


   /*************************** LISTAR MASCOTAS ****************************/
  mascotas: any[] = [];

  listarMascotas(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    this.mascotaService.listarMascotasActivas().subscribe(
      (data)=>{
        this.mascotas_iniciales = data['resultado'];
        this.mascotas_iniciales =
        this.mascotas = this.mascotas_iniciales.slice();
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

  /*************************** FILTRAR TABLA**************************************/
  busquedaMascota: string = '';
  busquedaCliente: string = '';
  primeraBusqueda: boolean = true;

  filtrarMascotaPorNombre(){
    this.currentPage = 1;
    this.mascotas = this.mascotas_iniciales.slice(); 
    if(this.busquedaCliente.length == 0){
      this.mascotas = this.mascotas_iniciales.slice(); 
      this.mascotas = this.mascotas.filter(mascota =>mascota.MAS_NOMBRE.toLowerCase().indexOf(this.busquedaMascota.toLowerCase()) > -1);
    }else if(this.busquedaCliente.length > 0){
      if(this.busquedaMascota.length == 0){
        this.filtrarMascotaPorCliente(); 
      }else if(this.busquedaMascota.length > 0){
        this.mascotas = this.mascotas.filter(mascota =>mascota.MAS_NOMBRE.toLowerCase().indexOf(this.busquedaMascota.toLowerCase()) > -1);
        this.mascotas = this.mascotas.filter(mascota =>mascota.CLIENTE_NOMBRES.toLowerCase().indexOf(this.busquedaCliente.toLowerCase()) > -1);
      }
    }
  }
  filtrarMascotaPorCliente(){
    this.currentPage = 1;
    if(this.primeraBusqueda){
      this.primeraBusqueda = false;
      if(this.busquedaCliente.length == 0){
        this.filtrarMascotaPorNombre();
      }else{
        if(this.busquedaMascota.length == 0){
          this.mascotas = this.mascotas_iniciales.slice(); 
          this.mascotas = this.mascotas.filter(mascota =>mascota.CLIENTE_NOMBRES.toLowerCase().indexOf(this.busquedaCliente.toLowerCase()) > -1);
        }else{
          this.mascotas = this.mascotas.filter(mascota =>mascota.CLIENTE_NOMBRES.toLowerCase().indexOf(this.busquedaCliente.toLowerCase()) > -1);
        }
      }
    }else if(!this.primeraBusqueda){
      if(this.busquedaCliente.length==0){
        this.filtrarMascotaPorNombre();
      }else{
        this.mascotas = this.mascotas_iniciales.slice(); 
        this.mascotas = this.mascotas.filter(mascota =>mascota.MAS_NOMBRE.toLowerCase().indexOf(this.busquedaMascota.toLowerCase()) > -1);
        this.mascotas = this.mascotas.filter(mascota =>mascota.CLIENTE_NOMBRES.toLowerCase().indexOf(this.busquedaCliente.toLowerCase()) > -1);
      }
    }
    
  }

  /********************** ORDENAMIENTO DE TABLA MASCOTAS ***********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  closeModalMascota(): any {
    this.busquedaMascota = '';
    this.busquedaCliente = '';
    this.mascotas = this.mascotas_iniciales.slice(); 
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
      this.mascotas = this.mascotas_iniciales.slice().sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /******************** ACTUALIZAR SERVICIO ********************/
  servicioActualizar = new Servicio();
  actualizarServicio(){
    this.cargando = true;
    this.modalIn = true;
    this.servicioActualizar.MASCOTA_ID = +this.mascota_id_seleccionada;
    this.servicioActualizar.MDP_ID = this.forma_pago.value;
    if(this.adelanto.value == 0 || this.adelanto.value == undefined || this.adelanto.value == null){
      this.servicioActualizar.SERVICIO_ADELANTO = 0;
    }else{
      this.servicioActualizar.SERVICIO_ADELANTO = this.adelanto.value;
    }
    this.servicioActualizar.SERVICIO_ID = this.SERVICIO_ID;
    this.servicioActualizar.SERVICIO_PRECIO = this.precio.value; 
    this.servicioActualizar.SERVICIO_TIPO = +this.modalidad.value;
    this.servicioActualizar.TIPO_SERVICIO_ID = +this.servicio.value; 
    this.servicioActualizar.COMPROBANTE_ID = +this.tipo_comprobante.value;
    console.log(this.servicioActualizar);
    this.servicioService.actualizarServicioAdmin(this.servicioActualizar).subscribe(
      (data)=>{
        console.log(data);
        this.cargando = false;
        this.modalIn = false;
        this.tipo_alerta = 'success';
        this.mensaje_alerta = 'Servicio modificado con éxito.';
        this.listarServiciosPendientes();
        this.closeModal();
      },(error)=>{
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
          }else if(error.error.error === 'error_NoExistenciaDeComprobante'){
            this.mensaje_alerta = 'Hubo un error al identificar el tipo de comprobante, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_NoExistenciaServicio '){
            this.mensaje_alerta = 'Hubo un error al identificar el servicio que se quiere postergar, Por favor, actualice la página o inténtelo más tarde.';
          }  
        }
        else{
          this.mensaje_alerta = 'Hubo un error al registrar la información del servicio. Por favor, vuelva a intentarlo.';
        }
      }
    );
    
  }
}
