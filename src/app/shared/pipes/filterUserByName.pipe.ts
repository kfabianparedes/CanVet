import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUserByName'
})
export class FilterUserByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let user of value){
      if(user.USU_NOMBRES.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(user);
      };
    };
    return resultadoTexto;
  }
}
