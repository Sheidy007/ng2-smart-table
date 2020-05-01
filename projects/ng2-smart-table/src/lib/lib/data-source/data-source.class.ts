export class DataSourceClass {
  action: 'refresh' |
    'load' |
    'prepend' |
    'append' |
    'add' |
    'remove' |
    'update' |
    'empty' |
    'sort' |
    'filter' |
    'paging' |
    'page';
  elements: any;
  paging: PagingClass;
  filter: FilterConfClass;
  sort: SortClass[];
}

export class PagingClass {
  page: number;
  perPage: number;
}

export class FilterClass {
  field: string;
  search: string;
  filter: () => boolean;
}

export class FilterConfClass {
  filters: FilterClass[];
  andOperator: boolean;
}

export class SortClass {
  field: string;
  direction: 'desc' | 'asc' | '';
  compare: () => number;
}

export class SortConfClass {
  sorts: SortClass[];
  multiSort: boolean;
}
