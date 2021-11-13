import { DatePipe } from '@angular/common';
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

  constructor(
    private formBuilder: FormBuilder,
    private storageService:StorageService,
    private datePipe: DatePipe,
    private cajaService:CajaService
    ) { }

  ngOnInit(): void {
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
    
    this.caja.CAJA_MONTO_INICIAL = this.monto_incial.value;
    this.caja.CAJA_APERTURA = this.getTodayFecha();
    this.caja.USU_ID = +this.storageService.getString('USE_ID');
    console.log(this.caja);
    this.cajaService.abrirCaja(this.caja).subscribe(
      (data)=>{
        this.mostrar_alerta = true;
        this.cargando = false;
        this.tipo_alerta = 'success';
        this.mensaje_alerta = 'La caja ha sido aperturada correctamente, ahora puedes realizar ventas.';
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
    caja.CAJA_MONTO_EFECTIVO_SERVICIOS = this.gananciasServiciosEfectivo * 100 ; 
    caja.CAJA_MONTO_TARJETA_SERVICIOS = this.gananciasServiciosTarjeta* 100; 
    caja.CAJA_MONTO_YAPE_SERVICIOS = this.gananciasServiciosYape * 100 ; 
    caja.CAJA_MONTO_EFECTIVO_VENTAS = this.gananciasVentasEfectivo * 100 ; 
    caja.CAJA_MONTO_TARJETA_VENTAS = this.gananciasVentasTarjeta * 100 ; 
    caja.CAJA_MONTO_YAPE_VENTAS = this.gananciasVentasYape * 100 ; 
    caja.CAJA_DESCUENTO_GASTOS = this.gastos.value * 100 ; 
    this.totalEfectivo = caja.CAJA_MONTO_EFECTIVO_SERVICIOS + caja.CAJA_MONTO_EFECTIVO_VENTAS;
    this.totalTarjeta = caja.CAJA_MONTO_TARJETA_SERVICIOS + caja.CAJA_MONTO_TARJETA_VENTAS;
    this.totalYape = caja.CAJA_MONTO_YAPE_SERVICIOS + caja.CAJA_MONTO_YAPE_VENTAS;
    caja.CAJA_MONTO_FINAL = (this.totalEfectivo + this.totalTarjeta + this.totalYape) - this.gastos.value ;
  }
  
  registrarCierre(){

    this.cargando = true;
    this.modalIn = false;

    if(this.storageService.hasKey('OPEN_CODE')){
      this.llenarDatosCajaCierre(this.cajaCierre);

      this.cajaService.cerrarCaja(this.cajaCierre).subscribe(
        
        data =>{

          this.cargando = false;
          this.mostrar_alerta = true;
          this.tipo_alerta='success';
          this.mensaje_alerta = 'Caja cerrada con éxito.';
          this.storageService.remove('OPEN_CODE');
          this.storageService.remove('OPEN_ID');
          this.flechaCierre = 'down';
          this.mostrarCierre = false;
        },error=>{

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
      monto_incial :['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
    })
  }
  inicializarCierreFormulario(){
    this.cierreCajaForm = this.formBuilder.group({
      gastos :['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
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
  cambiarDeStyleDate() {
    this.opacarFecha = false;
  }
  getTodayFecha(): string {
    const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    return fechaActual;
  }

  /***************************** LISTAR MONTOS *********************/
  montos:any[] =[];
  gananciasServiciosEfectivo:any; 
  gananciasServiciosTarjeta:any; 
  gananciasServiciosYape:any; 
  gananciasVentasEfectivo:any; 
  gananciasVentasTarjeta:any; 
  gananciasVentasYape:any; 
  
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

}
