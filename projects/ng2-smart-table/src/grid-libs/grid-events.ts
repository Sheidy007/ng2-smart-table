import { Subject } from 'rxjs';
import { LocalDataSource } from './source/local.data-source';

export class GridEvents {
  rowHover = new Subject<any>();
  selectedRows = new Subject<SelectedRowsI>();

  filter = new Subject<void>();
  sort = new Subject<void>();

  create = new Subject<void>();
  finishRowCreating = new Subject<any>();
  selectAndEdit = new Subject<any>();
  finishRowEdit = new Subject<any>();
  selectAndView = new Subject<any>();
  delete = new Subject<any>();

  constructor() {}
}

export interface SelectedRowsI {
  data?: any;
  isSelected?: boolean;
  source?: LocalDataSource;
  selectedRowsData?: any[];
  onAction?: boolean;
}

