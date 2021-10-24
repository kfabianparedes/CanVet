import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoServicio } from 'src/app/models/tipo-servicio';
import { MascotaService } from 'src/app/services/mascota.service';
import { TipoServicioService } from 'src/app/services/tipoServicio.service';

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
    private tipoServicioService:TipoServicioService
  ) { }

  ngOnInit(): void {
    this.listarMascotas();
    this.listarServicios();
    this.inicializarServicioFormulario();
  }

  //******************INGRESAR DATOS REGISTRO SERVICIO ********************/
  servicioForm : FormGroup;
  inicializarServicioFormulario(){
    this.servicioForm = this.formBuilder.group({
      // mascota:['',[Validators.required]],
      servicio:['',[Validators.required]],
      modalidad:['',[Validators.required]],
      descripcion:['',[Validators.maxLength(200),Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$')]],
      precio:['',[Validators.required, Validators.pattern('[0-9]+[.]?[0-9]*')]],
    });
  }

  //getters & setters
  get mascota() {
    return this.servicioForm.get('mascota');
  }
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
    this.cargando = true;
    this.modalIn = false;
    this.mascotaService.listarMascotas().subscribe(
      data=>{
        this.mascotas =  data['resultado'];
        this.cargando = false;
        console.log(this.mascotas);
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
    this.cargando = true;
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
}
