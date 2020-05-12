import { Component } from '@angular/core';

import { DefaultEditor } from './default-editor';

@Component({
  selector: 'textarea-editor',
  styleUrls: ['./editor.component.scss'],
  template: `
    <textarea (click)="onClick.emit($event)"
              [style.maxWidth]="'100%'"
              (keydown.enter)="onEdited.emit($event)"
              (keydown.esc)="onStopEditing.emit()"
              [(ngModel)]="cell.newValue"
              [disabled]="!cell.isEditable()"
              [name]="cell.getId()"
              [ngClass]="inputClass"
              [placeholder]="cell.getTitle()"
              class="form-control">
    </textarea>
    `,
})
export class TextareaEditorComponent extends DefaultEditor {

  constructor() {
    super();
  }
}
