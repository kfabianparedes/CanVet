import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DetallesVenta } from 'src/app/models/detalle-venta';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.css']
})
export class ReporteVentaComponent implements OnInit {

  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  constructor(
    private reporteService: ReportesService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private datePipe: DatePipe,
    private detalleVentaService:DetalleVentaService
  ){ 
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }

  ngOnInit() {
    this.listarReporteVentas();
  }
  /**************** LISTAR REPORTES VENTAS  */
  mes_actual_venta_inicial: any[] = [];
  mes_actual_venta: any[] = [];

  mes_actual_servicio_inicial: any[] = [];
  mes_actual_servicio: any[] = [];

  /**********************************/
  mes_anterior_venta_inicial: any[] = [];
  mes_anterior_venta: any[] = [];

  mes_anterior_servicio_inicial: any[] = [];
  mes_anterior_servicio: any[] = [];

  listarReporteVentas(){
    this.mostrarReporte1 = false;
    this.mostrarReporte2 = false;
    this.mostrarReporte3 = false;
    this.mostrarReporte4 = false;
    this.flecha1 = 'down';
    this.flecha2 = 'down';
    this.flecha3 = 'down';
    this.flecha4 = 'down';
    this.cargando = true;
    this.modalIn = false;
    this.mostrar_alerta = false;
    this.reporteService.reporteVentas().subscribe(
      data=>{
        console.log(data);
        this.mes_actual_venta_inicial = data['MES_ACTUAL'][0]['VENTAS'];
        this.mes_actual_servicio_inicial = data['MES_ACTUAL'][1]['SERVICIOS'];

        this.mes_anterior_venta_inicial = data['MES_ANTERIOR'][0]['VENTAS'];
        this.mes_anterior_servicio_inicial = data['MES_ANTERIOR'][1]['SERVICIOS'];

        this.mes_actual_venta = this.mes_actual_venta_inicial.slice();
        this.mes_actual_servicio = this.mes_actual_servicio_inicial.slice();
        this.mes_anterior_venta = this.mes_anterior_venta_inicial.slice();
        this.mes_anterior_servicio = this.mes_anterior_servicio_inicial.slice();
        /********************  *******************/
        console.log(this.mes_actual_servicio);
        this.cargando = false;
        this.mostrarReporte1 = true;
        this.mostrarReporte2 = true;
        this.mostrarReporte3 = true;
        this.mostrarReporte4 = true;
        this.flecha1 = 'up';
        this.flecha2 = 'up';
        this.flecha3 = 'up';
        this.flecha4 = 'up';
      },
      (error) =>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
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


  /************* REPORTES DE CAJA **********************/
  itemsPorPagina1: number = 5;
  paginaActual1: number = 1;


  flecha1 = 'down';
  mostrarReporte1 = false;
  abrirReporte1(){
    if (this.flecha1 === 'down') {
      this.mostrarReporte1 = true;
      this.flecha1 = 'up';
    } else {
      this.flecha1 = 'down';
      this.mostrarReporte1 = false;
    }
  }

  itemsPorPagina2: number = 5;
  paginaActual2: number = 1;

  flecha2 = 'down';
  mostrarReporte2 = false;
  abrirReporte2(){
    if (this.flecha2 === 'down') {
      this.mostrarReporte2 = true;
      this.flecha2 = 'up';
    } else {
      this.flecha2 = 'down';
      this.mostrarReporte2 = false;
    }
  }

  itemsPorPagina3: number = 5;
  paginaActual3: number = 1;


  flecha3 = 'down';
  mostrarReporte3 = false;
  abrirReporte3(){
    if (this.flecha3 === 'down') {
      this.mostrarReporte3 = true;
      this.flecha3 = 'up';
    } else {
      this.flecha3 = 'down';
      this.mostrarReporte3 = false;
    }
  }

  itemsPorPagina4: number = 5;
  paginaActual4: number = 1;


  flecha4 = 'down';
  mostrarReporte4 = false;
  abrirReporte4(){
    if (this.flecha4 === 'down') {
      this.mostrarReporte4 = true;
      this.flecha4 = 'up';
    } else {
      this.flecha4 = 'down';
      this.mostrarReporte4 = false;
    }
  }
  
  /*********************** ORDENAMIENTO EN TABLA **********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  
  onSortMesActualVenta({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_venta = this.mes_actual_venta_inicial.slice();
    } else {
      this.mes_actual_venta = [...this.mes_actual_venta_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  onSortMesAnteriorVenta({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_anterior_venta = this.mes_anterior_venta_inicial.slice();
    } else {
      this.mes_anterior_venta = [...this.mes_anterior_venta_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  onSortMesActualServicio({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_servicio = this.mes_actual_servicio_inicial.slice();
    } else {
      this.mes_actual_servicio = [...this.mes_actual_servicio_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  onSortMesAnteriorServicio({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_anterior_servicio = this.mes_anterior_servicio_inicial.slice();
    } else {
      this.mes_anterior_servicio = [...this.mes_anterior_servicio_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /*********************** VER DETALLES DE VENTA ***************************/
  @ViewChild('detallesVentaModalActual') detallesVentaModalActual: ElementRef;
  closeModal(): any {
    this.modal.dismissAll();
  }
  // detalle venta modal paginación
  itemsPerPageModal: number = 5;
  currentPageModal: number = 1;
  //variables faltantes venta
  USU_NOMBRE : string = '';
  CLIENTE_CORREO: string = '';
  VENTA_ID: number = 0;
  detallesVenta: DetallesVenta[] = [];



  verDetalles(reporte:any){
    console.log(reporte);
    this.cargando = true;
    this.modalIn = true;
    this.USU_NOMBRE = reporte.USU_NOMBRE;
    this.CLIENTE_CORREO = reporte.CLIENTE_CORREO;
    this.VENTA_ID = reporte.VENTA_ID;
    console.log(this.VENTA_ID);
    console.log(this.CLIENTE_CORREO);
    this.listarDetalles(this.VENTA_ID);
    this.modal.open(this.detallesVentaModalActual,{size:'xl'});
    
  } 
  listarDetalles(VENTA_ID:number){
    this.detalleVentaService.listasDetallesDeVenta(VENTA_ID).subscribe(
      (data)=>{
        this.cargando = false;
        this.detallesVenta = data['resultado'];
        console.log(data);
        console.log(this.detallesVenta);
      },
      (error)=>{
        this.cargando = false;
        this.modalIn = false;
        this.tipo_alerta = 'danger';
        this.closeModal();
        console.log(error);
      }
    );
  }
  //ordenar tabla detalles de venta
  onSortDetallesVenta({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_servicio = this.mes_actual_servicio_inicial.slice();
    } else {
      this.mes_actual_servicio = [...this.mes_actual_servicio_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /******************* VER DETALLES SERVICIO  *****************/
  @ViewChild('detallesServicioModal') detallesServicioModal: ElementRef;
  DJ_RUC: string = '';
  CLIENTE_DNI: string = '';
  verDetallesServicio(reporte:any){
    console.log(reporte);
    console.log(reporte.USU_NOMBRE);
    console.log(reporte.CLIENTE_CORREO);
    this.USU_NOMBRE = reporte.USU_NOMBRE;
    this.CLIENTE_DNI = reporte.CLIENTE_DNI;
    this.CLIENTE_CORREO = reporte.CLIENTE_CORREO;
    this.DJ_RUC = reporte.DJ_RUC;
    this.modal.open(this.detallesServicioModal,{size:'md'});
  }

  
}
