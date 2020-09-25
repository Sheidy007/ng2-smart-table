import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FilterClass } from '../../../../grid-libs/source/data-source';
import { Column } from '../../../../grid-libs/settings/column/column';
import { Grid } from '../../../../grid-libs/grid';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ngx-rt-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<ng-container *ngIf="column.filter"
		              [ngSwitch]="column.columnFunctions.getFilterType()">
			<custom-table-filter (filter)="onFilter($event)"
			                     *ngSwitchCase="'custom'"
			                     [column]="column"
			                     [grid]="grid"
			                     [query]="query | async">
			</custom-table-filter>
			<ng-container *ngSwitchDefault
			              [ngSwitch]="column.columnFunctions.getFilterType()">
				<select-filter (filter)="onFilter($event)"
				               *ngSwitchCase="'list'"
				               [column]="column"
				               [grid]="grid"
				               [query]="query | async">
				</select-filter>
				<multi-select-filter (filter)="onFilter($event)"
				                     *ngSwitchCase="'multiList'"
				                     [column]="column"
				                     [grid]="grid"
				                     [query]="query | async">
				</multi-select-filter>
				<multi-select-filter (filter)="onFilter($event)"
				                     *ngSwitchCase="'completer'"
				                     [column]="column"
				                     [grid]="grid"
				                     [query]="query | async">
				</multi-select-filter>
				<checkbox-filter (filter)="onFilter($event)"
				                 *ngSwitchCase="'checkbox'"
				                 [column]="column"
				                 [grid]="grid"
				                 [query]="query | async">
				</checkbox-filter>
				<input-filter (filter)="onFilter($event)"
				              *ngSwitchDefault
				              [column]="column"
				              [grid]="grid"
				              [query]="query | async">
				</input-filter>
			</ng-container>
		</ng-container>
  `
})
export class FilterComponent implements OnInit {
  @Input() column: Column;
  @Input() grid: Grid;
  query = new BehaviorSubject<string | boolean | number>('');

  constructor() {}

  ngOnInit() {
    const filterConf = this.grid.source.getFilter();
    if (!filterConf || !filterConf.filters || !filterConf.filters.length) {
      this.query.next('');
    } else {
      const filter = filterConf.filters.find(f => f.field === this.column.id);
      this.query.next(filter ? filter.search : '');
    }
    this.grid.source.onChanged
      .subscribe((data) => {
        if (data.action === 'filter') {
          const dataFilterConf = data.filter;
          if (( !dataFilterConf || !dataFilterConf.filters || !dataFilterConf.filters.length ) && !!this.query) {
            this.query.next('');
          } else {
            const filter = dataFilterConf.filters.find(f => f.field === this.column.id);
            if (filter && this.query.value !== filter.search) {
              this.query.next(filter.search);
            }
          }
        }
      });
  }

  onFilter(query: string) {
    this.query.next(query);
    this.grid.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.columnFunctions.getFilterFunction(),
      defaultValue: this.column.defaultValue
    } as FilterClass, this.grid.settings.andOperator, true);
    this.grid.gridEvents.filter.next();
  }
}
