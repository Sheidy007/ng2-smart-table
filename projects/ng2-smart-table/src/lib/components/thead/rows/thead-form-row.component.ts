import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Grid } from '../../../lib/grid';
import { Row } from '../../../lib/data-set/row/row';

@Component({
  selector: '[ng2-st-thead-form-row]',
  template: `
		<tr *ngIf="!grid.getSetting().createSeparate">
			<td *ngIf="isMultiSelectVisible"
			    [ngStyle]="{width : grid.widthMultipleSelectCheckBox}"></td>
			<td *ngIf="showActionColumnLeft"
			    [ngStyle]="{width : grid.widthActions}"
			    class="ng2-smart-actions">
				<ng2-st-actions (create)="onCreate($event)"
				                (finishEditRowCreating)="finishEditRowCreating.emit()"
				                [grid]="grid"></ng2-st-actions>
			</td>
			<td *ngFor="let cell of grid.getNewRow().cells">
				<ng2-smart-table-cell [cell]="cell"
				                      [grid]="grid"
				                      [isNew]="true"
				                      [createConfirm]="createConfirm"
				                      [inputClass]="addInputClass"
				                      [isInEditing]="grid.getNewRow().editing"
				                      (edited)="onCreate($event)">
				</ng2-smart-table-cell>
			</td>
			<td *ngIf="showActionColumnRight"
			    [ngStyle]="{width : grid.widthActions}"
			    class="ng2-smart-actions">
				<ng2-st-actions (create)="onCreate($event)"
				                (finishEditRowCreating)="finishEditRowCreating.emit()"
				                [grid]="grid"></ng2-st-actions>
			</td>
			<td *ngIf="showColumnForShowHiddenColumns  && grid.getHideColumns().length"
			    [ngStyle]="{width : grid.widthShowHiddenColumns}">
			</td>
		</tr>
  `
})
export class TheadFormRowComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() createConfirm: EventEmitter<any>;

  @Output() create = new EventEmitter<any>();
  @Output() finishEditRowCreating = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  showColumnForShowHiddenColumns: boolean;
  addInputClass: string;

  onCreate(event: any) {
    event.stopPropagation();
    this.grid.create(this.grid.getNewRow(), this.createConfirm);
  }

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.showColumnForShowHiddenColumns = this.grid.showColumnForShowHiddenColumn();
    this.addInputClass = this.grid.getSetting().add.inputClass;
  }
}
