import { Component } from '@angular/core';

import { DefaultEditorComponent } from '../editor-base/default-editor.component';

@Component({
  selector: 'checkbox-editor',
  template: `
		<input (change)="onChange($event)"
		       (click)="editClick.emit($event)"
		       (keydown.enter)="edited.emit($event)"
		       (keydown.esc)="stopEditing.emit()"
		       [checked]="(cell.cellValue.computedValue | async) === (cell.getColumn().columnFunctions.getEditorConfig()?.checkboxSettings?.true || true)"
		       [disabled]="!cell.isEditable()"
		       [name]="cell.getId()"
		       type="checkbox">
  `
})
export class CheckboxEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }

  onChange(event: any) {
    const trueVal = ( this.cell.getColumn().columnFunctions.getEditorConfig() && this.cell.getColumn().columnFunctions.getEditorConfig().checkboxSettings.true ) || true;
    const falseVal = ( this.cell.getColumn().columnFunctions.getEditorConfig() && this.cell.getColumn().columnFunctions.getEditorConfig().checkboxSettings.false ) || false;
    this.cell.cellValue.editedValue = event.target.checked ? trueVal : falseVal;
  }
}
