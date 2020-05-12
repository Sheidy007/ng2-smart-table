import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Grid } from '../../../../lib/grid';

@Component({
  selector: 'ng2-st-actions',
  template: `
		<a href="#" class="ng2-smart-action ng2-smart-action-add-create"
		   [innerHTML]="createButtonContent | sanitizeHtml"
		   (click)="$event.preventDefault();create.emit($event);finishEditRowCreating.emit();"></a>
		<a href="#" class="ng2-smart-action ng2-smart-action-add-cancel"
		   [innerHTML]="cancelButtonContent | sanitizeHtml"
		   (click)="$event.preventDefault();grid.createFormShown = false;finishEditRowCreating.emit();"></a>
  `
})
export class ActionsComponent implements OnChanges {

  @Input() grid: Grid;
  @Output() create = new EventEmitter<any>();
  @Output() finishEditRowCreating = new EventEmitter<any>();

  createButtonContent: string;
  cancelButtonContent: string;

  ngOnChanges() {
    this.createButtonContent = this.grid.getSetting().add.createButtonContent;
    this.cancelButtonContent = this.grid.getSetting().add.cancelButtonContent;
  }
}
