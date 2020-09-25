import { Component } from '@angular/core';

import { DefaultEditorComponent } from '../editor-base/default-editor.component';

@Component({
  selector: 'input-editor',
  template: `
	  <input (click)="editClick.emit($event)"
	         (keydown.enter)="edited.emit($event)"
	         (keydown.esc)="stopEditing.emit()"
	         [(ngModel)]="cell.cellValue.editedValue"
	         [disabled]="!cell.isEditable()"
	         [name]="cell.getId()"
	         required
	         class="ngx-rt-input">
	  <div class="ngx-rt-input-label">{{cell.getTitle()}}</div>
  `,
})
export class InputEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }
}
