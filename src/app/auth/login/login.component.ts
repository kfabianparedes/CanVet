import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // public loginForm = this.formBuilder.group({
  //   user:['',[Validators.required, Validators.maxLength(60)]],
  //   password:['',Validators.required],
  //   recaptcha: ['', Validators.required]
  // });
  captchaInvalido:boolean=false;
  siteKey=environment.captcha;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(60)]],
      password:['',[Validators.required,Validators.maxLength(60)]],
      recaptcha: ['', Validators.required]
    });
  }
   // Get usuarioForm
   get user() {
    return this.loginForm.get('user');
  }

  get password() {
    return this.loginForm.get('password');
  }

  expiraCaptcha(){
    this.captchaInvalido=false
  }
}
