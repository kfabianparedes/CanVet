import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Compra } from 'src/app/models/compra';
import { DetalleProducto } from 'src/app/models/detalle-producto';
import { DetalleCompraService } from 'src/app/services/detalle-compra.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-reporte-compra',
  templateUrl: './reporte-compra.component.html',
  styleUrls: ['./reporte-compra.component.css']
})
export class ReporteCompraComponent implements OnInit {

  public cargando : boolean = false;
  public modalIn : boolean = false;
  public mensaje_alerta: string = '';
  public mostrar_alerta: boolean = false;
  public tipo_alerta: string = '';

  //Variables de la tabla compra
  public compras : Compra[] = [];
  public comprasIniciales : any[] = [];
  //Variables de detalles de compra:
  public detallesCompra: any[] = [];

  /************* PAGINACION TABLA **********************/
  public itemsPorPagina: number = 50;
  public paginaActual: number = 1;

  public flecha : string = 'down';
  public mostrarReporte : boolean = false;

  // detalle venta modal paginación
  itemsPerPageModal: number = 50;
  currentPageModal: number = 1;

  

  constructor(
    private reportesService:ReportesService,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private detalleCompraService: DetalleCompraService
  ) { 
    this.configModal.backdrop = 'static';
    this.configModal.keyboard = false;
  }

  ngOnInit(): void {
    this.listarCompras();
  }

  public abrirTablaCompras() : void {
    if (this.flecha === 'down') {
      this.mostrarReporte = true;
      this.flecha = 'up';
    } else {
      this.flecha = 'down';
      this.mostrarReporte = false;
    }
  }

  /******************* VER DETALLES SERVICIO  *****************/
  @ViewChild('detallesCompraModal') detallesCompraModal: ElementRef;

  public verdetallesCompra( idDeCompra : number) : void {
    console.log(idDeCompra);
    this.cargando = true ;
    this.mostrar_alerta = false;
    this.modalIn = true;
    this.detalleCompraService.listasDetallesDeVenta(idDeCompra).subscribe(
      (dataSuccess : any)=>{
        console.log(dataSuccess);
        this.detallesCompra = dataSuccess.resultado;
        console.log(this.detallesCompra);
        this.cargando = false;
      },
      (dataError: HttpErrorResponse)=>{
        this.tipo_alerta = 'danger';
        this.mostrar_alerta = true;
        console.log(dataError.error)
      }
    );

    this.modal.open(this.detallesCompraModal,{size:'xl'});
  }

  private listarCompras() : void {
    this.cargando = true;
    this.modalIn = false;
    this.mostrar_alerta = false;
    this.reportesService.reporteCompra().subscribe(
      (dataSuccess: any)=>{
        console.log(dataSuccess);
        this.comprasIniciales = dataSuccess.resultado;
        this.compras = [...this.comprasIniciales];
        console.log(this.compras);
        this.flecha = 'up';
        this.mostrarReporte = true;
        this.cargando = false;
      },
      (dataError: HttpErrorResponse)=>{
        this.tipo_alerta = 'danger';
        this.mostrar_alerta = true;
        console.log(dataError.error)
      }
    );
  }
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;

  public onSortCompra({column, direction}: any): void {
// resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
  // sorting countries
    if (direction === '' || column === '') {
      this.compras = [...this.comprasIniciales];
    } else {
      this.compras = [...this.comprasIniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public onSortdetallesCompra(event : any ) : void {

  }

  
}
