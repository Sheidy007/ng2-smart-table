import { LocalDataSource } from 'ng2-smart-table';
import { FilterClass, FilterConfClass } from './data-source.class';
import { LocalFilter } from './local.filter';

export class FilterSourceClass {

  filterConf: FilterConfClass = {
    filters: [],
    andOperator: true
  };

  constructor(public source: LocalDataSource) {

  }
  getFilter(): any {
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
    if (doEmit) {
      this.source.emitOnChanged('filter');
    }
    return this.source;
  }

  addFilter(fieldConf: FilterClass, andOperator = true, doEmit: boolean = true): LocalDataSource {
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
    if (!found) {
      this.filterConf.filters.push(fieldConf);
    }
    this.filterConf.andOperator = andOperator;
    if (doEmit) {
      this.source.emitOnChanged('filter');
    }
    return this.source;
  }

  filter(data: any[]): any[] {
    if (!this.filterConf.filters || !this.filterConf.filters.length) {
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

}
