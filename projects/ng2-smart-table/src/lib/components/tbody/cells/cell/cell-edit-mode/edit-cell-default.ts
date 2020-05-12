import { Component, Output, EventEmitter, Input } from '@angular/core';

import { Cell } from '../../../../../lib/data-set/row/cell/cell';

@Component({
  template: ''
})
export class EditCellDefault {

  @Input() cell: Cell;
  @Input() inputClass = '';

  @Output() edited = new EventEmitter<any>();

  onEdited(event: any): boolean {
    this.edited.next(event);
    return false;
  }

  onStopEditing(): boolean {
    this.cell.getRow().editing = false;
    return false;
  }

  onClick(event: any) {
    event.stopPropagation();
  }
}
