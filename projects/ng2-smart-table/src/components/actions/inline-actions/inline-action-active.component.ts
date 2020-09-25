import { Component, Input, OnInit } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Row } from '../../../grid-libs/data-set/row/row';
import { BaseActionClass } from '../../../grid-libs/settings/settings';

@Component({
  selector: '[ngx-rt-inline-actions-active]',
  template: `
		<ng-container *ngFor="let action of custom">
			<ngx-rt-custom-added *ngIf="action.data!==row.getData() &&
				                          action.data === row.getData() &&
			                            action.viewType === 'inline' &&
                                  !action.dblclickOnRow && action.showActionFunction(row.getData())"
			                     [grid]="grid"
			                     [row]="row"
			                     [action]="action"
			                     class="ngx-rt-action">
			</ngx-rt-custom-added>
		</ng-container>
		<ngx-rt-update-cancel *ngIf="grid.settings.actions.edit &&
			                                   grid.settings.actions.edit.data===row.getData() &&
			                                   grid.settings.actions.edit.viewType === 'inline' &&
			                                   (grid.settings.actions.edit.position===position && !onlyOverActions ||
			                                   grid.settings.actions.edit.positionAsOverAction===position && onlyOverActions ) &&
			                                   grid.settings.actions.edit.concatWithColumnName===columnName &&
                                         !grid.settings.actions.edit.dblclickOnRow &&
                                          grid.settings.actions.edit.showActionFunction(row.getData())"
		                      [grid]="grid"
		                      [row]="row"
		                      class="ngx-rt-action">
		</ngx-rt-update-cancel>
  `
})
export class InlineActionActiveComponent implements OnInit {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() position: 'left' | 'right' | 'top' | 'bottom';
  @Input() onlyOverActions = false;
  @Input() columnName = '';

  custom?: BaseActionClass[] = [];

  ngOnInit() {
    this.custom = this.grid.settings.actions.custom.filter(action => ( action.position === this.position && !this.onlyOverActions || action.positionAsOverAction === this.position && this.onlyOverActions )
      && action.concatWithColumnName === this.columnName);
  }
}
