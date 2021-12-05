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
import { AuthSesionGuard } from '../shared/guards/login.guard';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DashboardComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'categorias',component:CategoriaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'productos',component:ProductoComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'users',component:UserComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'proveedor',component:ProveedorComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'profile',component:ProfileComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'servicio',component:ServicioComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'venta',component:VentaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'compra',component:CompraComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'cliente',component:ClienteComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'caja',component:CajaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'mascota',component:MascotaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'reporte-grafico',component:ReportesComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'reporte-caja',component:ReporteCajaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'reporte-venta',component:ReporteVentaComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]},
      {path:'reporte-venta-diario',component:ReporteVentaDiarioComponent ,canLoad:[AuthSesionGuard],canActivate:[AuthSesionGuard]}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
