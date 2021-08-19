import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriaComponent } from './categoria/categoria.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,CategoriaComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RouterModule, // AppRoutingModule (Puede funcionar con el routingmodule sin reutilizar el approuting )
    SharedModule,ReactiveFormsModule,FormsModule,NgbModule
  ],
  exports:[
    DashboardComponent,
    LayoutComponent,
  ]
})
export class LayoutModule { }
