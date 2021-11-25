import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategoryByName'
})
export class FilterCategoryByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let categoria of value){
      if(categoria.CAT_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(categoria);
      };
    };
    return resultadoTexto;
  }
}
