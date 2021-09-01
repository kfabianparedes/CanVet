import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports:[
    LoginComponent,
    ProfileComponent
  ]
})
export class AuthModule { }
