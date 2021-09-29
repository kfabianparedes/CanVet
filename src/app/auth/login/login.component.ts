import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario} from 'src/app/models/usuario.model';
import { RoutingService } from 'src/app/services/routing.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
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

  //Declara objeto usuario
  usuario: Usuario;

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private storageService: StorageService,
    private routingService: RoutingService
    ) { 
      this.cargando = false;
  }

  ngOnInit(): void {
    this.storageService.clear();
    this.loginForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(60)]],
      password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
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
    this.mostrar_alerta = false;
    this.cargando = true;
    if(this.loginForm.valid){
      
      this.authService.autenticarUsuario(this.user.value,this.password.value).subscribe(
        respuesta=>{
          let cantidad = this.user.value.length;
          let codigoAscii = '';
          let dividir;
          let firstMitad;
          let secondMitad;
          let textoCompleto: string;

          this.cargando = false;
          if (respuesta.exito) {
            for ( let i = 0; i < cantidad ; i++) {
              codigoAscii = codigoAscii + this.user.value[i].charCodeAt(0).toString();
            }
            cantidad = codigoAscii.length;
            dividir = cantidad / 2;
            firstMitad = codigoAscii.substring(0, Math.round(dividir));
            secondMitad = codigoAscii.substring(Math.round(dividir), codigoAscii.length);
            textoCompleto = cantidad + '$$' + firstMitad + respuesta.autenticar + secondMitad;
            this.storageService.storeSub('USE_SUB', textoCompleto);
            this.storageService.storeString('USE_USUARIO', this.user.value.toLowerCase());    // Nombre de usuario (alias)
            this.storageService.storeString('USE_ID', respuesta.id);      // Es el ID de usuario
            this.storageService.storeString('USE_NAMES', respuesta.fullName);   // Concatenación de nombres y apellidos
            this.storageService.storeString("USE_EMAIL", respuesta.email); //email del cliente
            this.storageService.storeString('USE_TYPE', respuesta.tipo);     // Empleado 1 y Administrador 2 
            this.storageService.storeString('USE_STATE', respuesta.estado);
            this.storageService.storeString('USE_SESION', respuesta.sesion);
            if (respuesta.estado === 0) {     // Si estado es "inactivo" (0), entonces muestra un mensaje de error
              this.cargando = false;
              this.mostrar_alerta = true;
              this.mensaje_alerta = 'Su cuenta se encuentra inactiva, comuníquese con el administrador.';
              localStorage.clear();
            } else if (respuesta.estado === 1) {    // Si estado es "activo" (1), entonces lo redirecciona a la página principal
              this.routingService.replace(['/dashboard']);
            } else if (respuesta.estado === 2) {    // Si estado es "Pendiente de cambio de contraseña" (2), entonces lo redirecciona a la página para cambiar su contraseña
              this.cargando = true;
              this.storageService.storeString('USE_STATE', '1');
              this.routingService.replace(['/dashboard']);
            } else {    // Si no se obtiene un estádo válido
              this.cargando = false;
              this.mostrar_alerta = true;
              this.color_alerta='danger';
              this.mensaje_alerta = 'Ocurrió un problema al verificar el estado de su cuenta. Por favor, intenta nuevamente';
              localStorage.clear();
            }
          }else {
            this.mostrar_alerta = true;
            this.color_alerta='danger';
            this.mensaje_alerta = 'Las credenciales ingresadas son incorrectas. Por favor, intenta nuevamente';
          }
        },
        error=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.color_alerta='danger';
          
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_noExistenciaDeUsuario') {
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no se encuentra registrado.';
              this.alertaError();
            }else if (error['error']['error'] === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, intente de nuevo.';
              this.alertaError();
            }else if(error['error']['error'] === 'error_noExistenciaDeUsuario'){
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no se encuentra registrado.';
              this.alertaError();
            }else if(error['error']['error'] === 'error_userInvalid'){
              this.mensaje_alerta = 'El email o alias de usuario proporcionado no son correctos.';
              this.alertaError();
            // }else if(error['error']['error'] === 'error_crearSesion'){
            //   this.mensaje_alerta = 'Hubo un error al crear la sesión. Por favor, intente de nuevo';
            //   this.alertaError();
            }else if(error['error']['error'] === 'error_noExistenciaRol'){
              this.mensaje_alerta = 'Hubo un error al buscar el rol del usuario ingresado.';
              this.alertaError();
            }else if(error.error.error === 'error_contraseniaInvalid'){
              this.mensaje_alerta = 'La contraseña es incorrecta, Por favor, intente de nuevo.';
              this.alertaError();
            }
          } else {
            this.mensaje_alerta = 'Hubo un error al iniciar sesión. Por favor, intente de nuevo.';
            this.alertaError();
          }
          
        }
      );
    }else{
      this.mensaje_alerta = 'Los datos ingresados no respetan el formato. Por favor, intente de nuevo.';
      this.alertaError();
    }
    
  }
  
  alertaError()
  {
      this.color_alerta = 'danger';
      this.mostrar_alerta = true;
  }
}
