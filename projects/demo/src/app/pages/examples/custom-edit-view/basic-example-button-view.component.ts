import { Component, EventEmitter, OnChanges, Output } from '@angular/core';
import { DefaultViewCellComponent } from 'ng2-smart-table';

@Component({
  selector: 'button-view',
  template: `
		<button (click)="onClick()" style="white-space: nowrap">{{ renderValue }}</button>
  `
})
export class ButtonViewComponent extends DefaultViewCellComponent implements OnChanges {
  renderValue: string;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnChanges() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.save.emit(this.rowData);
  }
}
