import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DetallesVenta } from 'src/app/models/detalle-venta';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { StorageService } from 'src/app/services/storage.service';
import { VentaService } from 'src/app/services/venta.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-reporte-venta-diario',
  templateUrl: './reporte-venta-diario.component.html',
  styleUrls: ['./reporte-venta-diario.component.css']
})
export class ReporteVentaDiarioComponent implements OnInit {
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
    private detalleVentaService:DetalleVentaService,
    private ventaService: VentaService,
    private storageService: StorageService
  ){ 
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }
  USE_TYPE : string = '';
  ngOnInit() {
    this.listaDiaria();
    this.USE_TYPE = this.storageService.getString('USE_TYPE');

  }

  /************* PAGINACION TABLA **********************/
  itemsPorPagina1: number = 50;
  paginaActual1: number = 1;


  flecha1 :string = 'down';
  mostrarReporte1:boolean= false;

  abrirReporte1(){
    if (this.flecha1 === 'down') {
      this.mostrarReporte1 = true;
      this.flecha1 = 'up';
    } else {
      this.flecha1 = 'down';
      this.mostrarReporte1 = false;
    }
  }

  itemsPorPagina2: number = 50;
  paginaActual2: number = 1;

  flecha2:string = 'down';
  mostrarReporte2:boolean = false;

  abrirReporte2(){
    if (this.flecha2 === 'down') {
      this.mostrarReporte2 = true;
      this.flecha2 = 'up';
    } else {
      this.flecha2 = 'down';
      this.mostrarReporte2 = false;
    }
  }

  /*************** DESHABILITAR VENTA ******************/
  deshabilitarVenta(VENTA_ID:number){

    this.cargando = true;
    this.modalIn = false;
    this.mostrar_alerta = false;
    this.ventaService.deshabilitarVentas(VENTA_ID).subscribe(
      data=>{
        this.listaDiaria();
      },error =>{

        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if (error['error']['error'] === 'error_existenciaId') {
            this.mensaje_alerta = 'Hubo un error al identificar la venta. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }

      }
    );
  }

  /************* LISTAR VENTAS DIARIAS ******************/
  ventas_diarias_iniciales : any[] = [];
  ventas_diarias : any[] = [];

  servicio_diarios_iniciales: any[] = [];
  servicio_diarios: any[] = [];

  listaDiaria(){
    this.flecha1 = 'down';
    this.flecha2 = 'down';
    this.mostrarReporte1 = false;
    this.mostrarReporte2 = false;

    this.cargando = true;
    this.modalIn = false;
    this.reporteService.reporteDiario().subscribe(
      (data)=>{

        this.cargando = false;
        this.flecha1 = 'up';
        this.flecha2 = 'up';
        this.mostrarReporte1 = true;
        this.mostrarReporte2 = true;
        this.ventas_diarias_iniciales = data['resultado'][0]['VENTAS'];
        this.servicio_diarios_iniciales = data['resultado'][1]['SERVICIOS'];
        this.ventas_diarias = this.ventas_diarias_iniciales.slice();
        this.servicio_diarios = this.servicio_diarios_iniciales.slice();
        
        console.log(data);
        console.log(this.ventas_diarias_iniciales);
        console.log(this.servicio_diarios_iniciales);
      },
      (error)=>{
        this.cargando = false;
        this.tipo_alerta = 'danger';
      }
    );
  }


  /*********************** VER DETALLES DE VENTA ***************************/
  @ViewChild('detallesVentaModalActual') detallesVentaModalActual: ElementRef;
  closeModal(): any {
    this.modal.dismissAll();
  }
  // detalle venta modal paginación
  itemsPerPageModal: number = 50;
  currentPageModal: number = 1;
  //variables faltantes venta
  USU_NOMBRE : string = '';
  CLIENTE_CORREO: string = '';
  VENTA_ID: number = 0;
  detallesVenta: DetallesVenta[] = [];
  detallesVentaInicial: any[] = [];



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

  /*********************** ORDENAMIENTO EN TABLA **********************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  
  //ordenar tabla detalles de venta
  onSortVenta({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.ventas_diarias = this.ventas_diarias_iniciales.slice();
    } else {
      this.ventas_diarias = [...this.ventas_diarias_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
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
      this.detallesVenta = this.detallesVentaInicial.slice();
    } else {
      this.detallesVenta = [...this.detallesVentaInicial].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /******************* VER DETALLES SERVICIO  *****************/
  @ViewChild('detallesServicioModal') detallesServicioModal: ElementRef;
  DJ_RUC: string = '';
  CLIENTE_DNI: string = '';
  MAS_ATENCIONES :number = 0;
  MAS_NOMBRE : string = '';
  verDetallesServicio(reporte:any){
    console.log(reporte);
    console.log(reporte.USU_NOMBRE);
    console.log(reporte.CLIENTE_CORREO);
    this.USU_NOMBRE = reporte.USU_NOMBRE;
    this.CLIENTE_DNI = reporte.CLIENTE_DNI;
    this.CLIENTE_CORREO = reporte.CLIENTE_CORREO;
    this.MAS_ATENCIONES = reporte.MAS_ATENCIONES;
    this.MAS_NOMBRE = reporte.MAS_NOMBRE;
    this.DJ_RUC = reporte.DJ_RUC;
    this.modal.open(this.detallesServicioModal,{size:'lg'});
  }



  onSortServicio({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.servicio_diarios = this.servicio_diarios_iniciales.slice();
    } else {
      this.servicio_diarios = [...this.servicio_diarios_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
