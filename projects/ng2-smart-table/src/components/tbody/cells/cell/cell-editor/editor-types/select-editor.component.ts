import { Component } from '@angular/core';

import { DefaultEditorComponent } from '../editor-base/default-editor.component';

@Component({
  selector: 'select-editor',
  template: `
		<select (click)="editClick.emit($event)"
		        (keydown.enter)="edited.emit($event)"
		        (keydown.esc)="stopEditing.emit()"
		        [(ngModel)]="cell.cellValue.editedValue"
		        [disabled]="!cell.isEditable()"
		        [name]="cell.getId()">
			<option *ngFor="let option of cell.getColumn().columnFunctions.getEditorConfig()?.listSettings.listMembers" [value]="option.value"
			        [selected]="option.value === (cell.cellValue.computedValue | async)">{{ option.title }}
			</option>
		</select>
  `
})
export class SelectEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }
}
