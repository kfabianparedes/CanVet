import { Component, OnInit } from '@angular/core';
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

  constructor(private servicioService:ServicioService) { }

  ngOnInit(): void {
    this.listarServiciosPendientes();
  }

  /****************** LISTAR SERVICIOS PENDIENTES **************/
  servicios_pendientes: any[] = [];

  listarServiciosPendientes(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = false;
    this.servicioService.listarServiciosPendientes().subscribe(
      (data)=>{
        this.servicios_pendientes = data['resultado'];
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
  // MASCOTA = LISTAR  => mascota
  // ******TIPO DE SERVICIO =  LISTAR  LOS 4 TIPOS  => servicio
  // ******CITA O SERVICIO = TIPO (0 - SERVICIO ) (1 - CITA)  => modalidad
  // DESCRIPCION = OPCIONAL => descripcion
  // ******PRECIO = X100

}
