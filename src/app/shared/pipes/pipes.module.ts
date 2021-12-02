import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { FilterProductByNamePipe } from './filterProductByName.pipe';
import { FilterProductByCategoryPipe } from './filterProductByCategory.pipe';
import { FilterProductByUnityPipe } from './filterProductByUnity.pipe';
import { FilterClientByDNIPipe } from './filterClientByDNI.pipe';
import { FilterClientByRUCPipe } from './filterClientByRUC.pipe';
import { FilterPetByNamePipe } from './filterPetByName.pipe';
import { FilterClienteByNamePipe } from './filterClienteByName.pipe';
import { FilterServiceByClientNamePipe } from './filterServiceByClientName.pipe';
import { FilterPetByClientNamePipe } from './filterPetByClientName.pipe';
import { FilterCategoryByNamePipe } from './filterCategoryByName.pipe';
import { FilterUserByNamePipe } from './filterUserByName.pipe';

@NgModule({
  declarations: [										
    FilterPipe,
    FilterProductByNamePipe,
    FilterProductByCategoryPipe,
    FilterProductByUnityPipe,
    FilterClientByDNIPipe,
    FilterClientByRUCPipe,
    FilterPetByNamePipe,
    FilterClienteByNamePipe,
    FilterServiceByClientNamePipe,
    FilterPetByClientNamePipe,
    FilterCategoryByNamePipe,
    FilterUserByNamePipe
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
    FilterClientByRUCPipe,
    FilterPetByNamePipe,
    FilterClienteByNamePipe,
    FilterServiceByClientNamePipe,
    FilterPetByClientNamePipe,
    FilterCategoryByNamePipe,
    FilterUserByNamePipe
  ]
})
export class PipesModule { }
