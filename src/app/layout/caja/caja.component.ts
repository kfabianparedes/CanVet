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
      this.mostrarCierre = true;
      this.flechaCierre = 'up';
    } else {
      this.flechaCierre = 'down';
      this.mostrarCierre = false;
    }
  }
  registrarCierre(){

  }

  inicializarAperturaFormulario(){
    this.aperturaCajaForm = this.formBuilder.group({
      monto_incial :['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
    })
  }
  inicializarCierreFormulario(){
    this.cierreCajaForm = this.formBuilder.group({
      monto_incial :['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
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
}
