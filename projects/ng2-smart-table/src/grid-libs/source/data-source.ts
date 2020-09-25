export class DataSource {
  action?: 'refresh' |
    'load' |
    'prepend' |
    'append' |
    'add' |
    'unshift' |
    'remove' |
    'update' |
    'updateField' |
    'empty' |
    'sort' |
    'filter' |
    'page' |
    'pageByUser';
  elements?: any[];
  paging?: PagingClass;
  filter?: FilterConfClass;
  sort?: SortConfClass;
  changedElements?: any;
}

export class PagingClass {
  page: number;
  perPage: number;
}

export class FilterClass {
  field: string;
  search: string;
  filter?: (value: string, search: string) => boolean;
  defaultValue?: any;
}

export class FilterConfClass {
  filters: FilterClass[];
  andOperator: boolean;
}

export class SortClass {
  field: string;
  direction: 'desc' | 'asc' | '';
  compare?: (direction: any, a: any, b: any) => number;
  defaultValue?: any;
}

export class SortConfClass {
  sorts: SortClass[];
  multiSort: boolean;
}
