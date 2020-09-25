import { Component, ElementRef, Input } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Row } from '../../../grid-libs/data-set/row/row';

@Component({
  selector: '[ngx-rt-inline-action]',
  template: `
		<div *ngIf="grid &&
			          (!grid.settings.actions.edit ||
			            grid.settings.actions.edit && (
			            grid.settings.actions.edit.data!==row.getData() ||
			            grid.settings.actions.edit.viewType !== 'inline'
			          )) &&
			          !grid.isCustom(['inline'],row.getData())"
		     [columnName]="columnName"
		     [grid]="grid"
		     [position]="position"
         [onlyOverActions]="onlyOverActions"
		     [row]="row"
		     class="ngx-rt-inline-actions-idle"
		     ngx-rt-inline-actions-idle>
		</div>
		<div *ngIf="grid"
		     [grid]="grid"
		     [position]="position"
		     [onlyOverActions]="onlyOverActions"
		     [row]="row"
		     [columnName]="columnName"
		     class="ngx-rt-inline-actions-active"
		     ngx-rt-inline-actions-active>
		</div>
  `
})
export class InlineActionComponent {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() position: 'left' | 'right' | 'top' | 'bottom';
  @Input() onlyOverActions = false;
  @Input() columnName = '';

  constructor(public element: ElementRef) {}
}
