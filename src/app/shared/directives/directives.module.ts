import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorteableDirective } from './sorteable.directive';



@NgModule({
  declarations: [	
      SorteableDirective
   ],
  imports: [
    CommonModule
  ],
  exports:[
    SorteableDirective
  ]
})
export class DirectivesModule { }
