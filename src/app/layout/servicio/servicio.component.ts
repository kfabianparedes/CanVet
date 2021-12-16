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
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { MetodoPago } from 'src/app/models/metodo-pago';
import { StorageService } from 'src/app/services/storage.service';
import { ComprobanteService } from 'src/app/services/comprobante.service';
import { Comprobante } from 'src/app/models/comprobante.model';
import { Empresa } from 'src/app/models/empresa';
import { DatosJuridicos } from 'src/app/models/datos-juridicos';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente';
import { Mascota } from 'src/app/models/mascota';

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
    private storageService:StorageService,
    private comprobanteService:ComprobanteService,
    private metodoPago:MetodoPagoService,
    private empresaService:EmpresaService,
    private clienteService:ClienteService,
  ) {
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }

  ngOnInit(): void {
    this.listarMascotas();
    this.listarServicios();
    this.listarMetodoPago();
    this.listarComprobantes();
    this.listarEmpresas();
    this.inicializarServicioFormulario();
    this.inicializarMascotaFormulario();
  }

  //******************INGRESAR DATOS REGISTRO SERVICIO ********************/
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
      hora:['',[Validators.required]],
      fecha:['',[Validators.required]]
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
    this.cargando = true;
    this.modalIn = false;
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
  mascota_seleccionada: any;
  nombre_mascota_seleccionada:string = '';
  //Paginacion de tabla
  currentPage = 1;
  itemsPerPage = 5;

  tipo_cliente : number = -1;
  abrirBusqueda(){
    this.mascota_seleccionada = null;
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
      this.modalIn = false;
    }
  }
  /************************** REGISTRAR SERVICIO ****************************/
  //variable servicio
  servicioInsertar = new Servicio();
  registrarServicio(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    if(this.storageService.hasKey('OPEN_CODE') && this.storageService.hasKey('OPEN_ID')){
      this.servicioService.registrarServicio(this.servicioInsertar).subscribe(
        (data)=>{
          console.log(data);
          this.cargando = false;
          this.mostrar_alerta = true;
          this.modalIn = false;
          this.tipo_alerta='success';
          this.mensaje_alerta = 'El servicio fue registrado exitosamente';
          this.limpiar();
          this.closeModal();
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
              this.mensaje_alerta = 'Hubo un error al registrar el servicio, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_NoExistenciaDeTipoServicio'){
              this.mensaje_alerta = 'Hubo un error al identificar el servicio registrado, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_NoExistenciaDeMascota'){
              this.mensaje_alerta = 'Hubo un error al identificar a la mascota, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_conflictoHorarios'){
              this.mensaje_alerta = 'Hay conflicto de horarios al intentar registrar el servicio.';
            }else if(error.error.error === 'error_NoExistenciaDeUsuario'){
              this.mensaje_alerta = 'Hubo un error al identificar al trabajador. Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_ComprobanteTipoCliente'){
              this.mensaje_alerta = 'Hubo un error al crear el servicio, el tipo de comprobante depende del tipo de cliente. Por favor, vuelva a intentarlo. ';
            }else if(error.error.error === 'error_NoCajaAbierta'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Tiene que abrir la caja para poder realizar un servicio.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al registrar la información del servicio. Por favor, vuelva a intentarlo.';
          }
        }
      );
    }else{

      this.limpiar();
      this.closeModal();
      this.cargando = false;
      this.mostrar_alerta = true;
      this.modalIn = false;
      this.tipo_alerta = 'warning';
      this.mensaje_alerta = 'Tiene que abrir una caja para registrar un servicio.';
      
    }
  }

  /********************** ORDENAMIENTO DE TABLA MASCOTAS ***********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  closeModal(): any {
    this.modal.dismissAll();
    this.busquedaMascota = '';
    this.busquedaCliente = '';
    this.mascotas = this.mascotas_iniciales.slice(); 
  }
  limpiar(){
    this.servicioForm.reset();
    this.mascotaForm.reset();
    this.adelanto.setValue(0);
    this.nombre_mascota_seleccionada = '';
    this.mascota_seleccionada = null;
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

  /****************** CREAR CITAS ******************/
  HORA_SERVICIO: string = '';

  //getters & setters
  

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

  buscarMascota: boolean = false;
  obtenerTipoDocumento(){
    console.log(this.tipo_comprobante.value);
    if(this.tipo_comprobante.value==1){
      this.buscarMascota = true;
    }else if(this.tipo_comprobante.value == 2){
      this.buscarMascota = true;
    }
  }

  /**********************CONFIRMAR SERVICIO Y ACEPTAR *****************/
  @ViewChild('confirmarServicioModal') confirmarServicioModal: ElementRef;

  confirmarServicio(){
    this.convertirFormt24AFormat12();
    this.servicioInsertar.MASCOTA_ID = +this.mascota_seleccionada.MAS_ID;
    this.servicioInsertar.TIPO_SERVICIO_ID = +this.servicio.value; 
    if(this.descripcion.value == null || this.descripcion.value == undefined){
      this.servicioInsertar.SERVICIO_DESCRIPCION = '';
    }else if(this.descripcion.value.length>0){
      this.servicioInsertar.SERVICIO_DESCRIPCION = this.descripcion.value;
    }
    this.servicioInsertar.SERVICIO_PRECIO = this.precio.value; 
    this.servicioInsertar.HORA_SERVICIO = this.HORA_SERVICIO;
    this.servicioInsertar.SERVICIO_FECHA_HORA = this.fecha.value; 
    this.servicioInsertar.SERVICIO_TIPO = +this.modalidad.value;
    this.servicioInsertar.COMPROBANTE_ID = +this.tipo_comprobante.value;
    if(this.adelanto.value == 0 || this.adelanto.value == undefined || this.adelanto.value == null){
      this.servicioInsertar.SERVICIO_ADELANTO = 0;
    }else{
      this.servicioInsertar.SERVICIO_ADELANTO = this.adelanto.value;
    }
    this.servicioInsertar.MDP_ID = this.forma_pago.value;
    this.servicioInsertar.USU_ID = +this.storageService.getString('USE_ID');
    console.log(this.servicioInsertar);
    
    this.modal.open(this.confirmarServicioModal,{size:'lg'});
  }




  

  /***************** ADELANTAR SERVICIO **********/
  adelantoError: boolean = false;
  monto_adelantado: number = 0; 
  adelantarDinero(adelanto:any){
    console.log(adelanto);
    this.monto_adelantado = +adelanto;
    if(+adelanto>+this.precio.value){
      this.mensaje_alerta = 'El adelanto no puede ser mayor que el precio del servicio';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = false;
      this.adelantoError = true;
    }else{
      this.mostrar_alerta = false;
      this.adelantoError = false;
    }
  }
  /******************* LISTAR TIPOS DE EMPRESA *******************/
  listarEmpresas(){
    this.modalIn = false;
    this.cargando = true;
    this.empresaService.listasTipodeEmpresas().subscribe(
      (data)=>{
        this.empresas = data['resultado'];
        this.cargando = false;
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

  /********************REGISTRAR CLIENTE  ***********************/
  nuevoCliente(){
    this.modal.open(this.clienteModal,{size: 'lg'});
    this.mostrar_alerta = false;
    this.modalIn = false;
    this.inicializarClienteNaturalFormulario();
    this.inicializarClienteJuridicoFormulario();
  }

  active:number = 1;
  //Variable de registro de cliente
  clienteForm : FormGroup;
  clienteJuridicoForm : FormGroup;
  empresas: Empresa[] = [];
  @ViewChild('clienteModal') clienteModal: ElementRef;
  clienteNatural: Cliente = new Cliente();
  clienteJuridico: Cliente = new Cliente();
  datosJuridicos: DatosJuridicos = new DatosJuridicos();

  registrarClienteNatural(){
    if(this.clienteForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular.value;
      this.clienteNatural.CLIENTE_DNI = this.dni.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo_.value;
      this.clienteService.registrarCliente(this.clienteNatural).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.limpiar();
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
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaDNI'){
              this.mensaje_alerta = 'El DNI ingresado ya le pertenece a un cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }
  registrarClienteJuridico(){
    if(this.clienteJuridicoForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres_.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular_.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion_.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo.value;

      this.datosJuridicos.DJ_RAZON_SOCIAL = this.razon_social.value;
      this.datosJuridicos.DJ_RUC = this.ruc.value;
      this.datosJuridicos.TIPO_EMPRESA_ID = this.tipo_empresa.value;
      this.clienteService.registrarCliente(this.clienteNatural,this.datosJuridicos).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.limpiar();
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
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaRUC'){
              this.mensaje_alerta = 'El RUC ingresado ya le pertenece a un usuario. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_noExistenciaTipoEmpresa'){
              this.mensaje_alerta = 'Hubo un error identificando el tipo de empresa. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ExistenciaRazonSocial'){
              this.mensaje_alerta = 'La razón social le pertenece a otro cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }
  inicializarClienteNaturalFormulario(){
    this.clienteForm = this.formBuilder.group({
      nombres:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      apellidos: ['', [Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+'),Validators.maxLength(30)]],
      celular: ['', [Validators.required, Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
      direccion: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9 \-]+$'), Validators.maxLength(100)]],
      correo_: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    });
  }
  // getters & setters
  get nombres() {
    return this.clienteForm.get('nombres');
  } 
  get apellidos() {
    return this.clienteForm.get('apellidos');
  } 
  get celular() {
    return this.clienteForm.get('celular');
  } 
  get dni() {
    return this.clienteForm.get('dni');
  } 
  get direccion() {
    return this.clienteForm.get('direccion');
  } 
  get correo_() {
    return this.clienteForm.get('correo_');
  }
  inicializarClienteJuridicoFormulario(){
    this.clienteJuridicoForm = this.formBuilder.group({
      nombres_:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      razon_social: ['', [Validators.required,Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'), Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(11),  Validators.maxLength(11)]],
      tipo_empresa:['',[Validators.required]],
      celular_: ['', [Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      direccion_: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9 \-]+$'), Validators.maxLength(100)]],
      correo: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    });
  }
  // getters & setters
  get nombres_() {
    return this.clienteJuridicoForm.get('nombres_');
  } 
  get celular_() {
    return this.clienteJuridicoForm.get('celular_');
  } 
  get direccion_() {
    return this.clienteJuridicoForm.get('direccion_');
  } 
  get razon_social() {
    return this.clienteJuridicoForm.get('razon_social');
  } 
  get ruc() {
    return this.clienteJuridicoForm.get('ruc');
  } 
  get tipo_empresa() {
    return this.clienteJuridicoForm.get('tipo_empresa');
  } 
  get correo() {
    return this.clienteJuridicoForm.get('correo');
  }





  /*****************REGISTRAR MASCOTA  *****************/
  @ViewChild('crearMascotaModal') crearMascotaModal: ElementRef;
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
      this.mascotaNueva.MAS_ATENCIONES = 0;
      this.mascotaNueva.MAS_COLOR = this.color.value;
      this.mascotaNueva.MAS_ESPECIE = this.especie.value;
      this.mascotaNueva.MAS_NOMBRE = this.nombre.value;
      this.mascotaNueva.MAS_RAZA = this.raza.value;
      this.mascotaNueva.MAS_ESTADO = 1;
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
  /**************************** FORMULARIO MASCOTA ********************************/
  mascotaForm : FormGroup;
  inicializarMascotaFormulario(){
    this.mascotaForm = this.formBuilder.group({
      nombre:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(45)]],
      raza:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(30)]],
      especie:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(20)]],
      color:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.minLength(3),Validators.maxLength(45)]],
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


  /******************** LISTAR CLIENTES *******************/
  clientes: Cliente[] = [];
  clientes_iniciales: any[]=[];
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
