import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductByName'
})
export class FilterProductByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let producto of value){
      if(producto.PRO_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(producto);
      };
    };
    return resultadoTexto;
  }
}
