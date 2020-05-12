import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Grid } from '../../../../../lib/grid';
import { Row } from '../../../../../lib/data-set/row/row';

@Component({
  selector: 'ng2-st-tbody-update-cancel',
  template: `
		<a href="#" class="ng2-smart-action ng2-smart-action-edit-save"
		   [innerHTML]="saveButtonContent | sanitizeHtml" (click)="onSave($event)"></a>
		<a href="#" class="ng2-smart-action ng2-smart-action-edit-cancel"
		   [innerHTML]="cancelButtonContent | sanitizeHtml" (click)="onCancelEdit($event)"></a>
  `
})
export class TbodyCreateCancelComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() saveUpdateConfirm: EventEmitter<any>;

  @Output() finishEditRowSelect = new EventEmitter<any>();

  cancelButtonContent: string;
  saveButtonContent: string;

  onSave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.finishEditRowSelect.emit();
    this.grid.save(this.row, this.saveUpdateConfirm);
  }

  onCancelEdit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.finishEditRowSelect.emit();
    this.row.resetNewData();
    this.row.editing = false;
  }

  ngOnChanges() {
    this.saveButtonContent = this.grid.getSetting().edit.saveButtonContent;
    this.cancelButtonContent = this.grid.getSetting().edit.cancelButtonContent;
  }
}
