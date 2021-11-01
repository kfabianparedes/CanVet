import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClienteByName'
})
export class FilterClienteByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let cliente of value){
      if(cliente.CLIENTE_NOMBRES.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(cliente);
      };
    };
    return resultadoTexto;
  }

}
