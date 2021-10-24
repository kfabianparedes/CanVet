import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { convertTypeAcquisitionFromJson } from 'typescript';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  view: [number,number] = [650  , 400];
  reporteAnual: any[];
  reporteSemanal: any[];
  cargar = true; 
  //controladores de reporte anual
  flechaReporteAnual:string = 'down';
  mostrarReporteAnual = false; 
  totalAnual = 0; 

  //controladores de reporte semanal
  flechaReporteSemanal:string = 'down';
  mostrarReporteSemanal = false; 
  totalSemanal = 0; 

  // options reportes anuales y semanales
  showXAxis: boolean ;
  showYAxis: boolean ;
  gradient: boolean ;
  showLegend: boolean ;
  showXAxisLabel: boolean ;
  xAxisLabel: string ;
  legendTitle: string ;
  showYAxisLabel: boolean ;
  yAxisLabel: string ;
  animations: boolean ;

  //options reportes semanales
  yAxisLabelSemanales: string ;
  xAxisLabelSemanales: string ;

  constructor(private reporteService: ReportesService) {
  }

  cargarResportesAnuales(){
    this.reporteService.reporteAnual().subscribe(data =>{
      this.reporteAnual = data['resultado'];
      this.reporteAnual.forEach(element => {
          this.totalAnual = this.totalAnual+ element.value;
      });
      this.inicializarGraficos();
      this.cargar  = false; 
    },
    error =>{
    });
  }
  cargarResportesSemanales(){
    this.reporteService.reporteSemanal().subscribe(data =>{
      this.reporteSemanal = data['resultado'];
      this.reporteSemanal.forEach(element => {
        this.totalSemanal += element['value'];
    });
      
    },
    error =>{
    });
  }

  abrirReporteAnual(){
    if (this.flechaReporteAnual === 'down') {
      this.mostrarReporteAnual = true;
      this.flechaReporteAnual = 'up';
    } else {
      this.flechaReporteAnual = 'down';
      this.mostrarReporteAnual = false;
    }
  }

  abrirReporteSemanal(){
    if (this.flechaReporteSemanal === 'down') {
      this.mostrarReporteSemanal = true;
      this.flechaReporteSemanal = 'up';
    } else {
      this.flechaReporteSemanal = 'down';
      this.mostrarReporteSemanal = false;
    }
  }

  cargarReportes(){
    this.cargarResportesAnuales();  
    this.cargarResportesSemanales();
  }
  ngOnInit(): void {
    this.cargarReportes();
  }

  inicializarGraficos(){
    this.showXAxis = true;
    this.showYAxis = true;
    this.gradient = false;
    this.showLegend = true;
    this.showXAxisLabel = true;
    this.xAxisLabel = 'Mes';
    this.legendTitle = 'Leyenda';
    this.showYAxisLabel = true;
    this.yAxisLabel= 'Ganancias (S/'+this.totalAnual+')';
    this.animations = true;

    //options reportes semanales
    this.yAxisLabelSemanales = 'Ganancias (S/'+this.totalSemanal+')';
    this.xAxisLabelSemanales = 'Día';
  }
  

  
  onSelect(event:any) {
    console.log(event);
  }
}
