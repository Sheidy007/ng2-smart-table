import { FilterOrEditConfigClass } from '../../../components/thead/rows/filter/filter.class';

export class Column {

  title ? = 'undefined';
  defaultValue ? = '';
  type?: 'html' | 'custom' | 'text' | 'string' = 'text';
  class ? = '';
  width ? = '';
  sort ? = true;
  defaultSortDirection?: 'desc' | 'asc' | '' = '';
  editable ? = true;
  addable ? = true;
  show ? = true;

  editor?: {
    type: 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default',
    config?: FilterOrEditConfigClass,
    component?: any
  } = { type: 'default', config: new FilterOrEditConfigClass(), component: null };

  filter?: {
    type?: 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default',
    config?: FilterOrEditConfigClass,
    component?: any
  } = { type: 'default', config: new FilterOrEditConfigClass(), component: null };

  editSeparateGrid?: { index?: number, width: string } = { index: 9999, width: '100%' };
  createSeparateGrid?: { index?: number, width: string } = { index: 9999, width: '100%' };

  renderComponent?: any = null;

  compareFunction?: (...attr) => number = null;
  valuePrepareFunction?: (...attr) => any = null;
  filterFunction?: (...attr) => boolean = null;
  onComponentInitFunction?: (...attr) => void = null;

  constructor(columnSettings: Column, public id?: string) {
    Object.keys(columnSettings).forEach(key => this[key] = columnSettings[key]);
  }

  getOnComponentInitFunction ? = (...attr) => {
    return this.onComponentInitFunction;
  };

  getCompareFunction ? = () => {
    return this.compareFunction;
  };

  getValuePrepareFunction ? = () => {
    return this.valuePrepareFunction;
  };

  getFilterFunction ? = () => {
    return this.filterFunction;
  };

  getConfig ? = () => {
    return this.editor && this.editor.config;
  };

  getFilterType  ? = () => {
    return this.filter ? this.filter.type : 'default';
  };

  getFilterConfig ? = () => {
    return this.filter ? this.filter.config : new FilterOrEditConfigClass();
  };
}
