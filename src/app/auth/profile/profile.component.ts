import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from 'src/app/models/Usuarios';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  USE_USUARIO : string;
  USE_NAMES: string;

  //Formularios reactivos
  usuarioForm: FormGroup;

  //Variables de alerta
  mostrar_alerta:boolean;
  mensaje_alerta:string;
  color_alerta:string;
  //variables de carga
  cargando:boolean;

  //Declara objeto usuario
  usuario: Usuarios;

  constructor(
    private storageService:StorageService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.USE_USUARIO = this.storageService.getString('USE_USUARIO');
    this.USE_NAMES = this.storageService.getString('USE_NAMES');
    this.inicializarFormulario();
  }

  inicializarFormulario(){
    this.usuarioForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(60)]],
      email:['',[Validators.required, Validators.maxLength(60)]],
      password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      nombres: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      apellido_paterno: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      apellido_materno: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      sexo: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
      celular: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]],
    });
  }
  
}
