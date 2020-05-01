import { DataSet } from './data-set';
import { ViewCell } from 'ng2-smart-table';
import { FilterConfigClass } from '../../components/filter/filter.class';

export class Column {

  title = 'undefined';
  type: 'html' | 'custom' | 'text' = 'text';
  class = '';
  width = '';
  sort = false;
  editable = true;
  addable = true;
  defaultSortDirection: 'desc' | 'asc' | '' = '';
  editor: { type: string, config: any, component: any }
    = { type: '', config: {}, component: null };
  filter: { type: 'custom' | 'default', config: FilterConfigClass, component: any }
    = { type: 'default', config: new FilterConfigClass(), component: null };
  renderComponent: any = null;
  compareFunction: () => number = null;
  valuePrepareFunction: () => any = null;
  filterFunction: () => boolean = null;
  onComponentInitFunction: () => ViewCell = null;

  constructor(public id: string, protected columnSettings: Column, protected dataSet: DataSet) {
    this.process();
  }

  getOnComponentInitFunction(): () => ViewCell {
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

  getConfig(): any {
    return this.editor && this.editor.config;
  }

  getFilterType(): 'custom' | 'default' {
    return this.filter ? this.filter.type : 'default';
  }

  getFilterConfig(): FilterConfigClass {
    return this.filter ? this.filter.config : new FilterConfigClass();
  }

  protected process() {
    [
      'title'
      , 'class'
      , 'width'
      , 'editor'
      , 'filter'
      , 'sort'
      , 'editable'
      , 'addable'
      , 'renderComponent'
      , 'compareFunction'
      , 'valuePrepareFunction'
      , 'filterFunction'
      , 'onComponentInitFunction'
      , 'defaultSortDirection'
    ].forEach(
      field => this[field] = this.columnSettings[field] ? this.columnSettings[field] : this[field]
    );
  }
}
