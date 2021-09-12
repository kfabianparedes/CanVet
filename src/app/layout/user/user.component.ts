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
  userSelected:Usuario; 
  currentPage = 1;
  itemsPerPage = 10;

  //Variables de carga y error
  carga = false;

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
    this.inicializarFormulario();
    this.listUsers();
    this.listarRoles();
  }

  closeModal(): any {
    this.userForm.reset();
    this.modal.dismissAll();
  }
  obtenerSexo(sexo: string) {
    this.sexo = sexo;
  }  
  registerUser(){
    this.inicializarFormulario();
    this.modal.open(this.createUserModal);
  }
  createUser(){
    
  }
  editUser(user:Usuario){

  }

  updateUser(user:Usuario){

  }
  disableUser(id:number, state:number){

  }
  listUsers(){
    this.userService.listUsers().subscribe(
      data=>{
        this.usuarios = data.resultado;
      }
      ,error=>{
        this.carga = false;
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
    this.rolService.listUsers().subscribe(
      data=>{
        this.roles = data.resultado;
      }
      ,error=>{
        this.carga = false;
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
  
}
