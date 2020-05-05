import { DataSet } from './data-set';
import { ViewCell } from 'ng2-smart-table';
import { FilterOrEditConfigClass } from '../../components/thead/filter/filter.class';

export class Column {

  title = 'undefined';
  type: 'html' | 'custom' | 'text' = 'text';
  class = '';
  width = '';
  sort = true;
  defaultSortDirection: 'desc' | 'asc' | '' = '';
  editable = true;
  addable = true;
  editor: {
    type: 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default', config: FilterOrEditConfigClass, component: any
  }
    = { type: 'default', config: {}, component: null };

  filter: {
    type: 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default', config: FilterOrEditConfigClass, component: any
  }
    = { type: 'default', config: new FilterOrEditConfigClass(), component: null };

  renderComponent: any = null;

  compareFunction: () => number = null;
  valuePrepareFunction: () => any = null;
  filterFunction: () => boolean = null;

  onComponentInitFunction: () => ViewCell = null;
  defaultValue = '';
  constructor(public id: string, columnSettings: Column) {
    this.process(columnSettings);
  }

  getOnComponentInitFunction(): (...attr) => ViewCell {
    return this.onComponentInitFunction;
  }

  getCompareFunction(): () => number {
    return this.compareFunction;
  }

  getValuePrepareFunction(): () => any {
    return this.valuePrepareFunction;
  }

  getFilterFunction(): () => boolean {
    return this.filterFunction;
  }

  getConfig(): FilterOrEditConfigClass {
    return this.editor && this.editor.config;
  }

  getFilterType(): 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default' {
    return this.filter ? this.filter.type : 'default';
  }

  getFilterConfig(): FilterOrEditConfigClass {
    return this.filter ? this.filter.config : new FilterOrEditConfigClass();
  }

  protected process(columnSettings: Column) {
    Object.keys(columnSettings).forEach(key => this[key] = columnSettings[key]);
  }
}
