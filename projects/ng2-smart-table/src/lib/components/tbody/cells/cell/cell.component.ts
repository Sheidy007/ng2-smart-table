import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Grid } from '../../../../lib/grid';
import { Cell } from '../../../../lib/data-set/row/cell/cell';
import { Row } from '../../../../lib/data-set/row/row';

@Component({
  selector: 'ng2-smart-table-cell',
  template: `
		<table-cell-view-mode *ngIf="!isInEditing || (grid.getSetting().editSeparate && !isNew) || (grid.getSetting().createSeparate && isNew)" [cell]="cell">
    </table-cell-view-mode>
		<table-cell-edit-mode (edited)="onEdited($event)"
		                      *ngIf="isInEditing &&
		                            (!grid.getSetting().editSeparate && !isNew || !grid.getSetting().createSeparate && isNew)"
		                      [cell]="cell"
		                      [inputClass]="inputClass">
		</table-cell-edit-mode>
  `
})
export class CellComponent {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() saveUpdateConfirm: EventEmitter<any>;
  @Input() createConfirm: EventEmitter<any>;
  @Input() isNew: boolean;
  @Input() cell: Cell;
  @Input() inputClass = '';
  @Input() isInEditing = false;

  @Output() edited = new EventEmitter<any>();

  onEdited(event: any) {
    if (this.isNew) {
      this.grid.create(this.grid.getNewRow(), this.createConfirm);
    } else {
      this.grid.save(this.row, this.saveUpdateConfirm);
    }
  }
}
