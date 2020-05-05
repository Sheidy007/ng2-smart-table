import { Component } from '@angular/core';

import { DefaultEditor } from './default-editor';

@Component({
  selector: 'input-editor',
  styleUrls: ['./editor.component.scss'],
  template: `
    <input (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()"
           [(ngModel)]="cell.newValue"
           [disabled]="!cell.isEditable()"
           [name]="cell.getId()"
           [ngClass]="inputClass"
           [placeholder]="cell.getTitle()"
           class="form-control">
    `,
})
export class InputEditorComponent extends DefaultEditor {

  constructor() {
    super();
  }
}
