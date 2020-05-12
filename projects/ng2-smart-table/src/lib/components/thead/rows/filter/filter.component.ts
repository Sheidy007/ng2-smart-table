import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FilterDefault } from './filter-default';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ng2-smart-table-filter',
  styleUrls: ['./filter.component.scss'],
  template: `
		<div class="ng2-smart-filter" *ngIf="column.filter" [ngSwitch]="column.getFilterType()">
			<custom-table-filter (filter)="onFilter($event)"
			                     *ngSwitchCase="'custom'"
			                     [column]="column"
			                     [inputClass]="inputClass"
			                     [query]="query"
			                     [settings]="settings"
			                     [source]="source">
			</custom-table-filter>
			<default-table-filter (filter)="onFilter($event)"
			                      *ngSwitchDefault
			                      [column]="column"
			                      [inputClass]="inputClass"
			                      [query]="query"
			                      [settings]="settings"
			                      [source]="source">
			</default-table-filter>
		</div>
  `
})
export class FilterComponent extends FilterDefault implements OnChanges {
  query = '';
  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged.subscribe(() => {
        const filterConf = this.source.getFilter();
        if (!filterConf || !filterConf.filters || !filterConf.filters.length) {
          this.query = '';
        } else {
          const filter = filterConf.filters.find(f => f.field === this.column.id);
          this.query = filter ? filter.search : '';
        }
      });
    }
  }
}
