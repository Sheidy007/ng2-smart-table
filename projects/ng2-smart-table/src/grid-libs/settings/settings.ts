import { Column } from './column/column';
import { Observable } from 'rxjs';
import { EventEmitter, Type } from '@angular/core';
import { Deferred } from '../sys/helpers';
import { Grid } from '../grid';

export interface SimpleSettings {
  innerTableWidthPc: number;
  tableWithDetailWidth: number;
  detailsWidth: number;
  quickViewWidth: number;
  expandRowHeight: number;
  columns: Column[];
}

export class Settings {
  settingsName ? = '';
  minOuterTableWidthStr ? = '400px';

  innerTableWidthPc ? = 100;
  minColumnWidthPc ? = 75;

  innerTableHeightPx ? = 600;
  minRowHeightPx ? = 23;
  bufferVirtualScrollCount ? = 8;
  resizerSize ? = 4;

  quickViewWidth ? = 10;
  minQuickViewWidth ? = 30;
  maxQuickViewWidth ? = 80;

  detailsWidth ? = 60;
  minDetailsWidth ? = 10;
  maxDetailsWidth ? = 90;

  expandRowHeight ? = 10;
  minExpandRowHeight ? = 10;
  maxExpandRowHeight ? = 80;

  selectMode?: 'single' | 'multi' = 'single';
  multiCompare ? = false;
  andOperator ? = true;

  hideSumRow ? = true;
  hideHeader ? = false;
  hideSubHeader ? = false;
  isPagerDisplay ? = true;
  actions?: ActionsClass = new ActionsClass();
  filter?: { inputClass: string } = { inputClass: '' };
  columns: { [name: string]: Column } = {};
  noDataMessage ? = 'No data found';
  rowClassFunction?: (...attr) => string = () => '';
  canSelectedFunction?: (...attr) => boolean = () => true;

  constructor(me?: Settings) {
    if (me) {
      if (me.actions) {
        this.actions.add = me.actions.add ? new AddClass(me.actions.add) : null;
        this.actions.edit = me.actions.edit ? new EditClass(me.actions.edit) : null;
        this.actions.delete = me.actions.delete ? new DeleteClass(me.actions.delete) : null;
        this.actions.show = me.actions.show ? new ShowClass(me.actions.show) : null;
        if (me.actions.custom) {
          this.actions.custom = [];
          me.actions.custom.forEach((action) => {
            const custom = new BaseActionClass(action);
            this.actions.custom.push(custom);
          });
        }
        Object.keys(me.actions).forEach(key => {
            this.actions[key] = !['add', 'edit', 'delete', 'show', 'custom'].includes(key) ? me.actions[key] : this.actions[key];
          }
        );
      }
      Object.keys(me).forEach(key => {
        if (key !== 'actions') {
          this[key] = me[key];
        }
      });
      if (me.columns) {
        Object.keys(me.columns).forEach(key => this.columns[key] = new Column(me.columns[key], key, this.innerTableHeightPx - this.minRowHeightPx));
      }
    }
  }

}

export class ActionsClass {
  titleLeft ? = 'ActionsL';
  titleRight ? = 'ActionsR';
  closeContent ? = 'X';

  selectorPosition?: 'left' | 'right' | 'top' | 'bottom' = 'left';

  edit?: EditClass;
  add?: AddClass;
  delete?: DeleteClass;
  show?: ShowClass;

  custom ?: BaseActionClass[] = [];

  constructor() {}
}

export class BaseActionClass {
  id ? = '';
  title ? = '';
  content ? = 'none';
  position?: 'left' | 'right' | 'top' | 'bottom' = 'left';
  concatWithColumnName ? = '';

  showActionOverThis ? = false;
  positionAsOverAction?: 'none' | 'top' | 'bottom' = 'none';

  dblclickOnRow ? = false;

  inputClass ? = '';
  viewType?: 'inline' | 'expandRow' | 'quickView' | 'details' | 'modal' = 'inline';
  detailColumnName?: string;
  onComponentInitObservable?: (...attr) => Observable<any>;
  customComponent?: string | Type<any>;

  confirm?: EventEmitter<ActionResultClass>;
  actionEvent?: EventEmitter<ActionResultClass>;

  innerActions?: { [name: string]: InnerAction };
  data?: any;
  preInitResultData?: any;
  separateHeader?: (...attr) => string = () => '';
  showActionFunction?: (...attr) => boolean = () => true;

  constructor(me?: BaseActionClass) {
    Object.keys(me).forEach(key => this[key] = me[key]);
  }
}

export interface InnerAction {
  content: string;
  closeAfterAction: boolean;
  position?: 'top' | 'bottom';
  hideInSeparate?: boolean;
}

export class EditClass extends BaseActionClass {
  id ? = 'edit';
  content ? = 'Edit';
  innerActions?: { [name: string]: InnerAction } = {
    update: { content: 'Update', closeAfterAction: true },
    cancel: { content: 'Cancel', closeAfterAction: true }
  };

  constructor(me?: EditClass) { super(me); }
}

export class AddClass extends BaseActionClass {
  id ? = 'add';
  content ? = 'Add New';
  innerActions?: { [name: string]: InnerAction } = {
    create: { content: 'Create', closeAfterAction: true },
    cancel: { content: 'Cancel', closeAfterAction: true }
  };

  constructor(me?: AddClass) { super(me); }
}

export class ShowClass extends BaseActionClass {
  id ? = 'show';
  title ? = 'Details';
  innerActions?: { [name: string]: InnerAction } = {
    show: { content: 'Show', closeAfterAction: false, hideInSeparate: true },
    hide: { content: 'Hide', closeAfterAction: true, hideInSeparate: true }
  };

  constructor(me?: ShowClass) { super(me); }
}

export class DeleteClass extends BaseActionClass {
  id ? = 'delete';
  content ? = 'Delete ';

  constructor(me?: DeleteClass) { super(me); }
}

export class ActionResultClass {
  grid: Grid;
  action: BaseActionClass;
  innerActionId?: string;
  confirm?: Deferred;
  rowData?: any;
  newRowData?: any;
}

export class ComponentLoader {
  [component: string]: Type<any>;
}
