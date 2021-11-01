import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterServiceByClientName'
})
export class FilterServiceByClientNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let servicio of value){
      if(servicio.CLIENTE_NOMBRES.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(servicio);
      };
    };
    return resultadoTexto;
  }

}
