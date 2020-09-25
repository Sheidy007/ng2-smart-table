import { SortClass } from '../data-source';

export function compareValues(direction: any, a: any, b: any): number {
  if (a == null || b != null && a < b) {
    return -1 * direction;
  } else if (b == null || a > b) {
    return direction;
  }
  return 0;
}

export class LocalSorter {

  static sort(data: any[], fieldConf: SortClass): any[] {

    return data.sort((a, b) => {
      return fieldConf.compare
        ? fieldConf.compare(( fieldConf.direction === 'asc' ) ? 1 : -1
          , a[fieldConf.field] || a[fieldConf.field] === 0 || a[fieldConf.field] === false ? a[fieldConf.field] : a.defaultValue,
          b[fieldConf.field] || b[fieldConf.field] === 0 || b[fieldConf.field] === false ? b[fieldConf.field] : b.defaultValue) :
        compareValues(( fieldConf.direction === 'asc' ) ? 1 : -1
          , a[fieldConf.field] || a[fieldConf.field] === 0 || a[fieldConf.field] === false ? a[fieldConf.field] : a.defaultValue,
          b[fieldConf.field] || b[fieldConf.field] === 0 || b[fieldConf.field] === false ? b[fieldConf.field] : b.defaultValue);
    });
  }
}

export class LocalMultiSorter {

  static sort(data: any[], setting: SortClass[]): any[] {
    {
      return data.sort((a, b) => {
        let result = 0;
        setting.forEach(s => {
          const bufResult = s.compare
            ? s.compare(s.direction === 'asc' ? 1 : -1, a[s.field] || a[s.field] === 0 ? a[s.field] : s.defaultValue,
              b[s.field] || b[s.field] === 0 ? b[s.field] : s.defaultValue) :
            compareValues(s.direction === 'asc' ? 1 : -1, a[s.field] || a[s.field] === 0 ? a[s.field] : s.defaultValue,
              b[s.field] || b[s.field] === 0 ? b[s.field] : s.defaultValue);
          result = result || bufResult;
        });
        return result;
      });
    }
  }
}
