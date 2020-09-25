import { Component, Input, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Cell } from '../../../../grid-libs/data-set/row/cell/cell';

@Component({
  selector: '[ngx-rt-cell]',
  template: `
		<div *ngIf="!isInEditing
                || (grid.settings.actions.edit?.viewType!=='inline' && !isNew)
                || (grid.settings.actions.add?.viewType!=='inline' && isNew)
                || !cell.isEditable()" [cell]="cell"
		     [grid]="grid"
		     class="ngx-rt-cell-view-mode"
		     ngx-rt-cell-view-mode>
		</div>
		<div (edited)="onEdited()"
		     *ngIf="isInEditing && cell.isEditable() &&
		            (grid.settings.actions.edit?.viewType==='inline' && !isNew
		            || grid.settings.actions.add?.viewType==='inline' && isNew)"
		     [cell]="cell"
		     [grid]="grid"
		     [inputClass]="inputClass"
		     class="ngx-rt-cell-edit-mode"
		     ngx-rt-cell-edit-mode>
		</div>
  `
})
export class CellComponent implements OnInit {

  @Input() grid: Grid;
  @Input() isNew: boolean;
  @Input() cell: Cell;
  @Input() isInEditing = false;

  inputClass = '';

  ngOnInit() {
    if (this.isNew) {
      this.inputClass = this.grid.settings.actions.add?.inputClass ?? '';
    } else {
      this.inputClass = this.grid.settings.actions.edit?.inputClass ?? '';
    }
  }

  onEdited() {
    if (this.isNew) {
      this.grid.gridActionsFunctions.applyCreate(this.grid.getNewRow());
    } else {
      this.grid.gridActionsFunctions.applyEdit(this.cell.getRow());
    }
  }
}
