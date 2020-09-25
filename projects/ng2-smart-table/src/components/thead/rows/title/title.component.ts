import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Column } from '../../../../grid-libs/settings/column/column';
import { Grid } from '../../../../grid-libs/grid';

@Component({
  selector: '[ngx-rt-title]',
  styleUrls: ['./title.component.scss'],
  template: `
	  <a (click)="onSort($event)"
	     *ngIf="column.sort"
	     [ngClass]="currentDirection"
	     class="ngx-rt-sort-link"
	     href="#">
		  {{ column.title }}
	  </a>
	  <span *ngIf="length && length>1 && id">({{id}})</span>
	  <span class="ngx-rt-not-sort-link" *ngIf="!column.sort">{{ column.title }}</span>
	  <ng-content></ng-content>
  `
})
export class TitleComponent implements OnChanges, OnDestroy {

  @Input() column: Column;
  @Input() grid: Grid;

  currentDirection: 'desc' | 'asc' | '' = '';
  id: number;
  length = 0;
  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.grid) {
      if (!changes.grid.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.grid.source.onChanged.subscribe(() => {
        const sortConf = this.grid.source.getSort().sorts;
        this.length = sortConf.length;
        if (sortConf.length) {
          const thisSort = sortConf.find(s => s.field === this.column.id);
          if (thisSort) {
            this.id = sortConf.findIndex(s => s.field === this.column.id) + 1;
            this.currentDirection = thisSort.direction;
          } else {
            this.currentDirection = this.column.defaultSortDirection;
            this.id = null;
          }
        } else {
          this.currentDirection = this.column.defaultSortDirection;
          this.id = null;
        }
      });
    }
  }

  onSort(event: any) {
    event.preventDefault();
    this.changeSortDirection();
    this.grid.source.setSort([
      {
        field: this.column.id,
        direction: this.currentDirection,
        compare: this.column.columnFunctions.getCompareFunction(),
        defaultValue:  this.column.defaultValue
      }
    ], true, this.grid.settings.multiCompare);
    this.grid.gridEvents.sort.next();
  }

  changeSortDirection(): string {
    switch (this.currentDirection) {
      case '':
        this.currentDirection = 'asc';
        break;
      case 'asc':
        this.currentDirection = 'desc';
        break;
      case 'desc':
        this.currentDirection = this.column.defaultSortDirection;
        break;
    }
    return this.currentDirection;
  }

  ngOnDestroy(): void {
    if (this.dataChangedSub) {
      this.dataChangedSub.unsubscribe();
    }
  }
}
