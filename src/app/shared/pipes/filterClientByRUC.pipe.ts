import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientByRUC'
})
export class FilterClientByRUCPipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let cliente_juridico of value){
      if(cliente_juridico.DJ_RUC.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(cliente_juridico);
      };
    };
    return resultadoTexto;
  }

}
