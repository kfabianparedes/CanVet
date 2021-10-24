import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPetByName'
})
export class FilterPetByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let mascota of value){
      if(mascota.MAS_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(mascota);
      };
    };
    return resultadoTexto;
  }

}
