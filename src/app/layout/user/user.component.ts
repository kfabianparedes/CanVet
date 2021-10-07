import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Rol } from 'src/app/models/rol.model';
import { Usuario } from 'src/app/models/usuario.model';
import { RolService } from 'src/app/services/rol.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  userForm : FormGroup;
  sexo:string = 'F';
  opacarDateFechaNacimiento: boolean = true;
  constructor(private formBuilder: FormBuilder,
              public modal: NgbModal,
              public configModal: NgbModalConfig,
              private userService: UserService,
              private datePipe: DatePipe,
              private rolService: RolService) 
              { 
                configModal.backdrop = 'static';
                configModal.keyboard = false;
                configModal.size = 'lg'
              }

  filtroTexto:string;
  userSelected = new Usuario(); 
  newUser = new Usuario();
  currentPage = 1;
  itemsPerPage = 10;

  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  //Variables para ocultar la contraseña
  PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
  PASSWORD_CURRENT_TYPE = 'password';

  //modal para editar un usuario
  @ViewChild('editUserModal') editUserModal: ElementRef;
  //modal para crear un usuario
  @ViewChild('createUserModal') createUserModal: ElementRef;
  //modal para visualizar un usuario
  @ViewChild('seeMoreModal') seeMoreModal: ElementRef; 

  ngOnInit(): void {
    this.listUsers();
    this.listarRoles();
  }
    //reactive form 
  inicializarFormulario(){
    this.userForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
      apellido_paterno: ['', [Validators.required, Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'), Validators.maxLength(30)]],
      apellido_materno: ['', [Validators.required, Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'), Validators.maxLength(30)]],
      fecha_nacimiento: ['', [Validators.required ]],
      celular: ['', [Validators.required, Validators.pattern('[+][0-9]+'), Validators.maxLength(20), Validators.minLength(12)]] ,
      dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
      direccion: ['', [Validators.required , Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
      rol:['',[Validators.required]]
    });
  }

  //getters & setters
  get user() {
    return this.userForm.get('user');
  }
  get email() {
    return this.userForm.get('email');
  }
  get contrasena() {
    return this.userForm.get('contrasena');
  }
  get nombres() {
    return this.userForm.get('nombres');
  }
  get apellido_paterno() {
    return this.userForm.get('apellido_paterno');
  }
  get apellido_materno() {
    return this.userForm.get('apellido_materno');
  }
  get fecha_nacimiento() {
    return this.userForm.get('fecha_nacimiento');
  }
  get celular() {
    return this.userForm.get('celular');
  }
  get dni() {
    return this.userForm.get('dni');
  }
  get direccion() {
    return this.userForm.get('direccion');
  }
  get rol() {
    return this.userForm.get('rol');
  }
  obtenerSexo(sexo: string) {
    this.sexo = sexo;
  } 

  closeModal(): any {
    this.modal.dismissAll();
    this.inicializarFormulario();
  }

  registerUserModal(){
    this.inicializarFormulario();
    this.modal.open(this.createUserModal);
  }

  createUser(){
    this.cargando = true;
    if(this.userForm.invalid){
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      this.modalIn = true;
      this.newUser.USU_NOMBRES = this.nombres.value;
      this.newUser.USU_APELLIDO_PATERNO = this.apellido_paterno.value;
      this.newUser.USU_APELLIDO_MATERNO = this.apellido_materno.value;
      this.newUser.USU_USUARIO = this.user.value;
      this.newUser.USU_EMAIL = this.email.value;
      this.newUser.USU_SEXO = this.sexo;
      this.newUser.USU_CELULAR = this.celular.value;
      this.newUser.USU_DIRECCION = this.direccion.value;
      this.newUser.USU_FECHA_NACIMIENTO = this.fecha_nacimiento.value;
      this.newUser.USU_CONTRASENIA = this.contrasena.value;
      this.newUser.USU_DNI = this.dni.value;
      this.newUser.USU_ESTADO = 1; //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      this.newUser.ROL_ID = this.rol.value;
      this.userService.registerUser(this.newUser).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Usuario registrado con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listUsers();
          }
        },
        error=>{
          this.cargando = false;
          this.modalIn = true;
          this.mostrar_alerta = true;
          this.tipo_alerta='danger';
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página o inténtelo más tarde.';
            } else if (error.error.error === 'error_emailExistente'){
              this.mensaje_alerta = 'El correo electrónico ya le pertenece a una cuenta. Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_nombreUsuarioExistente'){
              this.mensaje_alerta = 'El nombre de usuario ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_dniExistente'){
              this.mensaje_alerta = 'El DNI ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_celularExistente'){
              this.mensaje_alerta = 'El número de celular ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar el usuario, Por favor, actualice la página o inténtelo más tarde.';
            } else if (error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, revise los campos ingresados.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
          }
        }
      )
    }
  }
  editUser(user:Usuario){
    this.userSelected = user;
    this.modal.open(this.editUserModal);
  }

  updateUser(user:Usuario){
    
  }
  disableUser(id:number, state:number){

  }
  listUsers(){
    this.cargando = true;
    this.userService.listUsers().subscribe(
      data=>{
        this.usuarios = data.resultado;
        this.cargando = false;
      }
      ,error=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
  searchUser(){
    if(this.usuarios.length<0){
      this.mensaje_alerta = 'No existen usuarios registrados, registre uno y vuelva a intentarlo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      return;
    }else{
      //Realizar búsqueda de usuario
    }
  }
  listarRoles(){
    this.rolService.listRols().subscribe(
      data=>{
        this.roles = data.resultado;
      }
      ,error=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    )
  }
  seeMore(user:Usuario){
    this.userSelected = user;
    this.modal.open(this.seeMoreModal);
  }
  cambiarVistaContrasena() { // CAMBIA DE ICONO Y DE TIPO EN LA CONSTRASEÑA
    if (this.PASSWORD_CURRENT_ICON === 'fa fa-eye-slash') {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye';
      this.PASSWORD_CURRENT_TYPE = 'text';
    } else {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
      this.PASSWORD_CURRENT_TYPE = 'password';
    }
  }
  getTodayFechaNacimiento(): string {
    const fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd').split('-');
    const dia = fechaActual[2];
    const mes = fechaActual[1];
    const anio = Number(fechaActual[0]) - 18;
    const fechaMaxima = anio + '-' + mes + '-' + dia;

    return new Date(fechaMaxima).toISOString().split('T')[0] ;
  }
  cambiarDeStyleDate() {
    this.opacarDateFechaNacimiento = false;
  }
  asignarCamposForm(usuario: Usuario){
    // this.user.setValue(this.usuario.USU_USUARIO);
    // this.email.setValue(this.usuario.USU_EMAIL);
    // this.nombres.setValue(this.usuario.USU_NOMBRES);
    // this.contrasena.setValue('');
    // this.apellido_paterno.setValue(this.usuario.USU_APELLIDO_PATERNO);
    // this.apellido_materno.setValue(this.usuario.USU_APELLIDO_MATERNO);
    // this.sexo.setValue(this.usuario.USU_SEXO);
  }
  
}
