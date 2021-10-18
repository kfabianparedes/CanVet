import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductByUnity'
})
export class FilterProductByUnityPipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let producto of value){
      if(producto.PRO_TAMANIO_TALLA.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(producto);
      };
    };
    return resultadoTexto;
  }
}
