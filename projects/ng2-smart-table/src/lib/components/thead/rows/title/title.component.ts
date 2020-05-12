import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Column } from '../../../../lib/data-set/column/column';
import { SettingsClass } from '../../../../lib/settings.class';
import { LocalDataSource } from '../../../../lib/data-source/local.data-source';

@Component({
  selector: 'ng2-smart-table-title',
  styleUrls: ['./title.component.scss'],
  template: `
		<div class="ng2-smart-sort-div"
		     [ngStyle]="{
			     whiteSpace:'nowrap'
			     , overflow:'hidden'
			     , textOverflow:'ellipsis'}">
			<span *ngIf="length && length>1 && id">({{id}})</span>
			<a href="#" *ngIf="column.sort"
			   (click)="doSort($event)"
			   class="ng2-smart-sort-link sort"
			   [ngClass]="currentDirection">
				{{ column.title }}
			</a>
			<span class="ng2-smart-sort" *ngIf="!column.sort">{{ column.title }}</span>
		</div>
  `
})
export class TitleComponent implements OnChanges, OnDestroy {

  @Input() column: Column;
  @Input() source: LocalDataSource;
  @Input() settings: SettingsClass;
  @Output() sort = new EventEmitter<any>();

  currentDirection: 'desc' | 'asc' | '' = '';
  id: number;
  length = 0;
  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged.subscribe(() => {
        const sortConf = this.source.getSort().sorts;
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

  doSort(event: any) {
    event.preventDefault();
    this.changeSortDirection();
    this.source.setSort([
      {
        field: this.column.id,
        direction: this.currentDirection,
        compare: this.column.getCompareFunction()
      }
    ], true, this.settings.multiCompare);
    this.sort.emit();
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
