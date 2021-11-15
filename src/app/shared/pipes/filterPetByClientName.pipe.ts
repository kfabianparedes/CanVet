import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPetByClientName'
})
export class FilterPetByClientNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let mascota of value){
      if(mascota.CLIENTE_NOMBRES.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(mascota);
      };
    };
    return resultadoTexto;
  }

}
