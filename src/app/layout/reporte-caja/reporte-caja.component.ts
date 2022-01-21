import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Caja } from 'src/app/models/caja';
import { CajaService } from 'src/app/services/caja.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-reporte-caja',
  templateUrl: './reporte-caja.component.html',
  styleUrls: ['./reporte-caja.component.css']
})
export class ReporteCajaComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;


  constructor(
    private reporteService: ReportesService,
    private cajaService: CajaService,
    private modal: NgbModal,
    private configModal: NgbModalConfig
  ) {
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }

  ngOnInit() {
    this.listarReportesCaja();
  }
  /*************REPORTES DE CAJA **********************/
  flechaReporteMesActual = 'down';
  mostrarReporteMesActual = false;
  abrirReporteMesActual(){
    if (this.flechaReporteMesActual === 'down') {
      this.mostrarReporteMesActual = true;
      this.flechaReporteMesActual = 'up';
    } else {
      this.flechaReporteMesActual = 'down';
      this.mostrarReporteMesActual = false;
    }
  }

  flechaReporteMesAnterior = 'down';
  mostrarReporteMesAnterior = false;
  abrirReporteMesAnterior(){
    if (this.flechaReporteMesAnterior === 'down') {
      this.mostrarReporteMesAnterior = true;
      this.flechaReporteMesAnterior = 'up';
    } else {
      this.flechaReporteMesAnterior = 'down';
      this.mostrarReporteMesAnterior = false;
    }
  }

  reporte_mes_actual: Caja[] = [];
  reporte_mes_anterior: Caja[] = [];
  reporte_mes_actual_inicial: any[] = [];
  reporte_mes_anterior_inicial: any[] = [];
  listarReportesCaja(){
    this.flechaReporteMesActual = 'down';
    this.mostrarReporteMesActual = false;
    this.flechaReporteMesAnterior = 'down';
    this.mostrarReporteMesAnterior = false;
    this.cargando = true;
    this.modalIn = false;
    this.reporteService.reporteCaja().subscribe(
      (data)=>{
        console.log(data);
        this.reporte_mes_actual_inicial = data['resultado']['mes_actual'];
        this.reporte_mes_actual = this.reporte_mes_actual_inicial.slice();
        this.reporte_mes_anterior_inicial = data['resultado']['mes_anterior'];
        console.log(this.reporte_mes_anterior_inicial);
        this.reporte_mes_anterior = this.reporte_mes_anterior_inicial.slice();
        console.log(this.reporte_mes_anterior);
        this.cargando = false;
        this.flechaReporteMesActual = 'up';
        this.mostrarReporteMesActual = true;
        this.flechaReporteMesAnterior = 'up';
        this.mostrarReporteMesAnterior = true;
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
    );
  }
  /********************  **************************/
  paginaActualCajaMesActual: number = 1;
  itemsPorPaginaCajaMesActual: number = 50;

  paginaActualCajaMesAnterior: number = 1;
  itemsPorPaginaCajaMesAnterior: number = 50;
  /************** BUSQUEDA DE REPORTES CAJA ************/
  busquedaCajaMesActual: string = '';



  /*********************** ORDENAMIENTO EN TABLA **********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  
  onSort({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.reporte_mes_actual = this.reporte_mes_actual_inicial.slice();
    } else {
      this.reporte_mes_actual = [...this.reporte_mes_actual_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  onSorted({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.reporte_mes_anterior = this.reporte_mes_anterior_inicial.slice();
    } else {
      this.reporte_mes_anterior = [...this.reporte_mes_anterior_inicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  itemsPerPageModal: number = 50;
  currentPageModal: number = 1;
  @ViewChild('detallesCajaModal') detallesCajaModal: ElementRef;
  detallesDeCaja: Caja[] = [];
  // Ver detalles de caja
  public verDetalleCaja(fechaCaja : string) : void {
    this.cargando = true;
    this.mostrar_alerta = false;
    this.modalIn = false;
    console.log(fechaCaja);
    this.cajaService.listarDetallesCaja(fechaCaja).subscribe(
      (data)=>{
        this.cargando = false;
        this.mostrar_alerta = false;
        this.modalIn = true;
        this.detallesDeCaja = data.resultado;
        console.log(this.detallesDeCaja);
        this.modal.open(this.detallesCajaModal,{size:'xl'});
      },
      (error: HttpErrorResponse)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = true;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
}
