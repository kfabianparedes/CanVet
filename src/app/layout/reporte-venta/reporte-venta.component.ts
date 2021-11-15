import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
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
    ) { }

  ngOnInit() {
    this.listarReporteVentas();
  }
  /**************** LISTAR REPORTES VENTAS  */
  mes_actual_ventas_factura: any[] = [];
  mes_actual_ventas_boleta: any[] = [];
  mes_actual_servicios_factura: any[] = [];
  mes_actual_servicios_boleta: any[] = [];

  mes_actual_ventas_factura_inicial: any[] = [];
  mes_actual_ventas_boleta_inicial: any[] = [];
  mes_actual_servicios_factura_inicial: any[] = [];
  mes_actual_servicios_boleta_inicial: any[] = [];

  /**********************************/

  mes_anterior_ventas_factura: any[] = [];
  mes_anterior_ventas_boleta: any[] = [];
  mes_anterior_servicios_factura: any[] = [];
  mes_anterior_servicios_boleta: any[] = [];

  mes_anterior_ventas_factura_inicial: any[] = [];
  mes_anterior_ventas_boleta_inicial: any[] = [];
  mes_anterior_servicios_factura_inicial: any[] = [];
  mes_anterior_servicios_boleta_inicial: any[] = [];
  listarReporteVentas(){
    this.cargando = true;
    this.modalIn = false;
    this.mostrar_alerta = false;
    this.reporteService.reporteVentas().subscribe(
      data=>{
        console.log(data);
        this.mes_actual_ventas_factura_inicial = data['MES_ACTUAL'][0]['VENTAS_FACTURA'];
        this.mes_actual_ventas_boleta_inicial = data['MES_ACTUAL'][1]['VENTAS_BOLETA'];
        this.mes_actual_servicios_factura_inicial = data['MES_ACTUAL'][2]['SERVICIOS_FACTURA'];
        this.mes_actual_servicios_boleta_inicial = data['MES_ACTUAL'][3]['SERVICIOS_BOLETA'];

        this.mes_actual_ventas_factura = this.mes_actual_ventas_factura_inicial.slice();
        this.mes_actual_ventas_boleta = this.mes_actual_ventas_boleta_inicial.slice();
        this.mes_actual_servicios_factura = this.mes_actual_servicios_factura_inicial.slice();
        this.mes_actual_servicios_boleta = this.mes_actual_servicios_boleta_inicial.slice();

        /********************  *******************/
        this.mes_anterior_ventas_factura_inicial = data['MES_ANTERIOR'][0]['VENTAS_FACTURA'];
        this.mes_anterior_ventas_boleta_inicial = data['MES_ANTERIOR'][1]['VENTAS_BOLETA'];
        this.mes_anterior_servicios_factura_inicial = data['MES_ANTERIOR'][2]['SERVICIOS_FACTURA'];
        this.mes_anterior_servicios_boleta_inicial = data['MES_ANTERIOR'][3]['SERVICIOS_BOLETA'];

        this.mes_anterior_ventas_factura = this.mes_anterior_ventas_factura_inicial.slice();
        this.mes_anterior_ventas_boleta = this.mes_anterior_ventas_boleta_inicial.slice();
        this.mes_anterior_servicios_factura = this.mes_anterior_servicios_factura_inicial.slice();
        this.mes_anterior_servicios_boleta = this.mes_anterior_servicios_boleta_inicial.slice();

        console.log(this.mes_actual_ventas_factura);
        console.log(this.mes_actual_ventas_boleta);
        console.log(this.mes_actual_servicios_factura);
        console.log(this.mes_actual_servicios_boleta);

        console.log(this.mes_anterior_ventas_factura);
        console.log(this.mes_anterior_ventas_boleta);
        console.log(this.mes_anterior_servicios_factura);
        console.log(this.mes_anterior_servicios_boleta);

        this.cargando = false;
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
  
  onSort1({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_ventas_factura = this.mes_actual_ventas_factura_inicial.slice();
    } else {
      this.mes_actual_ventas_factura = [...this.mes_actual_ventas_factura_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  onSort2({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_servicios_factura = this.mes_actual_servicios_factura_inicial.slice();
    } else {
      this.mes_actual_servicios_factura = [...this.mes_actual_servicios_factura_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  onSort3({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_ventas_boleta = this.mes_actual_ventas_boleta_inicial.slice();
    } else {
      this.mes_actual_ventas_boleta = [...this.mes_actual_ventas_boleta_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  onSort4({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.mes_actual_servicios_boleta = this.mes_actual_servicios_boleta_inicial.slice();
    } else {
      this.mes_actual_servicios_boleta = [...this.mes_actual_servicios_boleta_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /*********************** VER DETALLES DE VENTA ***************************/
  @ViewChild('detallesVentaModal') detallesVentaModal: ElementRef;
  closeModal(): any {
    this.modal.dismissAll();
  }
  verDetalles(VENTA_ID:number){
    console.log(VENTA_ID);
  } 

  /******************* VER DETALLES SERVICIO  *****************/
  @ViewChild('detallesServicioModal') detallesServicioModal: ElementRef;

  verDetallesServicio(reporte:any){
    console.log(reporte);
  }
}
