import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { RouterModule } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RouterModule, // AppRoutingModule (Puede funcionar con el routingmodule sin reutilizar el approuting )
    SharedModule
  ],
  exports:[
    DashboardComponent,
    LayoutComponent,
  ]
})
export class LayoutModule { }
