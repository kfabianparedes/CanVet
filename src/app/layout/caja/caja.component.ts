import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Caja } from 'src/app/models/caja';
import { CajaService } from 'src/app/services/caja.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;
  //Mostrar 
  mostrarApertura = false;
  mostrarCierre = false;
  flechaApertura:string = 'down';
  flechaCierre:string = 'down';

  //Fecha
  opacarFecha: boolean = true;
  montoInicial:number = 0;

  //formulario
  caja: Caja = new Caja();
  aperturaCajaForm : FormGroup;
  cierreCajaForm: FormGroup;

  //totales de las sumas de cierre de caja
  totalYape : number ; 
  totalTarjeta : number ; 
  totalEfectivo : number ;

  //Variable bandera que controle si es que hay una caja abierta o no 
  cajaAbiertaFlag = false; 

  constructor(
    private formBuilder: FormBuilder,
    private storageService:StorageService,
    private datePipe: DatePipe,
    private cajaService:CajaService
    ) { }

  ngOnInit(): void {
    if(this.storageService.hasKey('OPEN_CODE'))
      this.cajaAbiertaFlag = true ;
    this.inicializarAperturaFormulario();
    this.inicializarCierreFormulario();
     
  }

  abrirCaja(){
    if (this.flechaApertura === 'down') {
      this.mostrarApertura = true;
      this.flechaApertura = 'up';
    } else {
      this.flechaApertura = 'down';
      this.mostrarApertura = false;
    }
  }
  registrarApertura(){
    this.cargando = true;
    
    this.caja.CAJA_MONTO_INICIAL = this.monto_incial.value *100;
    this.caja.CAJA_APERTURA = this.getTodayFecha();
    this.caja.USU_ID = +this.storageService.getString('USE_ID');
    console.log(this.caja);
    this.cajaService.abrirCaja(this.caja).subscribe(
      (data)=>{
        this.mostrar_alerta = true;
        this.cargando = false;
        this.tipo_alerta = 'success';
        this.mensaje_alerta = 'La caja ha sido aperturada correctamente, ahora puedes realizar ventas.';
        this.aperturaCajaForm.reset();
        this.mostrarApertura = false; 
        this.cajaAbiertaFlag = true ; 
        this.storageService.storeString('OPEN_CODE', data.codigo_caja);
        this.storageService.storeString('OPEN_ID', data.id_caja);
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
            this.mensaje_alerta = 'Hubo un error al abrir la caja. Por favor, actualice la página o inténtelo más tarde.';
          }else  if(error.error.error === 'error_cajaAbierta'){
            this.mensaje_alerta = 'Este usuario ya tiene caja abierta el día de hoy.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }
  cerrarCaja(){
    if (this.flechaCierre === 'down') {
      this.cargando = true;
      this.listarMontoDelDia();
      this.mostrarCierre = true;
      this.flechaCierre = 'up';
    } else {
      this.flechaCierre = 'down';
      this.mostrarCierre = false;
    }
  }
  /************************ REGISTRA CIERRE CAJA ***********************/ 

  cajaCierre = new Caja();

  llenarDatosCajaCierre(caja:Caja){

    caja.CAJA_CODIGO = this.storageService.getString('OPEN_CODE');
    caja.CAJA_MONTO_INICIAL = +this.CAJA_MONTO_INICIAL*100;
    caja.CAJA_MONTO_EFECTIVO_SERVICIOS = this.gananciasServiciosEfectivo * 100 ; 
    caja.CAJA_MONTO_TARJETA_SERVICIOS = this.gananciasServiciosTarjeta* 100; 
    caja.CAJA_MONTO_YAPE_SERVICIOS = this.gananciasServiciosYape * 100 ; 
    caja.CAJA_MONTO_EFECTIVO_VENTAS = this.gananciasVentasEfectivo * 100 ; 
    caja.CAJA_MONTO_TARJETA_VENTAS = this.gananciasVentasTarjeta * 100 ; 
    caja.CAJA_MONTO_YAPE_VENTAS = this.gananciasVentasYape * 100 ; 
    caja.CAJA_DESCUENTO_GASTOS = this.gastos.value * 100 ; 
    caja.CAJA_DESCRIPCION = this.descripcion.value;
    this.totalEfectivo = caja.CAJA_MONTO_EFECTIVO_SERVICIOS + caja.CAJA_MONTO_EFECTIVO_VENTAS;
    this.totalTarjeta = caja.CAJA_MONTO_TARJETA_SERVICIOS + caja.CAJA_MONTO_TARJETA_VENTAS;
    this.totalYape = caja.CAJA_MONTO_YAPE_SERVICIOS + caja.CAJA_MONTO_YAPE_VENTAS;
    caja.CAJA_MONTO_FINAL = (this.totalEfectivo + this.totalTarjeta + this.totalYape) - caja.CAJA_DESCUENTO_GASTOS ;
  }
  
  registrarCierre(){

    this.cargando = true;
    this.modalIn = false;

    if(this.storageService.hasKey('OPEN_CODE')){
      this.llenarDatosCajaCierre(this.cajaCierre);

      this.cajaService.cerrarCaja(this.cajaCierre).subscribe(
        
        ()=>{

          this.cargando = false;
          this.mostrar_alerta = true;
          this.tipo_alerta='success';
          this.mensaje_alerta = 'Caja cerrada con éxito.';
          this.storageService.remove('OPEN_CODE');
          this.storageService.remove('OPEN_ID');
          this.flechaCierre = 'down';
          this.mostrarCierre = false;
          this.cierreCajaForm.reset();
          this.montos = [];
          this.gananciasServiciosEfectivo = 0; 
          this.gananciasServiciosTarjeta = 0; 
          this.gananciasServiciosYape = 0; 
          this.gananciasVentasEfectivo = 0; 
          this.gananciasVentasTarjeta = 0; 
          this.gananciasVentasYape = 0; 
          this.CAJA_MONTO_INICIAL = 0;
        },(error)=>{

          this.cargando = false;
          this.mostrar_alerta = true;
          this.tipo_alerta='danger';
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
            }else if(error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_cajaCerrada'){
              this.mensaje_alerta = 'La caja ya está cerrada.';
            }else if(error.error.error === 'error_noExistenciaCaja'){
              this.mensaje_alerta = 'No existe existe ningguna caja abierta en este momento.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }

      );
    }else{
      this.cargando = false;
      this.mostrar_alerta = true;
      this.tipo_alerta='danger';
      this.mensaje_alerta = 'No existe una caja abierta en este momento.';
    }
    
  }

  inicializarAperturaFormulario(){
    this.aperturaCajaForm = this.formBuilder.group({
      monto_incial :[{value: '',disabled: this.cajaAbiertaFlag},[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
    })
  }
  inicializarCierreFormulario(){
    this.cierreCajaForm = this.formBuilder.group({
      gastos :['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
      descripcion:['',[Validators.maxLength(500),]],
    })
  }
  //getters Apertura
  get monto_incial() {
    return this.aperturaCajaForm.get('monto_incial');
  }
  //getters Cierre
  get gastos() {
    return this.cierreCajaForm.get('gastos');
  }
  get descripcion(){
    return this.cierreCajaForm.get('descripcion');
  }
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }

  /***************************** LISTAR MONTOS *********************/
  montos:any[] =[];
  gananciasServiciosEfectivo : number = 0; 
  gananciasServiciosTarjeta : number = 0; 
  gananciasServiciosYape : number = 0; 
  gananciasVentasEfectivo : number = 0; 
  gananciasVentasTarjeta : number = 0; 
  gananciasVentasYape : number = 0;
  montoTotalEfectivo : string = '0.00'; 
  CAJA_MONTO_INICIAL : number = 0;
  MontoTotalDeTotales :number = 0;
  listarMontoDelDia(){
    this.cargando = true;
    this.modalIn = false;
    this.cajaService.listarMontoDiario().subscribe(
      data=>{
        this.montos = data['resultado'];
        this.gananciasServiciosEfectivo = data['resultado']['gananciasServiciosEfectivo'] ; 
        this.gananciasServiciosTarjeta = data['resultado']['gananciasServiciosTarjeta'] ; 
        this.gananciasServiciosYape = data['resultado']['gananciasServiciosYape'] ; 
        this.gananciasVentasEfectivo = data['resultado']['gananciasVentasEfectivo'] ; 
        this.gananciasVentasTarjeta = data['resultado']['gananciasVentasTarjeta'] ; 
        this.gananciasVentasYape = data['resultado']['gananciasVentasYape'] ; 
        this.CAJA_MONTO_INICIAL= data['resultado']['montoInicial'];
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
          }if (error['error']['error'] === 'error_ErrorDeCajaNoAbierta') {
            this.mensaje_alerta = 'Tiene que abrir una caja.';
            this.tipo_alerta = 'warning';
          }
          
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }

  public aplicarDescuento(): void {
    console.log("descuentos => "+this.gastos.value);
    this.montoTotalEfectivo = (this.gananciasServiciosEfectivo + this.gananciasVentasEfectivo - this.gastos.value).toFixed(2);
    console.log("monto total ventas => "+this.montoTotalEfectivo);
    this.MontoTotalDeTotales = (
      this.gananciasServiciosTarjeta  + 
      this.gananciasServiciosYape     +
      this.gananciasVentasTarjeta     +
      this.gananciasVentasYape        +
      +this.montoTotalEfectivo
    );
    console.log("total => "+this.MontoTotalDeTotales);
  }
}
