export function compareValues(direction: any, a: any, b: any): number {
  if (a < b) {
    return -1 * direction;
  }
  if (a > b) {
    return direction;
  }
  return 0;
}

export class LocalSorter {

  static sort(data: any[], field: string, direction: string, customCompare?: () => number): Array<any> {

    const dir: number = (direction === 'asc') ? 1 : -1;
    const compare: (direction: any, a: any, b: any) => number = customCompare ? customCompare : compareValues;

    return data.sort((a, b) => {
      return compare.call(null, dir, a[field], b[field]);
    });
  }
}

export class LocalMultiSorter {

  static sort(data: any[], setting: { field: string, direction: string, customCompare?: (direction: any, a: any, b: any) => number, dir?: number }[]): Array<any> {
    {
      setting.forEach(s => {
        s.dir = s.direction === 'asc' ? 1 : -1;
        s.customCompare = s.customCompare ? s.customCompare : compareValues;
      });
      return data.sort((a, b) => {
        let result = 0;
        setting.forEach(s => {
          const bufResult = s.customCompare(s.dir, a[s.field], b[s.field]);
          result = result || bufResult;
        });
        return result;
      });
    }
  }
}
