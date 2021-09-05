import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  usuarios: Usuario[] = [];
  userForm : FormGroup;
  constructor(private formBuilder: FormBuilder,
              public modal: NgbModal,
              public configModal: NgbModalConfig) 
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

  //modal para editar una categoria
  @ViewChild('editUserModal') editUserModal: ElementRef;
  //modal para crear una categoria
  @ViewChild('createUserModal') createUserModal: ElementRef;
  
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  closeModal(): any {
    this.userForm.reset();
    this.modal.dismissAll();
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
