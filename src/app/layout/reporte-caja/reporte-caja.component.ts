import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Caja } from 'src/app/models/caja';
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


  constructor(private reporteService: ReportesService) { }

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
    this.cargando = true;
    this.modalIn = false;
    this.reporteService.reporteCaja().subscribe(
      (data)=>{
        console.log(data);
        this.reporte_mes_actual_inicial = data['resultado']['mes_actual'];
        this.reporte_mes_actual = this.reporte_mes_actual_inicial.slice();
        this.reporte_mes_anterior_inicial = data['resultado']['mes_anterior'];
        this.reporte_mes_anterior = this.reporte_mes_anterior_inicial.slice();
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
    );
  }
  /********************  **************************/
  paginaActualCajaMesActual: number = 1;
  itemsPorPaginaCajaMesActual: number = 5;

  paginaActualCajaMesAnterior: number = 1;
  itemsPorPaginaCajaMesAnterior: number = 5;
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
}
