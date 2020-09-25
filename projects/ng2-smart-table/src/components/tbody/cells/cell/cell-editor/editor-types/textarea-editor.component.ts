import { Component } from '@angular/core';

import { DefaultEditorComponent } from '../editor-base/default-editor.component';

@Component({
  selector: 'textarea-editor',
  template: `
	  <textarea (click)="editClick.emit($event)"
	            [style.maxWidth]="'100%'"
	            (keydown.enter)="edited.emit($event)"
	            (keydown.esc)="stopEditing.emit()"
	            [(ngModel)]="cell.cellValue.editedValue"
	            [disabled]="!cell.isEditable()"
	            [name]="cell.getId()"
	            [placeholder]="cell.getTitle()"
              style="resize: vertical"
	            >
    </textarea>
  `,
})
export class TextareaEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }
}
