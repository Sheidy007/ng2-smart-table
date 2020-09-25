import { Component, ElementRef, Input, OnChanges } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';

@Component({
  selector: '[ngx-rt-add-create-cancel]',
  template: `
		<a (click)="onCreate($event)"
		   [innerHTML]="createButtonContent | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-add-create"
		   href="#"></a>
		<a (click)="onCancel($event)"
		   [innerHTML]="cancelButtonContent | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-add-cancel"
		   href="#"></a>
  `
})
export class CreateCancelComponent implements OnChanges {

  @Input() grid: Grid;

  createButtonContent: string;
  cancelButtonContent: string;

  constructor(public element: ElementRef) {}

  ngOnChanges() {
    this.createButtonContent = this.grid.settings.actions.add.innerActions['create'].content;
    this.cancelButtonContent = this.grid.settings.actions.add.innerActions['cancel'].content;
  }

  onCreate(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.applyCreate(this.grid.getNewRow());
  }

  onCancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.cancelCreate();
  }
}
