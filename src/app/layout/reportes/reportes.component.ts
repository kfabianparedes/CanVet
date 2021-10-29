import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { convertTypeAcquisitionFromJson } from 'typescript';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  view: [number,number] = [650  , 400];
  reporteAnual: any[];
  reporteSemanal: any[];
  reporteSemanalDividido: any[];
  reporteMensual: any[];
  cargar = true; 
  //controladores de reporte anual
  flechaReporteAnual:string = 'down';
  mostrarReporteAnual = false; 
  totalAnual = 0; 

  //controladores de reporte semanal
  flechaReporteSemanal:string = 'down';
  mostrarReporteSemanal = false; 
  totalSemanal = 0; 

  //controladores de reporte semanal dividido
  flechaReporteSemanalDividido:string = 'down';
  mostrarReporteSemanalDividido = false; 
  totalSemanalDividido = 0; 

  //controladores de reporte Mensual
  flechaReporteMensual:string = 'down';
  mostrarReporteMensual = false; 
  totalMensual = 0; 

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
  noBarWhenZero: boolean;

  //options reportes semanales
  yAxisLabelSemanales: string ;
  xAxisLabelSemanales: string ;

  //oprtion resportes semanales divididos 
  yAxisLabelSemanalesDivididos: string;

  //oprtion resportes Mensuales
  yAxisLabelMensuales: string;

  constructor(private reporteService: ReportesService) {
  }

  //cargr reportes anuales
  cargarResportesAnuales(){
    this.reporteService.reporteAnual().subscribe(data =>{
      this.reporteAnual = data['resultado'];
      this.reporteAnual.forEach(element => {
          this.totalAnual = this.totalAnual+ element.value;
      });
      
    },
    error =>{
    });
  }

  //cargar reportes semanales
  cargarResportesSemanales(){
    this.reporteService.reporteSemanal().subscribe(data =>{
      this.reporteSemanal = data['resultado'][0]['single'];
      this.reporteSemanalDividido = data['resultado'][1]['multi'];
      this.reporteSemanal.forEach(element => {
        this.totalSemanal += element['value'];
    });
    this.totalSemanalDividido = 0;
    this.reporteSemanalDividido.forEach(element => {
      this.totalSemanalDividido += element['series'][0]['value'];
      this.totalSemanalDividido += element['series'][1]['value'];
        
  });
      
    },
    error =>{
    });
  }

  //cargar reportes mensuales
  cargarResportesMensuales(){
    this.reporteService.reporteMensual().subscribe(data =>{
      this.reporteMensual = data['resultado'];
      this.reporteMensual.forEach(element => {
        this.totalMensual += element['series'][0]['value'];
        this.totalMensual += element['series'][1]['value'];
          
    });
    this.inicializarGraficos();
    this.cargar  = false;    
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

  abrirReporteSemanalDividido(){
    if (this.flechaReporteSemanalDividido === 'down') {
      this.mostrarReporteSemanalDividido = true;
      this.flechaReporteSemanalDividido = 'up';
    } else {
      this.flechaReporteSemanalDividido = 'down';
      this.mostrarReporteSemanalDividido = false;
    }
  }

  abrirReporteMensual(){
    if (this.flechaReporteMensual === 'down') {
      this.mostrarReporteMensual = true;
      this.flechaReporteMensual = 'up';
    } else {
      this.flechaReporteMensual = 'down';
      this.mostrarReporteMensual = false;
    }
  }

  cargarReportes(){
    this.cargarResportesAnuales();  
    this.cargarResportesSemanales();
    this.cargarResportesMensuales();
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
    this.noBarWhenZero = false; 

    //options reportes semanales
    this.yAxisLabelSemanales = 'Ganancias (S/'+this.totalSemanal+')';
    this.xAxisLabelSemanales = 'Día';

    //options reportes semanales divididos
    this.yAxisLabelSemanalesDivididos = 'Ganancias (S/'+this.totalSemanalDividido+')';

    //options reportes Mensuales
    this.yAxisLabelMensuales = 'Ganancias (S/'+this.totalMensual+')';
  }
  

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  onSelect(event:any) {
    console.log(event);
  }
}
