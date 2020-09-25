import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Cell } from '../../../../../grid-libs/data-set/row/cell/cell';
import { Grid } from 'projects/ng2-smart-table/src/grid-libs/grid';
import { BaseActionClass } from '../../../../../grid-libs/settings/settings';

@Component({
  selector: '[ngx-rt-cell-view-mode]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<ng-container *ngFor="let action of customLeft">
			<ngx-rt-custom-action *ngIf="grid &&
                                        (!grid.settings.actions.edit ||
                                          grid.settings.actions.edit && (
                                          grid.settings.actions.edit.data!==cell.getRow().getData() ||
                                          grid.settings.actions.edit.viewType !== 'inline'
                                        )) &&
                                        !grid.isCustom(['inline'],cell.getRow().getData())"
			                      [action]="action"
			                      [grid]="grid"
			                      [row]="cell.getRow()"
			                      class="ngx-rt-action">
			</ngx-rt-custom-action>
			<ngx-rt-custom-added *ngIf="grid.settings.actions.edit.data!==cell.getRow().getData() &&
				                                  action.data === cell.getRow().getData() &&
			                                    action.viewType === 'inline'"
			                     [grid]="grid"
			                     [row]="cell.getRow()"
			                     [action]="action"
			                     class="ngx-rt-action">
			</ngx-rt-custom-added>
		</ng-container>
		<ng-container [ngSwitch]="true">
			<div (click)="cell.cellValue.showMinimize && this.showFullText($event)"
			     (showHref)="cell.cellValue.showMinimize = $event"
			     *ngSwitchDefault
			     [ngClass]="!cell.cellValue.showMinimize?'ngx-tr-cell-view-default':'ngx-tr-cell-view-min-default'"
			     resizeShowMinimizeCellObserver>
				{{ cell.cellValue.computedValue | async }}
			</div>
			<div (click)="cell.cellValue.showMinimize && this.showFullText($event)"
			     (showHref)="cell.cellValue.showMinimize = $event"
			     *ngSwitchCase="cell.getColumn().type === 'html'"
			     [innerHTML]="cell.cellValue.computedValue | async | sanitizeHtml"
			     [ngClass]="!cell.cellValue.showMinimize?'ngx-tr-cell-view-html':'ngx-tr-cell-view-min-html'"
			     resizeShowMinimizeCellObserver>
			</div>
			<custom-view-component (click)="cell.cellValue.showMinimize && this.showFullText($event)"
			                       (showHref)="cell.cellValue.showMinimize = $event"
			                       *ngSwitchCase="['custom','table'].includes(cell.getColumn().type)"
			                       [cell]="cell"
			                       [ngClass]="!cell.cellValue.showMinimize?'ngx-tr-cell-view-custom-component':'ngx-tr-cell-view-min-custom-component'"
			                       [rowData]="cell.getRow().getData()"
			                       [value]="cell.cellValue.computedValue | async"
			                       resizeShowMinimizeCellObserver>
			</custom-view-component>
		</ng-container>
		<ng-container *ngFor="let action of customRight">
			<ngx-rt-custom-action *ngIf="grid &&
                                        (!grid.settings.actions.edit ||
                                          grid.settings.actions.edit && (
                                          grid.settings.actions.edit.data!==cell.getRow().getData() ||
                                          grid.settings.actions.edit.viewType !== 'inline'
                                        )) &&
                                        !grid.isCustom(['inline'],cell.getRow().getData())"
			                      [action]="action"
			                      [grid]="grid"
			                      [row]="cell.getRow()"
			                      class="ngx-rt-action">
			</ngx-rt-custom-action>
			<ngx-rt-custom-added *ngIf="grid.settings.actions.edit.data!==cell.getRow().getData() &&
				                                  action.data === cell.getRow().getData() &&
			                                    action.viewType === 'inline'"
			                     [grid]="grid"
			                     [row]="cell.getRow()"
			                     [action]="action"
			                     class="ngx-rt-action">
			</ngx-rt-custom-added>
		</ng-container>
  `
})
export class ViewCellComponent implements OnInit {
  @Input() cell: Cell;
  @Input() grid: Grid;

  customLeft: BaseActionClass[] = [];
  customRight: BaseActionClass[] = [];

  ngOnInit() {
    if (this.cell.getColumn().type === 'table') {
      this.cell.getColumn().renderComponent = this.grid.gridActionsFunctions.tableComponent;
    }

    this.customLeft = this.grid.settings.actions.custom
      .filter(action => action.concatWithColumnName === this.cell.getId() && action.position === 'left');
    this.customRight = this.grid.settings.actions.custom
      .filter(action => action.concatWithColumnName === this.cell.getId() && action.position === 'right');
  }

  showFullText(event: MouseEvent) {
    let element = ( event.target as HTMLElement );
    if (( event.target as HTMLElement ).outerHTML.includes('ngx-tr-cell-view')) {
      this.grid.cellMinHtml = element.outerHTML;
    } else {
      while (element.parentElement) {
        if (element.parentElement.outerHTML.includes('ngx-tr-cell-view')) {
          this.grid.cellMinHtml = element.parentElement.outerHTML;
          break;
        } else {
          element = element.parentElement;
        }
      }
    }
    setTimeout(() => this.grid.cellMinHtml$.next(this.grid.cellMinHtml), 500);
  }
}
