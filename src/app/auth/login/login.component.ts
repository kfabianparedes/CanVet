import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  siteKey="";
  loginForm: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(60)]],
      password:['',Validators.required],
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
}
