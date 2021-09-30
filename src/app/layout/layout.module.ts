import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { CitaComponent } from './cita/cita.component';
import { VentaComponent } from './venta/venta.component';
import { CompraComponent } from './compra/compra.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,CategoriaComponent,ProductoComponent, UserComponent, ProveedorComponent, CitaComponent, VentaComponent, CompraComponent
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
    MatProgressBarModule
  ],
  exports:[
    DashboardComponent,
    LayoutComponent,
  ],
  providers:[DatePipe]
})
export class LayoutModule { }
