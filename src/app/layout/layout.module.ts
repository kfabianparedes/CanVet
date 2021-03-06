import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatProgressBarModule} from '@angular/material/progress-bar';




import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriaComponent } from './categoria/categoria.component';
import { ProductoComponent } from './producto/producto.component';
import { UserComponent } from './user/user.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import {PipesModule} from '../shared/pipes/pipes.module';
import { ServicioComponent } from './servicio/servicio.component';
import { VentaComponent } from './venta/venta.component';
import { CompraComponent } from './compra/compra.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CajaComponent } from './caja/caja.component';
import { MascotaComponent } from './mascota/mascota.component';
import { DirectivesModule } from '../shared/directives/directives.module';
import { ReportesComponent } from './reportes/reportes.component';
//gráficos  
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReporteCajaComponent } from './reporte-caja/reporte-caja.component';
import { ReporteVentaComponent } from './reporte-venta/reporte-venta.component';
import { ReporteVentaDiarioComponent } from './reporte-venta-diario/reporte-venta-diario.component';
import { ReporteCompraComponent } from './reporte-compra/reporte-compra.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    CategoriaComponent,
    ProductoComponent,
    UserComponent, 
    ProveedorComponent, 
    ServicioComponent, 
    VentaComponent, 
    CompraComponent, 
    ClienteComponent, 
    CajaComponent, 
    MascotaComponent, 
    ReportesComponent,
    ReporteCajaComponent,
    ReporteVentaComponent,
    ReporteVentaDiarioComponent,
    ReporteCompraComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RouterModule, // AppRoutingModule (Puede funcionar con el routingmodule sin reutilizar el approuting )
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    PipesModule,
    MatProgressBarModule,
    DirectivesModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  exports:[
    DashboardComponent,
    LayoutComponent,
  ],
  providers:[DatePipe,DecimalPipe]
})
export class LayoutModule { }
