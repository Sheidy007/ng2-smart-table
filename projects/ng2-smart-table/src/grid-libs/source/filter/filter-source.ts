import { LocalDataSource } from '../local.data-source';
import { FilterClass, FilterConfClass } from '../data-source';
import { LocalFilter } from './local.filter';

export class FilterSource {

  filterConf: FilterConfClass = {
    filters: [], andOperator: true
  };

  constructor(public source: LocalDataSource) {

  }

  getFilter(): FilterConfClass {
    return this.filterConf;
  }

  /**
   *
   * Array of conf objects
   * [
   *  {field: string, search: string, filter: Function|null},
   * ]
   * @param conf contain conf
   * @param andOperator contain andOperator
   * @returns LocalDataSource contain LocalDataSource
   */

  setFilter(conf: FilterClass[], andOperator = true): LocalDataSource {
    if (conf && conf.length && conf.filter(c => !!c.search).length) {
      conf.forEach((fieldConf) => {
        this.addFilter(fieldConf, andOperator);
      });
    } else {
      this.filterConf = {
        filters: [], andOperator: true
      };
    }
    this.filterConf.andOperator = andOperator;
    return this.source;
  }

  addFilter(fieldConf: FilterClass, andOperator = true): LocalDataSource {
    if (!fieldConf.field) {
      throw new Error('Filter configuration object is not valid');
    }

    let found = false;
    this.filterConf.filters.forEach((currentFieldConf: FilterClass, index: any) => {
      if (currentFieldConf.field === fieldConf.field) {
        this.filterConf.filters[index] = fieldConf;
        found = true;
      }
    });
    if (!found && fieldConf.search != null) {
      this.filterConf.filters.push(fieldConf);
    }
    this.filterConf.andOperator = andOperator;
    return this.source;
  }

  filter(data: any[]): any[] {
    this.filterConf.filters = this.filterConf.filters.filter(f => f.search != null && f.field);
    if (!this.filterConf.filters || !this.filterConf.filters.length) {
      return data;
    }
    let mergedData: any = [];
    this.filterConf.filters.forEach((fieldConf) => {
      if (this.filterConf.andOperator) {
        data = LocalFilter.filter(data, fieldConf);
      } else {
        mergedData = [...new Set([...mergedData, ...LocalFilter.filter(data, fieldConf)])];
      }
    });

    return this.filterConf.andOperator ? data : mergedData;
  }

}
