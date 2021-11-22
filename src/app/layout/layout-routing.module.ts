import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../auth/profile/profile.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { ServicioComponent } from './servicio/servicio.component';
import { CompraComponent } from './compra/compra.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { ProductoComponent } from './producto/producto.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { UserComponent } from './user/user.component';
import { VentaComponent } from './venta/venta.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CajaComponent } from './caja/caja.component';
import { MascotaComponent } from './mascota/mascota.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ReporteCajaComponent } from './reporte-caja/reporte-caja.component';
import { ReporteVentaComponent } from './reporte-venta/reporte-venta.component';
import { ReporteVentaDiarioComponent } from './reporte-venta-diario/reporte-venta-diario.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DashboardComponent},
      {path:'categorias',component:CategoriaComponent},
      {path:'productos',component:ProductoComponent},
      {path:'users',component:UserComponent},
      {path:'proveedor',component:ProveedorComponent},
      {path:'profile',component:ProfileComponent},
      {path:'servicio',component:ServicioComponent},
      {path:'venta',component:VentaComponent},
      {path:'compra',component:CompraComponent},
      {path:'cliente',component:ClienteComponent},
      {path:'caja',component:CajaComponent},
      {path:'mascota',component:MascotaComponent},
      {path:'reporte-grafico',component:ReportesComponent},
      {path:'reporte-caja',component:ReporteCajaComponent},
      {path:'reporte-venta',component:ReporteVentaComponent},
      {path:'reporte-venta-diario',component:ReporteVentaDiarioComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
