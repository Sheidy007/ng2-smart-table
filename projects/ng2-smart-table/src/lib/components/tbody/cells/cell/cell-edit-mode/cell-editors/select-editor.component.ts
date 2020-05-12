import { Component } from '@angular/core';

import { DefaultEditor } from './default-editor';

@Component({
  selector: 'select-editor',
  template: `
    <select (click)="onClick.emit($event)"
            (keydown.enter)="onEdited.emit($event)"
            (keydown.esc)="onStopEditing.emit()"
            [(ngModel)]="cell.newValue"
            [disabled]="!cell.isEditable()"
            [name]="cell.getId()"
            [ngClass]="inputClass"
            class="form-control">

        <option *ngFor="let option of cell.getColumn().getConfig()?.list" [value]="option.value"
                [selected]="option.value === cell.getValue()">{{ option.title }}
        </option>
    </select>
    `,
})
export class SelectEditorComponent extends DefaultEditor {

  constructor() {
    super();
  }
}
