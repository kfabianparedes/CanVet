import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientByDNI'
})
export class FilterClientByDNIPipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let cliente of value){
      if(cliente.CLIENTE_DNI.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(cliente);
      };
    };
    return resultadoTexto;
  }

}
