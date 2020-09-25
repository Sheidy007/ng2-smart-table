import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Column } from '../../../../../grid-libs/settings/column/column';
import { Grid } from '../../../../../grid-libs/grid';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultFilterComponent implements OnDestroy, OnInit {

  protected destroy = new Subject<void>();
  @Input() delay = 300;
  @Input() query: string | boolean | number;
  @Input() column: Column;
  @Input() grid: Grid;
  @Output() filter = new EventEmitter<string | boolean | number>();

  ngOnInit() {
    this.grid.gridResizeColumnsFunctions.resetHeaderFilters.pipe(takeUntil(this.destroy))
      .subscribe(() => this.reInitFilter(true));
    this.grid.gridResizeColumnsFunctions.refreshHeaderFilters.pipe(takeUntil(this.destroy))
      .subscribe(() => this.refreshFilter());
  }

  reInitFilter(propagate: boolean) {
    if (propagate) {
      this.query = '';
      this.setFilter('');
    }
  }

  refreshFilter() {
  }

  setFilter(value) {
    this.filter.emit(value);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
