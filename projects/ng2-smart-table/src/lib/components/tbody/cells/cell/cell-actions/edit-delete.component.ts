import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Grid } from '../../../../../lib/grid';
import { Row } from '../../../../../lib/data-set/row/row';
import { LocalDataSource } from '../../../../../lib/data-source/local.data-source';

@Component({
  selector: 'ng2-st-tbody-edit-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a href="#" *ngIf="isActionEdit" class="ng2-smart-action ng2-smart-action-edit-edit"
		   [innerHTML]="editRowButtonContent | sanitizeHtml" (click)="onEdit($event)"></a>
		<a href="#" *ngIf="isActionDelete" class="ng2-smart-action ng2-smart-action-delete-delete"
		   [innerHTML]="deleteRowButtonContent | sanitizeHtml" (click)="onDelete($event)"></a>
  `
})
export class TbodyEditDeleteComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() source: LocalDataSource;
  @Input() deleteConfirm: EventEmitter<any>;
  @Input() saveUpdateConfirm: EventEmitter<any>;

  @Output() editRowSelect = new EventEmitter<any>();

  isActionEdit: boolean;
  isActionDelete: boolean;
  editRowButtonContent: string;
  deleteRowButtonContent: string;

  onEdit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.editRowSelect.emit(this.row);
    this.grid.edit(this.row);
  }

  onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.delete(this.row, this.deleteConfirm);
  }

  ngOnChanges() {
    this.isActionEdit = this.grid.getSetting().actions.edit;
    this.isActionDelete = this.grid.getSetting().actions.delete;
    if (this.isActionEdit) {
      this.editRowButtonContent = this.grid.getSetting().edit.editButtonContent;
    }
    if (this.isActionDelete) {
      this.deleteRowButtonContent = this.grid.getSetting().delete.deleteButtonContent;
    }
  }
}
