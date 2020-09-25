import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Cell } from '../../../../../grid-libs/data-set/row/cell/cell';
import { Grid } from 'projects/ng2-smart-table/src/grid-libs/grid';

@Component({
  selector: '[ngx-rt-cell-edit-mode]',
  template: `
		<ng-container [ngSwitch]="true">
			<input-editor (editClick)="onClick($event)"
			              (edited)="onEdited($event)"
			              (stopEditing)="onStopEditing()"
			              *ngSwitchDefault
			              [cell]="cell"
			              class="ngx-rt-input-editor">
			</input-editor>
			<cell-custom-editor (editClick)="onClick($event)"
			                    (edited)="onEdited($event)"
			                    (stopEditing)="onStopEditing()"
			                    *ngSwitchCase="['custom','table'].includes(getEditorType())"
			                    [cell]="cell"
			                    [rowData]="cell.getRow().getData()">
			</cell-custom-editor>
			<select-editor *ngSwitchCase="getEditorType() === 'list'"
			               [cell]="cell"
			               (editClick)="onClick($event)"
			               (edited)="onEdited($event)"
			               (stopEditing)="onStopEditing()">
			</select-editor>
			<textarea-editor (editClick)="onClick($event)"
			                 (edited)="onEdited($event)"
			                 (stopEditing)="onStopEditing()"
			                 *ngSwitchCase="getEditorType() === 'textarea'"
			                 [cell]="cell"
			                 [style.maxWidth]="'100%'">
			</textarea-editor>
			<checkbox-editor (editClick)="onClick($event)"
			                 (edited)="onEdited($event)"
			                 (stopEditing)="onStopEditing()"
			                 *ngSwitchCase="getEditorType() === 'checkbox'"
			                 [cell]="cell">
			</checkbox-editor>
			<completer-editor (editClick)="onClick($event)"
			                  (edited)="onEdited($event)"
			                  (stopEditing)="onStopEditing()"
			                  *ngSwitchCase="getEditorType() === 'completer'"
			                  [cell]="cell">
			</completer-editor>
		</ng-container>
  `
})
export class EditCellComponent implements OnInit {

  @Input() cell: Cell;
  @Input() grid: Grid;
  @Input() inputClass = '';

  @Output() edited = new EventEmitter<any>();

  ngOnInit() {
    if (this.cell.getColumn().type === 'table') {
      this.cell.getColumn().editor = {
        type: 'table',
        component: this.grid.gridActionsFunctions.tableEditComponent
      };
    }
  }

  onClick(event: Event) {
    event.stopPropagation();
  }

  onEdited(event: Event): boolean {
    this.edited.emit(event);
    return false;
  }

  onStopEditing(): boolean {
    this.grid.gridActionsFunctions.cancelEdit(this.cell.getRow());
    return false;
  }

  getEditorType(): string {
    return this.cell.getColumn().editor && this.cell.getColumn().editor.type;
  }
}
