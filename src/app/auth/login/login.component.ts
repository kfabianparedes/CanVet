import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //Obtiene el key del captcha según el dominio (local o desplegado)
  siteKey=environment.captcha;
  //Avisa cuando termino el tiempo del captcha
  captchaInvalido:boolean=false;
  
  //Formularios reactivos
  loginForm: FormGroup;

  //Variables de alerta
  mostrar_alerta:boolean;
  mensaje_alerta:string;
  color_alerta:string;
  //variables de carga
  cargando:boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService
    ) { 
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

  authLogin(){
    if(this.loginForm.valid){
      this.authService.autenticarUsuario(this.user.value,this.password.value).subscribe(
        data=>{
          console.log(data);
        },
        error=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.color_alerta='danger';
          
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_noExistenciaDeUsuario') {
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no se encuentra registrado.';
            }else if (error['error']['error'] === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, intente de nuevo.';
            }else if(error['error']['error'] === 'error_noExistenciaDeUsuario'){
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no se encuentra registrado.';
            }else if(error['error']['error'] === 'error_userInvalid'){
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no son correctos.';
            }else if(error['error']['error'] === 'error_crearSesion'){
              this.mensaje_alerta = 'Hubo un error al crear la sesión. Por favor, intente de nuevo';
            }else if(error['error']['error'] === 'error_noExistenciaRol'){
              this.mensaje_alerta = 'Hubo un error al buscar el rol del usuario ingresado.';
            }
          } else {
            this.mensaje_alerta = 'Hubo un error al iniciar sesión. Por favor, intente de nuevo.';
          }
          
        }
      );
    }else{
      this.mensaje_alerta = 'Los datos ingresados no respetan el formato. Por favor, intente de nuevo.';
    };
    Swal.fire({
      icon: 'error',
      title: '¡Hubo un error!',
      text: this.mensaje_alerta,
    })
  }
  
  alertaError(mensaje:string)
  {
    Swal.fire({
      icon: 'error',
      title: '¡Hubo un error!',
      text: mensaje,
    })
  }
}
