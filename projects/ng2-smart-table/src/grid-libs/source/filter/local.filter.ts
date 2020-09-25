import { FilterClass } from '../data-source';

export function filterValues(value: string, search: string): boolean {
  return value.toString().toLowerCase().includes(search.toString().toLowerCase());
}

export class LocalFilter {

  static filter(data: any[], fieldConf: FilterClass): any[] {
    const filter = fieldConf.filter ? fieldConf.filter : filterValues;
    return data.filter((el) => {
      const value = el[fieldConf.field] || el[fieldConf.field] === 0 || el[fieldConf.field] === false ? el[fieldConf.field] : fieldConf.defaultValue;
      return filter(value, fieldConf.search);
    });
  }
}

