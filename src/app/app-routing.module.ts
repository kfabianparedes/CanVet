import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout/layout-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './layout/notfound/notfound.component';

const routes: Routes = [

  //path: '/auth' AuthRouting
  //path: '/dashboard' LayoutRouting
  {path:'',redirectTo:'',pathMatch:'full'},
  {path:'**',redirectTo:'/not-found',pathMatch:'full'},
  {path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    LayoutRoutingModule
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
