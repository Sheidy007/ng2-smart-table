import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataSource } from '../../../../lib/data-source/data-source';
import { Column } from '../../../../lib/data-set/column';
import { SettingsClass } from '../../../../lib/settings.class';

@Component({
  selector: 'ng2-smart-table-title',
  styleUrls: ['./title.component.scss'],
  template: `
		<a href="#" *ngIf="column.sort"
		   (click)="doSort($event)"
		   class="ng2-smart-sort-link sort"
		   [ngClass]="currentDirection">
			{{ column.title }}
		</a>
		<span class="ng2-smart-sort" *ngIf="!column.sort">{{ column.title }}</span>
  `
})
export class TitleComponent implements OnChanges {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() settings: SettingsClass;
  @Output() sort = new EventEmitter<any>();

  currentDirection: 'desc' | 'asc' | '' = '';
  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged.subscribe((dataChanges) => {
        const sortConf = this.source.getSort();

        if (sortConf.length) {
          const thisSort = sortConf.find(s => s.field === this.column.id);
          if (thisSort) {
            this.currentDirection = thisSort.direction;
          }
        } else {
          this.currentDirection = '';
        }
      });
    }
  }

  doSort(event: any) {
    event.preventDefault();
    this.changeSortDirection();
    this.source.setSort([
      {
        field: this.column.id,
        direction: this.currentDirection,
        compare: this.column.getCompareFunction()
      }
    ]);
    this.sort.emit(null);
  }

  changeSortDirection(): string {
    if (this.currentDirection) {
      this.currentDirection = this.currentDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentDirection = this.column.defaultSortDirection;
    }
    return this.currentDirection;
  }
}
