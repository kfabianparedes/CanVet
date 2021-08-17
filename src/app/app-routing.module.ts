import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { NotfoundComponent } from './layout/notfound/notfound.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DashboardComponent},
      {path:'',redirectTo:'/dashboard',pathMatch:'full'},
    ]
  },

  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},

  {path:'**',redirectTo:'/not-found',pathMatch:'full'},
  {path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
