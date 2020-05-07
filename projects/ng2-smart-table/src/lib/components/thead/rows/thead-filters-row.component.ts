import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Grid } from '../../../lib/grid';
import { LocalDataSource } from '../../../lib/data-source/local.data-source';

@Component({
  selector: '[ng2-st-thead-filters-row]',
  template: `
		<tr>
			<td *ngIf="isMultiSelectVisible"
			    [ngStyle]="{width : grid.widthMultipleSelectCheckBox}"></td>
			<td ng2-st-add-button *ngIf="showActionColumnLeft"
			    [grid]="grid"
			    (create)="create.emit($event)"
			    [ngStyle]="{width : grid.widthActions}">
			</td>
			<td *ngFor="let column of noHideColumns" class="ng2-smart-th {{ column.id }}">
				<ng2-smart-table-filter [source]="source"
				                        [settings]="grid.getSetting()"
				                        [column]="column"
				                        [inputClass]="filterInputClass"
				                        (filter)="filter.emit($event)">
				</ng2-smart-table-filter>
			</td>
			<td ng2-st-add-button *ngIf="showActionColumnRight"
			    [grid]="grid"
			    [source]="source"
			    (create)="create.emit($event)"
			    [ngStyle]="{width : grid.widthActions}">
			</td>
		</tr>
  `
})
export class TheadFiltersRowComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() source: LocalDataSource;

  @Output() create = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  filterInputClass: string;

  get noHideColumns() {
    return this.grid.getNoHideColumns();
  }

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.filterInputClass = this.grid.getSetting().filter ? this.grid.getSetting().filter.inputClass : '';
  }
}
