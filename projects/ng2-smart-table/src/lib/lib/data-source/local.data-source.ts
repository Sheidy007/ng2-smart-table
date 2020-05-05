import { deepExtend } from '../helpers';
import { FilterSourceClass } from './filter-source.class';
import { SorterSourceClass } from './sorter-source.class';
import { Subject } from 'rxjs';
import { DataSourceClass } from './data-source.class';

export class LocalDataSource {

  data = [];
  filteredAndSorted = [];
  filterSource: FilterSourceClass;
  sorterSource: SorterSourceClass;
  onChanged = new Subject<DataSourceClass>();
  onAdded = new Subject<DataSourceClass>();
  onUpdated = new Subject<DataSourceClass>();
  onRemoved = new Subject<DataSourceClass>();

  constructor(data: Array<any> = []) {
    this.data = data;
    this.filteredAndSorted = this.data;
    this.filterSource = new FilterSourceClass(this);
    this.sorterSource = new SorterSourceClass(this);
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

  prepend(element: any): Promise<any> {
    this.reset(true);

    this.data.unshift(element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(element);
    this.emitOnChanged('prepend');
    return Promise.resolve();
  }

  append(element: any): Promise<any> {
    this.reset(true);

    this.data.push(element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(element);
    this.emitOnChanged('append');
    return Promise.resolve();
  }

  add(element: any): Promise<any> {
    this.data.push(element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(element);
    this.emitOnChanged('add');
    return Promise.resolve();
  }

  unshift(element: any): Promise<any> {
    this.data.unshift(element);
    this.filteredAndSorted = this.data;
    this.emitOnAdded(element);
    this.emitOnChanged('unshift');
    return Promise.resolve();
  }

  remove(element: any): Promise<any> {
    this.data = this.data.filter(el => el !== element);
    this.filteredAndSorted = this.data;
    this.emitOnRemoved(element);
    this.emitOnChanged('remove');
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
      found = deepExtend(found, found);
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

  getFilteredAndSorted(): Promise<any[]> {
    const filteredSource = this.filterSource.filter(this.data.map(d => d));
    this.filteredAndSorted = this.sorterSource.sort(filteredSource);
    return Promise.resolve(this.filteredAndSorted);
  }

  getAll(): Promise<any> {
    const data = this.data.slice();
    return Promise.resolve(data);
  }

  reset(doEmit = false) {
    if (doEmit) {
      this.filterSource.filterConf = {
        filters: [],
        andOperator: true
      };
      this.sorterSource.sortConf = {
        sorts: [],
        multiSort: false
      };
    } else {
      this.filterSource.setFilter([], true, false);
      this.sorterSource.setSort([], false, false);
    }
  }

  empty(): Promise<any> {
    this.data = [];
    this.emitOnChanged('empty');
    return Promise.resolve();
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

  protected emitOnAdded(element: any) {
    this.onAdded.next(element);
  }

  emitOnChanged(action) {
    this.getFilteredAndSorted().then((elements) =>
      this.onChanged.next({
        action,
        elements,
        filter: this.filterSource.getFilter(),
        sort: this.sorterSource.getSort()
      }));
  }

}
