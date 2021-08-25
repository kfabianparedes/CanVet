import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { CategoriaComponent } from './layout/categoria/categoria.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { NotfoundComponent } from './layout/notfound/notfound.component';
import { ProductoComponent } from './layout/producto/producto.component';
import { UserComponent } from './layout/user/user.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DashboardComponent},
      {path:'',redirectTo:'/dashboard',pathMatch:'full'},
      {path:'categorias',component:CategoriaComponent},
      {path:'productos',component:ProductoComponent},
      {path:'users',component:UserComponent},
      {path:'profile/:id',component:ProfileComponent},
    ]
  },

  {path:'login',component:LoginComponent},
  

  {path:'**',redirectTo:'/not-found',pathMatch:'full'},
  {path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
