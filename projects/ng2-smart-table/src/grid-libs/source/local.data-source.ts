import { deepExtend } from '../sys/helpers';
import { FilterSource } from './filter/filter-source';
import { SorterSource } from './sorter/sorter-source';
import { Subject } from 'rxjs';
import { DataSource, FilterClass, FilterConfClass, SortClass, SortConfClass } from './data-source';
import { Grid } from '../grid';
import { isEqual } from 'lodash';
import { IndexedDBSource } from './indexedDB-source';

export class LocalDataSource {

  data = [];
  filteredAndSorted = [];
  indexedDBSource: IndexedDBSource;
  protected filterSource: FilterSource;
  protected sorterSource: SorterSource;
  onChanged = new Subject<DataSource>();
  onAdded = new Subject<any>();
  onUpdated = new Subject<any>();
  onRemoved = new Subject<any>();

  connectedGrids: { name: string, grid: Grid }[] = [];

  constructor(data: Array<any> = []) {
    this.data = data;
    this.filteredAndSorted = this.data;
    this.filterSource = new FilterSource(this);
    this.sorterSource = new SorterSource(this);
  }

  connectGrid(name: string, grid: Grid) {
    this.indexedDBSource = new IndexedDBSource(grid.settings);
    /* this.indexedDBSource.init(1).then(async (result) => {
     if (result) {
     await this.indexedDBSource.addArray(this.data, 1000);
     }
     });*/
    const findGridIndex = this.connectedGrids.findIndex(g => g.name === name);
    if (findGridIndex !== -1) {
      this.connectedGrids.splice(findGridIndex, 1, { name, grid });
    } else {
      this.connectedGrids.push({ name, grid });
    }
  }

  getGridAfterViewInit(name: string): Grid {
    return this.connectedGrids.find(g => g.name === name)?.grid;
  }

  refresh() {
    this.emitOnChanged('refresh');
  }

  load(data: Array<any>): Promise<any> {
    this.data = data;
    this.filteredAndSorted = this.data;
    this.emitOnChanged('load');
    return Promise.resolve();
  }

  // add one or more elements to start of array
  unshift(...element: any): Promise<any> {
    this.data.unshift(...element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(...element);
    this.emitOnChanged('unshift', element);
    return Promise.resolve();
  }

  // add one or more  elements to end of array
  add(...element: any): Promise<any> {
    this.data.push(...element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(...element);
    this.emitOnChanged('add', element);
    return Promise.resolve();
  }

  prepend(...element: any): Promise<any> {
    this.reset(false);
    this.data.unshift(...element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(...element);
    this.emitOnChanged('prepend', element);
    return Promise.resolve();
  }

  append(...element: any): Promise<any> {
    this.reset(false);
    this.data.push(...element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(...element);
    this.emitOnChanged('append', element);
    return Promise.resolve();
  }

  remove(element: any): Promise<any> {
    this.data.splice(this.data.findIndex(el => el === element), 1);
    this.filteredAndSorted = this.data;
    this.emitOnRemoved(element);
    this.emitOnChanged('remove', element);
    return Promise.resolve();
  }

  update(element: any, value: any): Promise<any> {
    return this.find(element).then((found) => {
      found = deepExtend(found, value);
      this.emitOnUpdated(found);
      this.emitOnChanged('update');
    });
  }

  updateField(element: any, field: string, value: any): Promise<any> {
    return this.find(element).then((found) => {
      found[field] = value;
      this.emitOnUpdated(found);
      this.emitOnChanged('updateField');
    });
  }

  find(element: any): Promise<any> {
    const found = this.data.find(el => el === element);
    if (found) {
      return Promise.resolve(found);
    }
    return Promise.reject(new Error('Element was not found in the dataset'));
  }

  setFilteredAndSorted(): Promise<any[]> {
    const filteredSource = this.filterSource.filter(this.data.map(d => d));
    this.filteredAndSorted = this.sorterSource.sort(filteredSource);
    return Promise.resolve(this.filteredAndSorted);
  }

  getAll(): Promise<any> {
    const data = this.data.slice();
    return Promise.resolve(data);
  }

  reset(doEmit = false) {
    if (!doEmit) {
      this.filterSource.filterConf = {
        filters: [],
        andOperator: true
      };
      this.sorterSource.sortConf = {
        sorts: [],
        multiSort: false
      };
    } else {
      this.setFilter([], true, doEmit);
      this.setSort([], doEmit, false);
    }
  }

  empty(): Promise<any> {
    this.data = [];
    this.emitOnChanged('empty');
    return Promise.resolve();
  }

  getFilter(): FilterConfClass {
    return this.filterSource.getFilter();
  }

  setFilter(conf: FilterClass[], andOperator = true, doEmit = true) {
    const prevFilters = this.filterSource.getFilter().filters.map(f => f);
    const result = this.filterSource.setFilter(conf, andOperator);
    const newFilters = this.filterSource.getFilter().filters.map(f => f);
    if (doEmit && !isEqual(prevFilters, newFilters)) {
      this.emitOnChanged('filter');
    }
    return result;
  }

  addFilter(fieldConf: FilterClass, andOperator = true, doEmit: boolean = true) {
    const prevFilters = this.filterSource.getFilter().filters.map(f => f);
    const result = this.filterSource.addFilter(fieldConf, andOperator);
    const newFilters = this.filterSource.getFilter().filters.map(f => f);
    if (doEmit && !isEqual(prevFilters, newFilters)) {
      this.emitOnChanged('filter');
    }
    return result;
  }

  clearFilter(doEmit: boolean = true) {
    this.setFilter([], true, doEmit);
  }

  getSort(): SortConfClass {
    return this.sorterSource.getSort();
  }

  setSort(conf: SortClass[], doEmit = true, multiSort = false): LocalDataSource {
    const result = this.sorterSource.setSort(conf, multiSort);
    if (doEmit) {
      this.emitOnChanged('sort');
    }
    return result;
  }

  addSort(fieldConf: SortClass, doEmit = true, multiSort = false): LocalDataSource {
    const result = this.sorterSource.addSort(fieldConf, multiSort);
    if (doEmit) {
      this.emitOnChanged('sort');
    }
    return result;
  }

  clearSort(doEmit: boolean = true) {
    this.setSort([], doEmit);
  }

  count(): number {
    return this.filteredAndSorted.length;
  }

  countAll(): number {
    return this.data.length;
  }

  protected emitOnRemoved(element: any) {
    this.onRemoved.next(element);
  }

  protected emitOnUpdated(element: any) {
    this.onUpdated.next(element);
  }

  protected emitOnAdded(...element: any) {
    this.onAdded.next(...element);
  }

  protected emitOnChanged(action:
                            'refresh' | 'load' | 'prepend' | 'append' | 'add' | 'unshift' | 'remove' | 'update' | 'updateField' | 'empty' | 'sort' | 'filter' | 'page' | 'pageByUser',
                          changedElements?) {
    this.setFilteredAndSorted().then((elements) =>
      this.onChanged.next({
        action,
        elements,
        filter: this.filterSource.getFilter(),
        sort: this.sorterSource.getSort(),
        changedElements
      }));
  }
}
