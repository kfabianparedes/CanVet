import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    let resultadoTexto = [];
    for(let producto of value){
      if(producto.PROD_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(producto);
      };
    };
    return resultadoTexto;
  }

}
