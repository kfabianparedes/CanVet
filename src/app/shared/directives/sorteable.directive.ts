import { Directive, EventEmitter, Input, Output } from '@angular/core';

const rotate: {[key: string]: string} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1:any, v2:any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class SorteableDirective {

  @Input() sortable: string;
  @Input() direction: string = '';
  @Output() sort = new EventEmitter<{column: string, direction: string}>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
