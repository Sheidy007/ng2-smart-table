import { LocalMultiSorter, LocalSorter } from './local.sorter';
import { LocalFilter } from './local.filter';
import { LocalPager } from './local.pager';
import { DataSource } from '../data-source';
import { deepExtend } from '../../helpers';
import { FilterClass, FilterConfClass, PagingClass, SortClass, SortConfClass } from '../data-source.class';

export class LocalDataSource extends DataSource {

  protected data = [];
  protected filteredAndSorted = [];
  protected sortConf: SortConfClass = {
    sorts: [],
    multiSort: false
  };
  protected filterConf: FilterConfClass = {
    filters: [],
    andOperator: true
  };
  protected pagingConf: PagingClass = {
    page: 1,
    perPage: 10
  };

  constructor(data: Array<any> = []) {
    super();
    this.data = data;
  }

  load(data: Array<any>): Promise<any> {
    this.data = data;
    return super.load(data);
  }

  prepend(element: any): Promise<any> {
    this.reset(true);

    this.data.unshift(element);
    return super.prepend(element);
  }

  append(element: any): Promise<any> {
    this.reset(true);

    this.data.push(element);
    return super.append(element);
  }

  add(element: any): Promise<any> {
    this.data.push(element);

    return super.add(element);
  }

  remove(element: any): Promise<any> {
    this.data = this.data.filter(el => el !== element);

    return super.remove(element);
  }

  update(element: any, values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.find(element).then((found) => {
        found = deepExtend(found, values);
        super.update(found, values).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  find(element: any): Promise<any> {
    const found = this.data.find(el => el === element);
    if (found) {
      return Promise.resolve(found);
    }

    return Promise.reject(new Error('Element was not found in the dataset'));
  }

  getElementsPerPage(): Promise<any> {
    return Promise.resolve(this.prepareData(this.data));
  }

  getFilteredAndSorted(): Promise<any> {
    this.prepareData(this.data);
    return Promise.resolve(this.filteredAndSorted);
  }

  getAll(): Promise<any> {
    const data = this.data.slice();
    return Promise.resolve(data);
  }

  reset(doEmit = false) {
    if (doEmit) {
      this.filterConf = {
        filters: [],
        andOperator: true
      };
      this.sortConf = {
        sorts: [],
        multiSort: false
      };
      this.pagingConf.page = 1;
    } else {
      this.setFilter([], true, false);
      this.setSort([], false);
      this.setPage(1);
    }
  }

  empty(): Promise<any> {
    this.data = [];
    return super.empty();
  }

  count(): number {
    return this.filteredAndSorted.length;
  }

  countAll(): number {
    return this.data.length;
  }

  /**
   *
   * Array of conf objects
   * [
   *  {field: string, direction: asc|desc|null, compare: Function|null},
   * ]
   * @param conf contain conf
   * @param doEmit contain doEmit
   * @param multiSort contain multiSort
   * @returns LocalDataSource1 contain LocalDataSource
   */
  setSort(conf: SortClass[], doEmit = true, multiSort = false): LocalDataSource {
    if (conf && conf.length) {
      conf.forEach((fieldConf) => {
        this.addSort(fieldConf, false, multiSort);
      });
    } else {
      this.sortConf = {
        sorts: [],
        multiSort: true
      };
    }
    this.sortConf.multiSort = multiSort;
    super.setSort(conf, doEmit, multiSort);
    return this;
  }

  addSort(fieldConf: SortClass, doEmit = true, multiSort = false): LocalDataSource {
    if (!fieldConf.field || !fieldConf.direction) {
      throw new Error('Sort configuration object is not valid');
    }

    let found = false;
    this.sortConf.sorts.forEach((currentFieldConf: SortClass, index: any) => {
      if (currentFieldConf.field === fieldConf.field) {
        this.sortConf.sorts[index] = fieldConf;
        found = true;
      }
    });
    if (!found) {
      this.sortConf.sorts.push(fieldConf);
    }
    this.sortConf.multiSort = multiSort;
    super.addSort(fieldConf, doEmit, multiSort);
    return this;
  }

  /**
   *
   * Array of conf objects
   * [
   *  {field: string, search: string, filter: Function|null},
   * ]
   * @param conf contain conf
   * @param andOperator contain andOperator
   * @param doEmit contain doEmit
   * @returns LocalDataSource contain LocalDataSource
   */
  setFilter(conf: FilterClass[], andOperator = true, doEmit = true): LocalDataSource {
    if (conf && conf.length) {
      conf.forEach((fieldConf) => {
        this.addFilter(fieldConf, andOperator, false);
      });
    } else {
      this.filterConf = {
        filters: [],
        andOperator: true
      };
    }
    this.filterConf.andOperator = andOperator;
    this.pagingConf.page = 1;

    super.setFilter(conf, andOperator, doEmit);
    return this;
  }

  addFilter(fieldConf: FilterClass, andOperator = true, doEmit: boolean = true): LocalDataSource {
    if (!fieldConf.field || !fieldConf.search) {
      throw new Error('Filter configuration object is not valid');
    }

    let found = false;
    this.filterConf.filters.forEach((currentFieldConf: FilterClass, index: any) => {
      if (currentFieldConf.field === fieldConf.field) {
        this.filterConf.filters[index] = fieldConf;
        found = true;
      }
    });
    if (!found) {
      this.filterConf.filters.push(fieldConf);
    }
    this.filterConf.andOperator = andOperator;
    super.addFilter(fieldConf, andOperator, doEmit);
    return this;
  }

  setPaging(page: number, perPage: number, doEmit: boolean = true): LocalDataSource {
    this.pagingConf.page = page;
    this.pagingConf.perPage = perPage;

    super.setPaging(page, perPage, doEmit);
    return this;
  }

  setPage(page: number, doEmit: boolean = true): LocalDataSource {
    this.pagingConf.page = page;
    super.setPage(page, doEmit);
    return this;
  }

  getSort(): any {
    return this.sortConf;
  }

  getFilter(): any {
    return this.filterConf;
  }

  getPaging(): any {
    return this.pagingConf;
  }

  protected prepareData(data: Array<any>): Array<any> {
    this.filteredAndSorted = this.sort(this.filter(data));
    return this.paginate(data);
  }

  protected sort(data: any[]): any[] {
    if (!this.sortConf.sorts) {
      return data;
    }
    let multiSortData: any = [];
    this.sortConf.sorts.forEach((fieldConf) => {
      if (fieldConf.direction && fieldConf.field.length) {
        if (this.sortConf.multiSort) {
          data = LocalSorter
            .sort(data, fieldConf.field, fieldConf.direction, fieldConf.compare);
        } else {
          multiSortData = LocalMultiSorter
            .sort(data, this.sortConf.sorts);
        }
      }
      data = LocalSorter
        .sort(data, fieldConf.field, fieldConf.direction, fieldConf.compare);
    });

    return !this.sortConf.multiSort ? data : multiSortData;
  }

  protected filter(data: any[]): any[] {
    if (!this.filterConf.filters) {
      return data;
    }

    let mergedData: any = [];
    this.filterConf.filters.forEach((fieldConf) => {
      if (fieldConf.search.length && fieldConf.field.length) {
        if (this.filterConf.andOperator) {
          data = LocalFilter
            .filter(data, fieldConf.field, fieldConf.search, fieldConf.filter);
        } else {
          mergedData = [...new Set([...mergedData, ...LocalFilter
            .filter(data, fieldConf.field, fieldConf.search, fieldConf.filter)])];
        }
      }
    });

    return this.filterConf.andOperator ? data : mergedData;
  }

  protected paginate(data: any[]): any[] {
    if (!this.pagingConf && this.pagingConf.page && this.pagingConf.perPage) {
      data = LocalPager.paginate(data, this.pagingConf.page, this.pagingConf.perPage);
    }
    return data;
  }
}
