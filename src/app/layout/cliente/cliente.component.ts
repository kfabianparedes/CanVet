import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;


  //Variables de cliente
  clientes: Cliente[] = [];
  clientes_juridicos: Cliente[] = [];
  busquedaClienteNatural: string = '';
  busquedaClienteJuridico: string = '';

  constructor(private clienteService:ClienteService) { }

  ngOnInit(): void {
    this.listarClientes();
  }
  listarClientes(){
    this.cargando = true;
    this.modalIn = false;
    this.clienteService.listarClientes().subscribe(
      data=>{
        this.clientes = data['resultado'].CLIENTES_NORMALES;
        this.clientes_juridicos = data['resultado'].CLIENTES_JURIDICOS
        this.cargando = false;
        console.log(data);
        console.log(this.clientes);
        console.log(this.clientes_juridicos);
      },
      error=>{
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

  registrarClienteJuridicoModal(){
  }
  registrarClienteNaturalModal(){
  }
}
