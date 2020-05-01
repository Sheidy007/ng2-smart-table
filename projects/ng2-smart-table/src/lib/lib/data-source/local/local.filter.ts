export function filterValues(value: string, search: string): boolean {
  return value.toString().toLowerCase().includes(search.toString().toLowerCase());
}

export class LocalFilter {

  static filter(data: any[], field: string, search: string, customFilter?: () => boolean): Array<any> {
    const filter: (value: string, search: string) => boolean = customFilter ? customFilter : filterValues;

    return data.filter((el) => {
      const value = !el[field] ? '' : el[field];
      return filter.call(null, value, search);
    });
  }
}

