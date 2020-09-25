import { LocalPager } from './local.pager';
import { DataSource, PagingClass } from '../source/data-source';
import { LocalDataSource } from '../source/local.data-source';
import { BehaviorSubject, Subject } from 'rxjs';
import { Settings } from '../settings/settings';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { VirtualScrollerComponent } from '../sys/virtual-scroller';
import { Grid } from '../grid';

export class PagerSource {

  onChanged = new Subject<DataSource>();
  viewport = new BehaviorSubject<VirtualScrollerComponent>(null);
  viewportHeight = new BehaviorSubject<number>(0);
  viewportWidth = new BehaviorSubject<number>(0);
  perfectScrollbar: PerfectScrollbarDirective;
  pagingConf = {} as PagingClass;
  virtualData = [];
  mainTableHead: HTMLElement;

  constructor(public grid: Grid) {
    this.initPager();
  }

  initPager() {
    this.pagingConf.page = 1;
    const perPage = Math.ceil(this.grid.settings.innerTableHeightPx / this.grid.settings.minRowHeightPx);
    this.grid.settings.innerTableHeightPx = perPage * this.grid.settings.minRowHeightPx;
    this.pagingConf.perPage = ( perPage % 2 ) === 0 ? perPage : perPage - 1;
    this.setPage(this.pagingConf.page);
  }

  getPaging(): PagingClass {
    return this.pagingConf;
  }

  setPageByRow(row: any, doEmit: boolean = true): PagerSource {
    const perPage: number = this.pagingConf.perPage as number;
    const pageForSet = Math.ceil(( this.grid.source.filteredAndSorted.indexOf(row) + 1 ) / perPage);
    return this.setPage(pageForSet, doEmit);
  }

  setPageByUser(page: number): void {
    if (page === 1) {
      this.scrollToRow(this.grid.source.filteredAndSorted[0]);
    } else if (page !== Math.ceil(this.grid.source.filteredAndSorted.length / ( this.pagingConf.perPage as number ))) {
      const dataOnPage = LocalPager
        .paginate(this.grid.source.filteredAndSorted, page, this.pagingConf.perPage as number);
      this.scrollToRow(dataOnPage[0]);
    } else {
      this.scrollToRow(this.grid.source.filteredAndSorted[this.grid.source.filteredAndSorted.length - 1]);
      setTimeout(() => this.scrollToRow(this.grid.source.filteredAndSorted[this.grid.source.filteredAndSorted.length - 1]), 1);
    }
  }

  scrollToRow(row) {
    const index = this.grid.source.filteredAndSorted.indexOf(row);
    this.viewport.value.scrollToIndex(index);
  }

  setPage(page: number, doEmit: boolean = true): PagerSource {
    this.pagingConf.page = page;
    if (doEmit) {
      this.emitOnChanged('page');
    }
    return this;
  }

  protected emitOnChanged(action) {
    this.onChanged.next({
      action,
      elements: this.virtualData,
      paging: this.pagingConf
    });
  }
}
