import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { FilterProductByNamePipe } from './filterProductByName.pipe';
import { FilterProductByCategoryPipe } from './filterProductByCategory.pipe';
import { FilterProductByUnityPipe } from './filterProductByUnity.pipe';
import { FilterClientByDNIPipe } from './filterClientByDNI.pipe';
import { FilterClientByRUCPipe } from './filterClientByRUC.pipe';

@NgModule({
  declarations: [					
    FilterPipe,
    FilterProductByNamePipe,
    FilterProductByCategoryPipe,
    FilterProductByUnityPipe,
    FilterClientByDNIPipe,
    FilterClientByRUCPipe
   ],
  imports: [
    CommonModule
  ],
  exports:[
    FilterPipe,
    FilterProductByNamePipe,
    FilterProductByCategoryPipe,
    FilterProductByUnityPipe,
    FilterClientByDNIPipe,
    FilterClientByRUCPipe
  ]
})
export class PipesModule { }
