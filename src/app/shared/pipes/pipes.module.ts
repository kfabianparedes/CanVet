import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { FilterProductPipe } from './filterProduct.pipe';



@NgModule({
  declarations: [	
    FilterPipe,
    FilterProductPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[FilterPipe,FilterProductPipe]
})
export class PipesModule { }
