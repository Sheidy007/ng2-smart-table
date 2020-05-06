import { LocalDataSource } from 'ng2-smart-table';
import { SortClass, SortConfClass } from './data-source.class';
import { LocalMultiSorter, LocalSorter } from './local.sorter';

export class SorterSourceClass {

  sortConf: SortConfClass = {
    sorts: [],
    multiSort: false
  };

  constructor(public source: LocalDataSource) {

  }

  getSort(): SortConfClass {
    return this.sortConf;
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
  setSort(conf: SortClass[], multiSort = false): LocalDataSource {
    if (conf && conf.length) {
      conf.forEach((fieldConf) => {
        this.addSort(fieldConf, multiSort);
      });
    } else {
      this.sortConf = {
        sorts: [],
        multiSort: true
      };
    }
    this.sortConf.multiSort = multiSort;
    return this.source;
  }

  addSort(fieldConf: SortClass, multiSort = false): LocalDataSource {
    if (!fieldConf.field) {
      throw new Error('Sort configuration object is not valid');
    }

    if (!multiSort) {
      this.sortConf.sorts = [];
    }

    if (!fieldConf.direction) {
      this.sortConf.sorts = this.sortConf.sorts.filter(s => s.field !== fieldConf.field);
    } else {
      const findSort = this.sortConf.sorts.find(s => s.field === fieldConf.field);
      if (!findSort) {
        this.sortConf.sorts.push(fieldConf);
      } else {
        findSort.direction = fieldConf.direction;
      }
    }

    this.sortConf.multiSort = multiSort;
    return this.source;
  }

  sort(data: any[]): any[] {
    if (!this.sortConf.sorts || !this.sortConf.sorts.length) {
      return data;
    }
    if (!this.sortConf.multiSort) {
      const fieldConf = this.sortConf.sorts[0];
      data = LocalSorter
        .sort(data, fieldConf.field, fieldConf.direction, fieldConf.compare);
    } else {
      data = LocalMultiSorter
        .sort(data, this.sortConf.sorts);
    }
    return data;
  }

}
