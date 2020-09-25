import { FilterOrEditorConfig } from './filter-editor.config';
import { MultiStringFullFilter } from '../../source/filter/multi-string-full.filter';
import { Type } from '@angular/core';
import { Settings } from '../settings';
import * as moment from 'moment';
import { DateTimeFilter } from '../../source/filter/date-time.filter';
import { Private } from '../../sys/helpers';
import { DateTimeSorter } from '../../source/sorter/date-time.sorter';

export class Column {

  width ? = '0%';
  show ? = true;
  anchor ? = false;
  @Private() title ? = 'undefined';
  @Private() defaultValue?: string | number | boolean | [] = '';
  @Private() type?: 'html' | 'text' | 'date' | 'dateTime' | 'number' | 'boolean' | 'table' | 'custom' = 'text';
  @Private() class ? = '';
  @Private() minWidth ? = 0;
  @Private() sort ? = true;
  @Private() defaultSortDirection?: 'desc' | 'asc' | '' = '';
  @Private() editable ? = true;
  @Private() addable ? = true;

  tableSettings?: Settings;

  editor?: {
    type: 'custom' | 'completer' | 'checkbox' | 'list' | 'textarea' | 'default' | 'table', config?: FilterOrEditorConfig, component?: string | Type<any>
  } = { type: 'default', config: new FilterOrEditorConfig() };

  filter?: {
    type?: 'custom' | 'completer' | 'checkbox' | 'list' | 'multiList' | 'textarea' | 'default', config?: FilterOrEditorConfig, component?: string | Type<any>
  } = { type: 'default', config: new FilterOrEditorConfig() };
  @Private() filterMaxHeight?: number;

  editSeparate?: ColumnOnRowFunctionsSettings;
  createSeparate?: ColumnOnRowFunctionsSettings;
  showSeparate?: ColumnOnRowFunctionsSettings;

  @Private() renderComponent?: string | Type<any>;

  compareFunction?: (...attr) => number;
  filterFunction?: (...attr) => boolean;
  valuePrepareFunction?: (...attr) => any;
  onRenderComponentInstance?: (...attr) => void;

  columnFunctions?: ColumnFunctions;

  constructor(columnSettings: Column, public id?: string, filterMaxHeight?: number) {
    this.filterMaxHeight = filterMaxHeight;
    this.columnFunctions = new ColumnFunctions(this);
    this.columnFunctions.init(columnSettings);
  }

}

export class ColumnOnRowFunctionsSettings {
  separateGrid?: { gridColumnPosition?: number, gridColumnCount: number, gridRowPosition: number } = { gridColumnPosition: 9999, gridColumnCount: 0, gridRowPosition: 0 };
  separateGroup ? = '';

  constructor(me?: ColumnOnRowFunctionsSettings) {
    if (me) {
      if (me.separateGrid) {
        Object.keys(me.separateGrid).forEach(key => this.separateGrid[key] = me.separateGrid[key]);
      }
      if (me.separateGroup) {
        this.separateGroup = me.separateGroup;
      }
    }
  }
}

export class ColumnFunctions {

  constructor(private column: Column) {}

  init(columnSettings: Column) {
    Object.getOwnPropertySymbols(columnSettings).forEach((key) => {
      this.column[key['description']] = columnSettings[key['description']];
    });
    Object.keys(columnSettings).forEach(key => {
      if (this.column[key] !== this) {
        if (!['editSeparate', 'createSeparate', 'showSeparate'].includes(key)) {
          this.column[key] = columnSettings[key];
        } else {
          this.column[key] = new ColumnOnRowFunctionsSettings(columnSettings[key]);
        }
      }
    });
    if (this.column.filter && this.column.filter.type === 'multiList') {
      this.column.filterFunction = MultiStringFullFilter.filter;
    }
  }

  getOnComponentInitFunction() {
    return this.column.onRenderComponentInstance;
  }

  getCompareFunction() {
    return this.column.compareFunction ? this.column.compareFunction :
      this.column.type === 'date' || this.column.type === 'dateTime' ? DateTimeSorter.dateTimeCompareFunction
        : this.column.compareFunction;
  }

  getFilterFunction() {
    return this.column.filterFunction ? this.column.filterFunction :
      this.column.type === 'date' || this.column.type === 'dateTime' ? DateTimeFilter.dateTimeFilterFunction
        : this.column.filterFunction;
  }

  getValuePrepareFunction() {
    return this.column.valuePrepareFunction ? this.column.valuePrepareFunction :
      this.column.type === 'date' ? (value) => this.dateTimeToStringValuePrepareFunction(value, 'DD.MM.YYYY') :
        this.column.type === 'dateTime' ? (value) => this.dateTimeToStringValuePrepareFunction(value, 'DD.MM.YYYY HH:mm')
          : this.column.valuePrepareFunction;
  }

  getEditorConfig() {
    return this.column.editor && this.column.editor.config;
  }

  getFilterType() {
    return this.column.filter ? this.column.filter.type : 'default';
  }

  getFilterConfig() {
    return this.column.filter ? this.column.filter.config : new FilterOrEditorConfig();
  }

  dateTimeToStringValuePrepareFunction(value: any, format: string): string {
    const result = moment(value, ['DD.MM.YYYY', 'DD.MM.YYYY HH:mm', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm']);
    return result.isValid() ? result.format(format) : this.column.defaultValue.toString();
  }
}

