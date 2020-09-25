import { Component, Input, OnInit } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Row } from '../../../grid-libs/data-set/row/row';
import { BaseActionClass } from '../../../grid-libs/settings/settings';

@Component({
  selector: '[ngx-rt-inline-actions-idle]',
  template: `
		<ng-container *ngFor="let action of custom">
			<ngx-rt-custom-action *ngIf="!action.dblclickOnRow
			                              && action.showActionFunction(row.getData())"
			                      [grid]="grid"
			                      [action]="action"
			                      [row]="row"
			                      class="ngx-rt-action">
			</ngx-rt-custom-action>
		</ng-container>
		<ngx-rt-show *ngIf="grid.settings.actions.show
                                && (grid.settings.actions.show.position===position && !this.onlyOverActions ||
                                grid.settings.actions.show.positionAsOverAction===position &&!this.onlyOverActions)
                                && grid.settings.actions.show.concatWithColumnName===columnName
                                && !grid.settings.actions.show.dblclickOnRow
                                && grid.settings.actions.show.showActionFunction(row.getData())"
		             [grid]="grid"
		             [row]="row"
		             class="ngx-rt-action">
		</ngx-rt-show>
		<ngx-rt-edit *ngIf="grid.settings.actions.edit
			                          && (grid.settings.actions.edit.position===position && !this.onlyOverActions ||
			                          grid.settings.actions.edit.positionAsOverAction===position && this.onlyOverActions)
                                && grid.settings.actions.edit.concatWithColumnName===columnName
                                && !grid.settings.actions.edit.dblclickOnRow
                                && grid.settings.actions.edit.showActionFunction(row.getData())"
		             [grid]="grid"
		             [row]="row"
		             class="ngx-rt-action">
		</ngx-rt-edit>
		<ngx-rt-delete *ngIf="grid.settings.actions.delete
			                            && (grid.settings.actions.delete.position===position && !this.onlyOverActions ||
			                            grid.settings.actions.delete.positionAsOverAction===position && this.onlyOverActions )
                                  && grid.settings.actions.delete.concatWithColumnName===columnName
                                  && !grid.settings.actions.delete.dblclickOnRow
                                  && grid.settings.actions.delete.showActionFunction(row.getData())"
		               [grid]="grid"
		               [row]="row"
		               class="ngx-rt-action">
		</ngx-rt-delete>
  `
})
export class InlineActionIdleComponent implements OnInit {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() position: 'left' | 'right' | 'top' | 'bottom';
  @Input() onlyOverActions = false;
  @Input() columnName = '';

  custom?: BaseActionClass[] = [];

  ngOnInit() {
    this.custom = this.grid.settings.actions.custom
      .filter(action => ( action.position === this.position && !this.onlyOverActions || action.positionAsOverAction === this.position && this.onlyOverActions )
        && action.concatWithColumnName === this.columnName);
  }

}
