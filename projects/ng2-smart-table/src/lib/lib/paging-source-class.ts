import { LocalPager } from './local.pager';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DataSourceClass, PagingClass } from './data-source/data-source.class';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { SettingsClass } from './settings.class';

export class PagingSourceClass {

  onChanged = new Subject<DataSourceClass>();
  viewport: CdkVirtualScrollViewport;
  pagingConf: PagingClass = {
    page: 0,
    perPage: 0
  };
  virtualData = [];

  constructor(public source: LocalDataSource, public settings: SettingsClass) {
    this.pagingConf.page = 1;
    this.pagingConf.perPage = (!this.settings.pager.perPage['length']
      ? this.settings.pager.perPage : this.settings.pager.perPage[0]) as number;
    this.setPage(this.pagingConf.page);
  }

  getPaging(): PagingClass {
    return this.pagingConf;
  }

  setPageByRow(row: any, doEmit: boolean = true): PagingSourceClass {
    const perPage: number = this.pagingConf.perPage as number;
    const pageForSet = Math.ceil((this.source.filteredAndSorted.indexOf(row) + 1) / perPage);
    return this.setPage(pageForSet, doEmit);
  }

  setPageByUser(page: number, doEmit: boolean = true): PagingSourceClass {
    const dataOnPage = LocalPager
      .paginate(this.source.filteredAndSorted, page, this.pagingConf.perPage as number);
    this.scrollToRow(dataOnPage[0]);
    return this.setPage(page, doEmit);
  }

  setPaging(page: number, perPage: number, doEmit: boolean = true): PagingSourceClass {
    this.pagingConf.page = page;
    this.pagingConf.perPage = perPage;
    if (doEmit) {
      this.emitOnChanged('paging');
    }
    return this;
  }

  setPage(page: number, doEmit: boolean = true): PagingSourceClass {
    this.pagingConf.page = page;
    if (doEmit) {
      this.emitOnChanged('page');
    }
    return this;
  }

  scrollToRow(row) {
    const index = this.source.filteredAndSorted.indexOf(row);
    this.viewport.scrollToIndex(index);
  }

  protected emitOnChanged(action) {
    this.onChanged.next({
      action,
      elements: this.virtualData,
      paging: this.pagingConf
    });
  }
}
