import { Subject } from 'rxjs';
import { DataSourceClass, FilterClass, FilterConfClass, PagingClass, SortClass } from './data-source.class';

export abstract class DataSource {

  onChanged = new Subject<DataSourceClass>();
  onAdded = new Subject<DataSourceClass>();
  onUpdated = new Subject<DataSourceClass>();
  onRemoved = new Subject<DataSourceClass>();

  abstract getAll(): Promise<any[]>;
  abstract getElementsPerPage(): Promise<any[]>;
  abstract getSort(): SortClass[];
  abstract getFilter(): FilterConfClass;
  abstract getPaging(): PagingClass;
  abstract count(): number;
  abstract countAll(): number;

  refresh() {
    this.emitOnChanged('refresh');
  }

  load(data: Array<any>): Promise<any> {
    this.emitOnChanged('load');
    return Promise.resolve();
  }

  prepend(element: any): Promise<any> {
    this.emitOnAdded(element);
    this.emitOnChanged('prepend');
    return Promise.resolve();
  }

  append(element: any): Promise<any> {
    this.emitOnAdded(element);
    this.emitOnChanged('append');
    return Promise.resolve();
  }

  add(element: any): Promise<any> {
    this.emitOnAdded(element);
    this.emitOnChanged('add');
    return Promise.resolve();
  }

  remove(element: any): Promise<any> {
    this.emitOnRemoved(element);
    this.emitOnChanged('remove');
    return Promise.resolve();
  }

  update(element: any, values: any): Promise<any> {
    this.emitOnUpdated(element);
    this.emitOnChanged('update');
    return Promise.resolve();
  }

  empty(): Promise<any> {
    this.emitOnChanged('empty');
    return Promise.resolve();
  }

  setSort(conf: SortClass[], doEmit?: boolean , multiSort?: boolean) {
    if (doEmit) {
      this.emitOnChanged('sort');
    }
  }

  addSort(conf: SortClass, doEmit?: boolean , multiSort?: boolean) {
    if (doEmit) {
      this.emitOnChanged('sort');
    }
  }

  setFilter(conf: FilterClass[], andOperator?: boolean, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('filter');
    }
  }

  addFilter(fieldConf: FilterClass, andOperator?: boolean, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('filter');
    }
  }

  setPaging(page: number, perPage: number, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('paging');
    }
  }

  setPage(page: number, doEmit?: boolean) {
    if (doEmit) {
      this.emitOnChanged('page');
    }
  }

  protected emitOnRemoved(element: any) {
    this.onRemoved.next(element);
  }

  protected emitOnUpdated(element: any) {
    this.onUpdated.next(element);
  }

  protected emitOnAdded(element: any) {
    this.onAdded.next(element);
  }

  protected emitOnChanged(action) {
    this.getElementsPerPage().then((elements) => this.onChanged.next({
      action,
      elements,
      paging: this.getPaging(),
      filter: this.getFilter(),
      sort: this.getSort()
    } as DataSourceClass));
  }
}
