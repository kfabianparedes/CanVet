import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, PipeTransform, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { DatosJuridicos } from 'src/app/models/datos-juridicos';
import { Empresa } from 'src/app/models/empresa';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { compare, SorteableDirective, SortEvent } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers:[DecimalPipe]
})
export class ClienteComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  active = 1;
  //Variables de tabla
  

  //Variables de cliente
  clientes: Cliente[] = [];
  clientes_juridicos: Cliente[] = [];
  busquedaClienteNatural: string = '';
  busquedaClienteNatural2: string = '';
  busquedaClienteJuridico: string = '';
  sortClientesNatural: any[];
  sortClientesJuridico: any[]= [];

  //Variable de registro de cliente
  clienteForm : FormGroup;
  clienteJuridicoForm : FormGroup;
  empresas: Empresa[] = [];
  clienteNatural: Cliente = new Cliente();
  clienteJuridico: Cliente = new Cliente();
  datosJuridicos: DatosJuridicos = new DatosJuridicos();
  @ViewChild('clienteModal') clienteModal: ElementRef;
  @ViewChild('editarClienteNaturalModal') editarClienteNaturalModal: ElementRef;
  @ViewChild('editarclienteJuridicoModal') editarclienteJuridicoModal: ElementRef;

  //Variables de actualización de clientes
  clienteSeleccionado: any;
  datosJuridicoSeleccionado: DatosJuridicos = new DatosJuridicos();

  currentPage = 1;
  itemsPerPage = 50;

  currentPageJuridico = 1;
  itemsPerPageJuridico = 50;
  constructor(
    private clienteService:ClienteService,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private configModal: NgbModalConfig,
    private empresaService:EmpresaService
  ) {
      this.configModal.backdrop = 'static';
      this.configModal.keyboard = false;
      this.configModal.size = 'lg';
  }
  
  ngOnInit(): void {
    this.listarClientes();
    this.listarEmpresas();
    this.inicializarClienteNaturalFormulario();
    this.inicializarClienteJuridicoFormulario();
  }
  
  limpiar(){
    this.clienteForm.reset();
    this.clienteJuridicoForm.reset();
    this.clienteNatural = new Cliente();
    this.clienteJuridico = new Cliente();
  }
  closeModal(): any {
    this.modal.dismissAll();
    this.limpiar();
  }
  listarEmpresas(){
    this.modalIn = false;
    this.cargando = true;
    this.empresaService.listasTipodeEmpresas().subscribe(
      (data)=>{
        this.empresas = data['resultado'];
        this.cargando = false;
      },
      (error)=>{
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
  listarClientes(){
    this.mostrarTablaJuridica = false;
    this.mostrarTablaNatural = false;
    this.flechaNatural = 'down';
    this.flechaJuridica = 'down';
    this.cargando = true;
    this.modalIn = false;
    this.clienteService.listarClientes().subscribe(
      (data)=>{
        this.sortClientesNatural = data['resultado'].CLIENTES_NORMALES;
        this.sortClientesJuridico = data['resultado'].CLIENTES_JURIDICOS;
        this.clientes = this.sortClientesNatural.slice();
        this.clientes_juridicos = this.sortClientesJuridico.slice();
        this.cargando = false;
        this.mostrarTablaJuridica = true;
        this.mostrarTablaNatural = true;
        this.flechaNatural = 'up';
        this.flechaJuridica = 'up';
        console.log(data);
        console.log(this.clientes);
        console.log(this.clientes_juridicos);

      },
      (error)=>{
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
  borrarCliente(id:number){
    
  }
  editarClienteNatural(cliente:any){
    this.clienteSeleccionado = cliente;
    this.inicializarClienteNaturalFormulario();
    this.nombres.setValue(this.clienteSeleccionado.CLIENTE_NOMBRES);
    this.apellidos.setValue(this.clienteSeleccionado.CLIENTE_APELLIDOS);
    this.dni.setValue(this.clienteSeleccionado.CLIENTE_DNI);
    this.direccion.setValue(this.clienteSeleccionado.CLIENTE_DIRECCION);
    this.celular.setValue(this.clienteSeleccionado.CLIENTE_TELEFONO);
    this.correo_.setValue(this.clienteSeleccionado.CLIENTE_CORREO);
    this.modal.open(this.editarClienteNaturalModal);
  }
  editarClienteJuridico(cliente_juridico:any){
    this.clienteSeleccionado = cliente_juridico;
    console.log(this.clienteSeleccionado);
    this.nombres_.setValue(this.clienteSeleccionado.CLIENTE_NOMBRES);
    this.razon_social.setValue(this.clienteSeleccionado.DJ_RAZON_SOCIAL);
    this.ruc.setValue(this.clienteSeleccionado.DJ_RUC);
    this.tipo_empresa.setValue(this.clienteSeleccionado.TIPO_EMPRESA_ID);
    this.celular_.setValue(this.clienteSeleccionado.CLIENTE_TELEFONO);
    this.direccion_.setValue(this.clienteSeleccionado.CLIENTE_DIRECCION);
    this.correo.setValue(this.clienteSeleccionado.CLIENTE_CORREO);

    this.modal.open(this.editarclienteJuridicoModal);
  }
  actualizarClienteNatural(){
    this.mostrar_alerta = false;
    this.modalIn = true;
    this.cargando = true;
    this.clienteNatural.CLIENTE_ID = this.clienteSeleccionado.CLIENTE_ID;
    this.clienteNatural.CLIENTE_NOMBRES = this.nombres.value;
    this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
    this.clienteNatural.CLIENTE_TELEFONO = this.celular.value;
    this.clienteNatural.CLIENTE_DNI = this.dni.value;
    this.clienteNatural.CLIENTE_DIRECCION = this.direccion.value;
    this.clienteNatural.CLIENTE_CORREO = this.correo_.value;
    this.clienteService.actualizarCliente(this.clienteNatural).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.mostrar_alerta = true;
        this.mensaje_alerta = 'El cliente se actualizó correctamente.';
        this.tipo_alerta = 'success';
        this.modal.dismissAll();  
        this.limpiar();
        this.listarClientes();
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.modalIn = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
          } else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_ejecucionQuery'){
            this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_existenciaDNI'){
            this.mensaje_alerta = 'El DNI ingresado ya le pertenece a un cliente. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_noExistenciaCliente'){
            this.mensaje_alerta = 'Hubo un error identificando al cliente. Por favor, vuelva a intentarlo.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
  actualizarClienteJuridico(){
    this.mostrar_alerta = false;
    this.modalIn = true;
    this.cargando = true;
    this.clienteNatural.CLIENTE_ID = this.clienteSeleccionado.CLIENTE_ID;
    this.clienteNatural.CLIENTE_NOMBRES = this.nombres_.value;
    this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
    this.clienteNatural.CLIENTE_TELEFONO = this.celular_.value;
    this.clienteNatural.CLIENTE_DIRECCION = this.direccion_.value;
    this.clienteNatural.CLIENTE_CORREO = this.correo.value;

    this.datosJuridicos.DJ_RAZON_SOCIAL = this.razon_social.value;
    this.datosJuridicos.DJ_RUC = this.ruc.value;
    this.datosJuridicos.TIPO_EMPRESA_ID = this.tipo_empresa.value;
    this.clienteService.actualizarCliente(this.clienteNatural,this.datosJuridicos).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.mostrar_alerta = true;
        this.mensaje_alerta = 'El cliente se actualizó correctamente.';
        this.tipo_alerta = 'success';
        this.modal.dismissAll();  
        this.limpiar();
        this.listarClientes();
      },
      (error)=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.modalIn = true;
        this.tipo_alerta='danger';
        if (error.error.error !== undefined) {
          if (error.error.error === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
          } else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_ejecucionQuery'){
            this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
          }else if(error.error.error === 'error_existenciaRUC'){
            this.mensaje_alerta = 'El RUC ingresado ya le pertenece a un usuario. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_noExistenciaTipoEmpresa'){
            this.mensaje_alerta = 'Hubo un error identificando el tipo de empresa. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_ExistenciaRazonSocial'){
            this.mensaje_alerta = 'La razón social le pertenece a otro cliente. Por favor, vuelva a intentarlo.';
          }else if(error.error.error === 'error_noExistenciaCliente'){
            this.mensaje_alerta = 'Hubo un error identificando al cliente. Por favor, vuelva a intentarlo.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }
  registrarCliente(){
    this.modal.open(this.clienteModal);
    this.mostrar_alerta = false;
    this.modalIn = true;
    this.inicializarClienteNaturalFormulario();
    this.inicializarClienteJuridicoFormulario();
  }
  
  registrarClienteNatural(){
    if(this.clienteForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular.value;
      this.clienteNatural.CLIENTE_DNI = this.dni.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo_.value;
      this.clienteService.registrarCliente(this.clienteNatural).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.limpiar();
          this.listarClientes();
        },
        (error)=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.modalIn = true;
          this.tipo_alerta='danger';
          if (error.error.error !== undefined) {
            if (error.error.error === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
            } else if(error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaDNI'){
              this.mensaje_alerta = 'El DNI ingresado ya le pertenece a un cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }
  registrarClienteJuridico(){
    if(this.clienteJuridicoForm.invalid){
      this.mensaje_alerta = 'No ha ingresado datos válidos. Vuelva a intentarlo de nuevo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      this.modalIn = true;
    }else{
      this.mostrar_alerta = false;
      this.modalIn = true;
      this.cargando = true;
      this.clienteNatural.CLIENTE_NOMBRES = this.nombres_.value;
      this.clienteNatural.CLIENTE_APELLIDOS = this.apellidos.value;
      this.clienteNatural.CLIENTE_TELEFONO = this.celular_.value;
      this.clienteNatural.CLIENTE_DIRECCION = this.direccion_.value;
      this.clienteNatural.CLIENTE_CORREO = this.correo.value;

      this.datosJuridicos.DJ_RAZON_SOCIAL = this.razon_social.value;
      this.datosJuridicos.DJ_RUC = this.ruc.value;
      this.datosJuridicos.TIPO_EMPRESA_ID = this.tipo_empresa.value;
      this.clienteService.registrarCliente(this.clienteNatural,this.datosJuridicos).subscribe(
        (data)=>{
          this.cargando = false;
          this.modalIn = false;
          this.mostrar_alerta = true;
          this.mensaje_alerta = 'El registro del cliente se realizó correctamente.';
          this.tipo_alerta = 'success';
          this.modal.dismissAll();  
          this.listarClientes();
          this.limpiar();
        },
        (error)=>{
          this.cargando = false;
          this.mostrar_alerta = true;
          this.modalIn = true;
          this.tipo_alerta='danger';
          if (error.error.error !== undefined) {
            if (error.error.error === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Problemas con el servidor, vuelva a intentarlo.';
            } else if(error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar la orden de compra, Por favor, actualice la página o inténtelo más tarde.';
            }else if(error.error.error === 'error_existenciaRUC'){
              this.mensaje_alerta = 'El RUC ingresado ya le pertenece a un usuario. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_noExistenciaTipoEmpresa'){
              this.mensaje_alerta = 'Hubo un error identificando el tipo de empresa. Por favor, vuelva a intentarlo.';
            }else if(error.error.error === 'error_ExistenciaRazonSocial'){
              this.mensaje_alerta = 'La razón social le pertenece a otro cliente. Por favor, vuelva a intentarlo.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
          }
        }
      );
    }
  }
  inicializarClienteNaturalFormulario(){
    this.clienteForm = this.formBuilder.group({
      nombres:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      apellidos: ['', [Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+'),Validators.maxLength(30)]],
      celular: ['', [Validators.required, Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
      direccion: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
      correo_: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    });
  }
  // getters & setters
  get nombres() {
    return this.clienteForm.get('nombres');
  } 
  get apellidos() {
    return this.clienteForm.get('apellidos');
  } 
  get celular() {
    return this.clienteForm.get('celular');
  } 
  get dni() {
    return this.clienteForm.get('dni');
  } 
  get direccion() {
    return this.clienteForm.get('direccion');
  } 
  get correo_() {
    return this.clienteForm.get('correo_');
  }
  inicializarClienteJuridicoFormulario(){
    this.clienteJuridicoForm = this.formBuilder.group({
      nombres_:['',[Validators.required,Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'),Validators.maxLength(100)]],
      razon_social: ['', [Validators.required,Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ. ]+$'), Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(11),  Validators.maxLength(11)]],
      tipo_empresa:['',[Validators.required]],
      celular_: ['', [Validators.pattern('[+][0-9]+'), Validators.maxLength(12), Validators.minLength(12)]] ,
      direccion_: ['', [Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
      correo: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    });
  }
  // getters & setters
  get nombres_() {
    return this.clienteJuridicoForm.get('nombres_');
  } 
  get celular_() {
    return this.clienteJuridicoForm.get('celular_');
  } 
  get direccion_() {
    return this.clienteJuridicoForm.get('direccion_');
  } 
  get razon_social() {
    return this.clienteJuridicoForm.get('razon_social');
  } 
  get ruc() {
    return this.clienteJuridicoForm.get('ruc');
  } 
  get tipo_empresa() {
    return this.clienteJuridicoForm.get('tipo_empresa');
  } 
  get correo() {
    return this.clienteJuridicoForm.get('correo');
  }
  

  /************************************* TABLAS ************************************/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  
  onSort({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.clientes = this.sortClientesNatural.slice();
    } else {
      this.clientes = [...this.sortClientesNatural].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  onSorted({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.clientes_juridicos = this.sortClientesJuridico.slice();
    } else {
      this.clientes_juridicos = [...this.sortClientesJuridico].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  
  /****************** ABRIR Y CERRAR TABLAS **************/
  //Mostrar 
  mostrarTablaNatural = false;
  mostrarTablaJuridica = false;
  flechaNatural:string = 'down';
  flechaJuridica:string = 'down';

  abrirTablaNatural(){
    if (this.flechaNatural === 'down') {
      this.mostrarTablaNatural = true;
      this.flechaNatural = 'up';
    } else {
      this.flechaNatural = 'down';
      this.mostrarTablaNatural = false;
    }
  }
  abrirTablaJuridica(){
    if (this.flechaJuridica === 'down') {
      this.mostrarTablaJuridica = true;
      this.flechaJuridica = 'up';
    } else {
      this.flechaJuridica = 'down';
      this.mostrarTablaJuridica = false;
    }
  }
}
